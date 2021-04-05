import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import { attemptLogin } from '../Redux/Actions/authActions'
import LoginNav from './LoginNav';

import './Css/login.css'
import attendance from '../Assets/attendance.jpg'

import { Grid, Paper, Typography } from '@material-ui/core'

import { useFormik } from "formik";
import * as Yup from "yup";


function Home(props) {

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema : Yup.object({
            username: Yup.string().required('Username Required!'),
            password: Yup.string().min(4, "Minimum 4 characters").required("Password Required!"),
        }),
        onSubmit : (values)=> {
            props.attemptLogin(values.username, values.password)
            changeSubmit(true)
        
        }
    })

    const [submit, changeSubmit] = useState(false)

    return (
        <div className='background-body'>
        <LoginNav />
        <Grid 
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{paddingTop:50}}
        >
            
            <Paper 
            className = 'paper-style'
            elevation={5}>
                <Grid
                container
                direction='row-reverse'
                justify='space-evenly'
                alignItems="flex-start"
                >
                    <Grid 
                    item 
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}>
                        <img src = {attendance} style={{padding:20}} height={300}/>
                    </Grid>


                    <Grid 
                    item 
                    className = 'text-field-style'
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}>
                        <TextField
                        id="Username"
                        label="Username"
                        variant="standard"
                        color="primary"
                        value = {formik.values.username}
                        style = {{ marginTop: 20}}
                        onChange = {formik.handleChange('username')}
                        />
                        <TextField
                        id="Password"
                        label="Password"
                        variant="standard"
                        color="primary"
                        value = {formik.values.password}
                        style = {{ marginTop: 10}}
                        onChange = {formik.handleChange('password')}
                        type='password'
                        />
                        <Typography color='error' style={{marginTop: 5 ,}}>
                        {formik.errors.username || formik.errors.password }
                        {submit?(props.auth.status):null}
                        </Typography>
                        <Button 
                        color = 'primary'
                        style = {{margin: 50}}
                        onClick = {formik.handleSubmit} 
                        variant = 'outlined'
                        >
                            Login
                        </Button>                        
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        </div>
    )
}

const matchStateToProps = (state)=>{
    return {
        auth: state.auth
    }
}

const matchDispatchToProps = (dispatch)=>{
    return {
        attemptLogin: (username, password)=> dispatch(attemptLogin(username, password)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(Home)
