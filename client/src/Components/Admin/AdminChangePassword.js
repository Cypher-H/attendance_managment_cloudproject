import { Box, Button, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Paper, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import { baseUrl } from '../../config';
import { connect } from 'react-redux';

function AdminChangePassword(props) {

    const [current, changeCurrent] = useState('')
    const [currentShow, changeCurrentShow] = useState(false)

    const [newpass, changeNew] = useState('')
    const [newShow, changeNewShow] = useState(false)

    const [newpassre, changeNewre] = useState('')
    const [newShowre, changeNewShowre] = useState(false)

    function changePasswordRequest() {
        if (newpass === newpassre && newpass !== '' && newpassre !== ''){
            axios.post(`${baseUrl}/passwordchange`,{
                userId: props.auth.uid, 
                password: current, 
                newPassword: newpass
            }, {
                headers: {
                    'x-access-token': props.auth.token
                }
            })
            .then((res)=>{
                console.log(res.data)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else {
            alert('Two passwords not matching')
        }
        
    }

    return (
        <div>
            <Paper 
            style={{marginInline: '5%', marginTop: '15px', padding: '5px'}}
            elevation={5}>
                <Box fontSize={32} fontFamily='Monospace' fontWeight={600} fontStyle='italic' letterSpacing={3} textAlign='center'>
                    Change Password
                </Box>
            <Grid 
            container
            direction= 'row'
            justify='space-around'
            >
            <Grid item style={{marginBlock: 20}}>
                <FormControl>
                    <InputLabel htmlFor="standard-adornment-password">Current Password</InputLabel>
                    <Input
                    id="standard-adornment-password"
                    type={currentShow ? 'text' : 'password'}
                    value={current}
                    onChange={(e)=>{changeCurrent(e.target.value)}}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>{changeCurrentShow(!currentShow)}}
                        onMouseDown={(e)=>e.preventDefault()}
                        >
                        {currentShow ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                    }
                    />
                </FormControl>
          </Grid>
                <Grid item style={{marginBlock: 20}}>
                 <FormControl>
                        <InputLabel htmlFor="standard-new-password">New Password</InputLabel>

                    <Input
                     id="standard-new-password"
                        type={newShow ? 'text' : 'password'}
                        value={newpass}
                        onChange={(e)=>{changeNew(e.target.value)}}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={()=>{changeNewShow(!newShow)}}
                            onMouseDown={(e)=>e.preventDefault()}
                            >
                            {newShow ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />

                    </FormControl>
                </Grid>

                <Grid item style={{marginBlock: 20}}>
                 <FormControl>
                        <InputLabel htmlFor="standard-new-password">New Password Again</InputLabel>

                    <Input
                     id="standard-new-password"
                        type={newShowre ? 'text' : 'password'}
                        value={newpassre}
                        onChange={(e)=>{changeNewre(e.target.value)}}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={()=>{changeNewShowre(!newShowre)}}
                            onMouseDown={(e)=>e.preventDefault()}
                            >
                            {newShowre ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />

                    </FormControl>
                </Grid>
            </Grid>
                <Button onClick={()=>changePasswordRequest()}  style = {{backgroundColor: '#00ffff', marginLeft: '70%',}} color='primary' >Change</Button>
            </Paper>
        </div>
    )
}


const matchStateToProps = (state)=>{
    return {
        auth: state.auth
    }
}


export default connect(matchStateToProps)(AdminChangePassword)
