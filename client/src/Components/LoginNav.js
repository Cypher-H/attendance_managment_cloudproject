import React from 'react'

import { Button, Grid } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import { Link } from 'react-router-dom'

function LoginNav() {
    return (
        <AppBar position="sticky">
      <Toolbar>
        <Grid container
        direction="row"
        justify='space-between'
        alignItems="center">
        <Grid>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <PlaylistAddCheckIcon />
          </IconButton>
          <Typography display='inline' variant="h6">
            Attendance Management System
          </Typography>
        </Grid>
        <Grid>
          <Link style={{textDecoration:'none',marginRight: 5}}  to="/about">
            <Button style={{border: 'solid', borderWidth: 2, borderColor: 'white', }}  color='secondary'>
                <Typography style={{color: 'white'}} variant="h6">
                  About
                </Typography>
              </Button>
          </Link> 
          <Link style={{textDecoration:'none'}} to="/">
            <Button style={{border: 'solid', borderWidth: 2, borderColor: 'white', }} color='secondary'>
              <Typography style={{color: 'white'}} variant="h6">
                Login
              </Typography>
            </Button>
          </Link>
        </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
    )
}

export default LoginNav
