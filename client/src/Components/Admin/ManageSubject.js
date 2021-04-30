import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Axios from "axios"
import { baseUrl } from '../../config'
import {connect} from "react-redux"

function ManageSubject(props) {

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
        <div>
            <TableContainer component={Paper} style={{margin: 20, alignItems: "center", justify: "center"}}>
            <TableHead>
          <TableRow>
            
            <TableCell align="right">Subject Name</TableCell>
            <TableCell align="right">Credit</TableCell>
            <TableCell align="right">Faculty Incharge</TableCell>
            <TableCell align="right">Total Enrollment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
                {
                    subjects.map((val, i)=>{
                        return (<TableRow>
                            <TableCell>{val.Name}</TableCell>
                            <TableCell>{val.Credit}</TableCell>
                            <TableCell>{val.Teacher.name}</TableCell>
                            <TableCell>{val.Students.length}</TableCell>

                            
                            </TableRow>)
                    })
                }
                </TableBody>
            </TableContainer>
        </div>
    )
}

const matchStateToProps = (state) => {
    return {
      auth: state.auth,
    };
  };
  
export default connect(matchStateToProps)(ManageSubject)
