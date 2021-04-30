import React, { useEffect, useState } from "react";
import Axios from "axios"
import { connect } from "react-redux"
import { baseUrl } from "../../config"
import { Button, Input, Paper, Typography, Grid } from "@material-ui/core"
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ServerDialog from "../ServerDialog";
import AddSubject from "./AddSubject"

function AdminDashboard(props) {


  const [selectedFile, setSelectedFile] = useState(null)
  const [src, setSrc] = useState(null)
  const [routine, setRoutine] = useState(null)

  function getSubject() {
    Axios.get(`${baseUrl}/subjects`, {
      headers: {
        "x-access-token": props.auth.token,
      },
    })
    .then(()=>{
      console.log('API call success')
    })
  }

  useEffect(()=>{
    Axios.get(`${baseUrl}/routine`, {
      headers: {
        "x-access-token": props.auth.token,
      },
    })
    .then((res)=>{
      setRoutine(res.data.url)
    })
  }, [])

  function uploadImage() {
    handleClickOpen()
    if (selectedFile !== null) {
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "file", 
        selectedFile.file, 
      ); 

      Axios.post(`${baseUrl}/routine`, formData, {
        headers: {
          'x-access-token': props.auth.token,
        }
      })
      .then((res)=>{
        setMsg(res.data.message)
        Axios.get(`${baseUrl}/routine`, {
          headers: {
            "x-access-token": props.auth.token,
          },
        })
        .then((res)=>{
          setRoutine(res.data.url)
        })
        .catch((err)=>{
          console.log('Something went wrong')
        })
      })
      .catch((err)=>{
        console.log(err)
      })
    }
    else {
      setMsg("No image selected")

    }    
  }

  function handleUploadClick(event) {
    console.log();
    let file = event.target.files[0];
    setSelectedFile({file: file})   
    var reader = new FileReader();

    reader.onload = function (e) {
        setSrc(e.target.result)
    };

    reader.readAsDataURL(event.target.files[0]); 
  }

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
    setSelectedFile(null)
    setSrc(null)
  }

  return (<div>
    <ServerDialog handleClickOpen={handleClickOpen} handleClose={handleClose} open={open} msg={msg} />
    <Grid container>


    <Paper elevation={3} style={{marginLeft: 20, padding: 5}}>
      <Typography variant="h4">
        Upload Routine
      </Typography>
      <input
              accept="image/*"
              style={{display: "none"}}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUploadClick}

            />
            <label htmlFor="contained-button-file">
              <Fab component="span" style={{
                color: 'blue',
                margin: 10
              }}>
                <AddIcon />
              </Fab>
            </label>
      <Typography>{selectedFile? selectedFile.file.name: null}</Typography>
      <img id="blah" src={src} height="50"  alt="" />

    <Button onClick={uploadImage}>Upload</Button>
    </Paper>

    <Paper elevation={3}  style={{marginLeft: 20, padding: 5}}>
      <img src={routine} height={100} width={200} />
      <Typography>Current Routine</Typography>
    </Paper>

    <Paper elevation={3}  style={{marginLeft: 20, padding: 5}}>
      <Typography variant='h4'>Create Subject</Typography>
      <AddSubject />
      <Typography>Provide subject details</Typography>
    </Paper>

    </Grid>

    </div>);
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(matchStateToProps)(AdminDashboard);
