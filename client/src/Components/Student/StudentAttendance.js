import { TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Grid } from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect} from "react";
import { connect } from "react-redux";
import { baseUrl } from "../../config";

function StudentAttendance(props) {

  const [attendance, setAttendance] = useState([])
  const [total, setTotal] = useState([])

  useEffect(()=>{
    axios.get(`${baseUrl}/attendance`, {
      headers: {
        'x-access-token': props.auth.token
      }
    })
    .then((res)=>{
      setAttendance(res.data.attendance)
      axios.get(`${baseUrl}/uniqueAttendance`, {
        headers: {
          'x-access-token': props.auth.token
        }
      })
      .then((res)=>{
        setTotal(res.data.days)

      })
    })
  }, [])

  return <div  style={{
    marginLeft: 240,
  }}>
    <Grid container alignContent="flex-start">
      <Paper elevation={3} style={{margin: 20,padding: 10}}>
     <TableContainer >
  <TableHead>
  <TableCell align="right">Date</TableCell>
  <TableCell align="right">Day</TableCell>
  <TableCell align="right">Time</TableCell>
  <TableCell align="right">Status</TableCell>

</TableHead>
<TableBody>
      {
          total.map((val, i)=>{
              let req = (attendance.filter((val2)=>val2.date === val))
              return (<TableRow>
                  <TableCell>{val}</TableCell>
                  <TableCell>{req.length !== 0?req[0].date:'-'}</TableCell>
                  <TableCell>{req.length !== 0?req[0].time:'-'}</TableCell>
                  <TableCell>{req.length !== 0?'Present':'Absent'}</TableCell>

                  </TableRow>)
          })
      }
      </TableBody>
  </TableContainer>
  </Paper>
  </Grid>
  </div>;
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};


export default connect(matchStateToProps)(StudentAttendance);
