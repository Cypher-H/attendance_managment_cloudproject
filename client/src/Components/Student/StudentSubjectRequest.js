import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Grid, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Axios from "axios"
import { baseUrl } from '../../config'
import {connect} from "react-redux"
import RequestEnroll from './RequestEnroll'

function StudentSubjectRequest(props) {

    const [subjects, changeSubjects] = useState([])
    useEffect(()=>{
        Axios.get(`${baseUrl}/subjects`, {
            headers: {
                "x-access-token": props.auth.token
            }
        })
        .then((res)=>{
            console.log(res.data)
            changeSubjects(res.data.subjects)
        })
    }, [])

    return (
        <Grid style={{marginLeft: 240}}>
            <TableContainer style={{margin: 20, boxSizing: 'border-box'}}>
            <TableHead>
          <TableRow>
            
            <TableCell align="right">Subject Name</TableCell>
            <TableCell align="right">Credit</TableCell>
            <TableCell align="right">Faculty Incharge</TableCell>
            <TableCell align="right">Total Enrollment</TableCell>
            <TableCell align="right">Request Enrollment</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
                {
                    subjects.map((val, i)=>{
                        if (props.profile.subjects === val._id) {
                            return null
                        }
                        return (
                        <TableRow>
                            <TableCell>{val.Name}</TableCell>
                            <TableCell>{val.Credit}</TableCell>
                            <TableCell>{val.Teacher.name}</TableCell>
                            <TableCell>{val.Students.length}</TableCell>
                            <TableCell><RequestEnroll subjectId={val._id}/></TableCell>
                            
                            </TableRow>)
                    })
                }
                </TableBody>
            </TableContainer>
            </Grid>
    )
}

const matchStateToProps = (state) => {
    return {
      auth: state.auth,
      profile: state.profile
    };
  };
  
export default connect(matchStateToProps)(StudentSubjectRequest)

