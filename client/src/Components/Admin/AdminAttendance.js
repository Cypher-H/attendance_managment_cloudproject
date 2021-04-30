import { Paper, TableCell, TableContainer, TableHead, TableBody, TableRow, Box,CircularProgress, Typography } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { baseUrl } from '../../config'

function CircularProgressWithLabel(props) {
  
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={props.progress} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.progress,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  

function AdminAttendance(props) {

    const [allStudent, setStudent] = useState([])

    useEffect(()=>{
        axios.get(`${baseUrl}/attendance`,
        {
            headers: {
                'x-access-token': props.auth.token 
                }
        })
        .then((res)=>{
            //setAttendance(res.data.attendance)
            axios.get(`${baseUrl}/uniqueAttendance`,
            {
                headers: {
                    'x-access-token': props.auth.token 
                    }
            })
            .then(res1=>{
                //setTotal(res1.data.days)
                console.log(res1.data.days)
                let alldata = []
                let allIds = []
                console.log(res.data.attendance)
                res.data.attendance.forEach((att)=>{
                    if (!allIds.includes(att.Student._id)) {
                        let i = 0

                        res.data.attendance.forEach((att1)=>{
                            if (att.Student._id === att1.Student._id){
                                i++
                            }
                        })
                        alldata.push({
                            name: att.Student.name,
                            id: att.Student.idnumber,
                            number: att.Student.number,
                            email: att.Student.email,
                            subjects: att.Student.Subjects?att.Student.Subjects.length:0,
                            attendance: (i/res1.data.days.length)*100,
                            url: att.Student.url
                        })
                        allIds.push(att.Student._id)
                    }                
                })
                setStudent(alldata)

            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log('something went wrong')
        })
    }, [])

    return (
        <Paper style={{margin: 20, padding: 10}}>
            <TableContainer>
                <TableHead>
                    <TableCell align="right">Photo</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Id</TableCell>
                    <TableCell align="right">Number</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Subjects</TableCell>
                    <TableCell align="right">Attendance</TableCell>
                </TableHead>
                <TableBody>
                    {
                        allStudent.map((val, i)=>{
                            return(
                                <TableRow key={i}>
                                    <TableCell align="right"><img height={30} src={val.url} /></TableCell>
                                    <TableCell align="right">{val.name}</TableCell>
                                    <TableCell align="right">{val.id}</TableCell>
                                    <TableCell align="right">{val.number}</TableCell>
                                    <TableCell align="right">{val.email}</TableCell>
                                    <TableCell align="right">{val.subjects}</TableCell>
                                    <TableCell align="right"><CircularProgressWithLabel progress={val.attendance} /></TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </TableContainer>
        </Paper>
    )
}

const matchStateToProps = (state) => {
    return {
      auth: state.auth,
    };
  };

export default connect(matchStateToProps)(AdminAttendance)
