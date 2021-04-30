import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { MenuItem, FormControl, InputLabel, Select, Snackbar, } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import {baseUrl} from '../../config'
import { connect } from 'react-redux'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

function AddSubject(props) {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [credit, setCredit] = useState('')
  const [faculty, setFaculty] = useState('')
  const [subject, setSubject] = useState('')
  const [msg, setMsg] = useState('')

  const [teachers, setTeacher] = useState([])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFaculty('')
    setSubject('')
    setCredit('')
  };

  const handleClose2 = () => {
    setOpen2(false);

  };

  useEffect(()=>{
      axios.get(`${baseUrl}/teachers`, {
        headers: {
            "x-access-token": props.auth.token,
        },
      })
      .then((res)=>{
          setTeacher(res.data.teachers)
          console.log(res.data.teachers)
      })
      .catch(()=>{
          console.log('Something went wrong')
      })
  }, [])

  function createSubject() {
    
    if(subject !== '' & credit !== '' & faculty !== ''){
        console.log(subject, credit, faculty)
        axios.post(`${baseUrl}/createSubject`, {
            name: subject,
            teacherID: faculty,
            credit: credit
        }, {
            headers: {
                "x-access-token": props.auth.token,
            },
        })
        .then((res)=>{
            setMsg(res.data.message)
            setOpen2(true)
        })
    }
    else {
        console.log('cant do it')
    }
    handleClose()
  }

  return (
    <div>
        <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
  <Alert onClose={handleClose2} severity="success">
    {msg}
  </Alert>
</Snackbar>
        <Fab component="span" 
        onClick={handleClickOpen}
        style={{
          color: 'black',
          margin: 10
        }}>
          <AddIcon />
        </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create A New Subject</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Fill the detail of the new subject...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Subject name"
            type="email"
            fullWidth
            value={subject}
            onChange={e=>setSubject(e.target.value)}
          />
          <FormControl style={{marginLeft: 10, width: 80}}>
        <InputLabel id="demo-simple-select-label">Credit</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={credit}
          onChange={e=>setCredit(e.target.value)}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>

        </Select>
      </FormControl>

      <FormControl style={{marginLeft: 10, width: 80}}>
        <InputLabel id="demo-simple-select">Faculty</InputLabel>
        <Select
          labelId="demo-simple-select"
          id="demo-simple-select"
          value={faculty}
          onChange={e=>setFaculty(e.target.value)}
        >
            {
                teachers.map((val)=>{
                    return <MenuItem key={val._id}  value={val._id}>{val.name}</MenuItem>
                })
            }
        </Select>
      </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createSubject} color="primary">
            Create Subject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const matchStateToProps = (state) => {
    return {
      auth: state.auth,
    };
  };
  
export default connect(matchStateToProps)(AddSubject);