import React, { useState } from 'react'
import { Button, TableCell, Snackbar } from '@material-ui/core'
import axios from 'axios'
import { baseUrl } from '../../config'
import { connect } from 'react-redux'
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


function AcceptRejectBtn(props) {

    const [clicked, setClicked] = useState(false)
    const [msg, setMsg] = useState('')
    const [open2, setOpen2] = React.useState(false);


    const handleClose2 = () => {
        setOpen2(false);
    
      };

    const setApproved = ()=>{
        setClicked(true)
        axios.post(`${baseUrl}/approveenroll`, {
            enrollId: props.enrollId
        },
        {
            headers: {
                'x-access-token': props.auth.token
            }
        }
        )
        .then((res)=>{
            setMsg(res.data.message)
            setOpen2(true)
        })
        .catch((err)=>{
            console.log(err)
            setMsg('Something went wrong')
            setOpen2(true)
        })
    }

    const setReject = ()=>{
        setClicked(true)
        axios.post(`${baseUrl}/rejectenroll`, {
            enrollId: props.enrollId
        },
        {
            headers: {
                'x-access-token': props.auth.token
            }
        }
        )
        .then((res)=>{
            setMsg(res.data.message)
            setOpen2(true)
        })
        .catch((err)=>{
            console.log(err)
            setMsg('Something went wrong')
            setOpen2(true)
        })
    }

    return (
        <>
        <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
        <Alert onClose={handleClose2} severity="success">
            {msg}
        </Alert>
        </Snackbar>
            <TableCell><Button style={{backgroundColor: 'green'}} disabled={clicked} onClick={setApproved}>Accept</Button></TableCell>
            <TableCell><Button style={{backgroundColor: 'red'}} disabled={clicked} onClick={setReject}>Reject</Button></TableCell>
        </>
    )
}

const matchStateToProps = (state) => {
    return {
      auth: state.auth,
    };
  };


export default connect(matchStateToProps)(AcceptRejectBtn)
