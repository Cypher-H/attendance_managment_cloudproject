import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { baseUrl } from '../../config'
import AcceptRejectBtn from './AcceptRejectBtn'

function EnrollmentRequests(props) {

    const [enrollment, setEnrollment] = useState([])

    useEffect(()=>{
        axios.get(`${baseUrl}/enrollment`, {
            headers: {
                'x-access-token' : props.auth.token
            }
        })
        .then((res)=>{
            console.log(res.data)
            setEnrollment(res.data.enrollment)
        })
        .catch((err)=>{
            console.log('Something went wrong')
        })
    }, [])
    return (
        <div style={{marginLeft: 20}}>
            <TableContainer >
                <TableHead >
                    <TableCell>Sno.</TableCell>
                    <TableCell>Student Id</TableCell>
                    <TableCell>Student name</TableCell>
                    <TableCell>Student email</TableCell>
                    <TableCell>Requested Subject</TableCell>
                    <TableCell>Accept</TableCell>
                    <TableCell>Reject</TableCell>

                </TableHead>
                <TableBody>
                    {
                        enrollment.map((val, i)=>{
                            return (
                                <TableRow key={i}>
                                    <TableCell>{i}</TableCell>
                                    <TableCell>{val.Student.idnumber}</TableCell>
                                    <TableCell>{val.Student.name}</TableCell>
                                    <TableCell>{val.Student.email}</TableCell>
                                    <TableCell>{val.Subject.Name}</TableCell>
                                    <AcceptRejectBtn enrollId={val._id}/>
                                </TableRow>
                            )
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

export default connect(matchStateToProps)(EnrollmentRequests)
