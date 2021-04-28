//including header files
//creator: Honey Bhardwaj
 
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include "RTClib.h"
#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

constexpr uint8_t RST_PIN = D3;     // Configurable, see typical pin layout above
constexpr uint8_t SS_PIN = D4;     // Configurable, see typical pin layout above

MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key;

String tag;

//creating rtc object
RTC_DS1307 rtc;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

/* Set these to your desired credentials. */
//ENTER YOUR WIFI SETTINGS
const char *ssid = "tendaa"; 
const char *password = "yash11oct547@";

//Web/Server address to read/write from 
const char *host = "http://135a008ca1b8.ngrok.io/honey";

//=======================================================================
//                    Power on setup
//=======================================================================

void setup() {
  Serial.begin(9600);
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522
  connectwifi();
  initializertc();
  
}

//=======================================================================
//                    Main Program Loop
//=======================================================================
void loop() {
  HTTPClient http;    //Declare object of class HTTPClient
  DateTime now = rtc.now();
  String date = "\""+String(now.year())+"/"+String(now.month())+"/"+String(now.day())+"\"";
  String dow =  "\""+String(daysOfTheWeek[now.dayOfTheWeek()])+"\"";
  String tym =  "\""+String(now.hour())+":"+String(now.minute())+":"+String(now.second())+"\"";
  String uid = readtag();

  if (uid == "1"){
      return;
    }
  else{
    http.begin("http://135a008ca1b8.ngrok.io/honey");       //Specify request destination
    http.addHeader("Content-Type", "application/json");    //Specify content-type header
  
    int httpCode = http.POST("{\"date\":"+date+",\"day\":"+dow+",\"time\":"+tym+",\"uid\":"+uid+"}");   //Send the request
    String payload = http.getString();    //Get the response payload
  
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
  
    http.end();  //Close connection
    }

}


void connectwifi(){
  delay(1000);
  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);        //This line hides the viewing of ESP as wifi hotspot
  WiFi.begin(ssid, password);     //Connect to your WiFi router
  Serial.println("");
  Serial.print("Connecting");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  //If connection successful show IP address in serial monitor
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //IP address assigned to your ESP
  }

  void initializertc(){
  delay(3000); // wait for console opening

  if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }

  if (!rtc.isrunning()) {
    Serial.println("RTC lost power, lets set the time!");
  
  // Comment out below lines once you set the date & time.
    // Following line sets the RTC to the date & time this sketch was compiled
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }
    }

  String readtag(){
    tag = "";
    if ( ! rfid.PICC_IsNewCardPresent())
    return no_execute();
  if (rfid.PICC_ReadCardSerial()) {
    for (byte i = 0; i < 4; i++) {
      tag += rfid.uid.uidByte[i];
    }
    return tag;
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    }
   }

 String no_execute(){
  return "1";
  }
