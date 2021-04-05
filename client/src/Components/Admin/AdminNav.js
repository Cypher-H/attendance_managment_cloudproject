import React from 'react'
import { AppBar, Typography, Toolbar, Grid, IconButton, Avatar } from '@material-ui/core'
import ListIcon from '@material-ui/icons/List'

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';


import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DashboardIcon from '@material-ui/icons/Dashboard';
import CreateIcon from '@material-ui/icons/Create';
import MailIcon from '@material-ui/icons/Mail';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import TodayIcon from '@material-ui/icons/Today';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import { connect } from 'react-redux'
import { attemptLogout } from '../../Redux/Actions/authActions'
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  large: {
    width: 70,
    height: 70,
    marginBottom: 20
  },
});

function AdminNav(props) {


  const classes = useStyles();
  const [anchor, setState] = React.useState({
      open: false,
      direction: 'left'  
  });

  const toggleDrawer = (anchorDirection, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...anchor, [anchorDirection]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
            <ListItem >
                <Grid container
                direction='column'
                alignItems='center'
                >
                  <Avatar alt="Admin Name" src="/static/images/avatar/1.jpg" className={classes.large} />
                <ListItemText style= {{ marginBottom: 10}}  primary={'Admin_Name'} />
                </Grid>
            </ListItem>
            <Divider />
          <Link style={{textDecoration: 'None'}} to='/Admin'>
            <ListItem button>
                <ListItemIcon> <DashboardIcon /> </ListItemIcon>
                <ListItemText  primary={'Dashboard'} />
            </ListItem>
          </Link>
          <Link style={{textDecoration: 'None'}} to='/Admin/changepassword'>
            <ListItem button>
                <ListItemIcon> <LockOpenIcon /> </ListItemIcon>
                <ListItemText primary={'Change Password'} />
            </ListItem>
          </Link>
          <Link style={{textDecoration: 'None'}} to = '/Admin/attendance'>
            <ListItem button>
              <ListItemIcon> <CreateIcon /> </ListItemIcon>
              <ListItemText primary={'Create User'} />
            </ListItem>
          </Link>
          <ListItem button>
            <ListItemIcon> <AssignmentIcon /> </ListItemIcon>
            <ListItemText primary={'View User Profile'} />
          </ListItem>
          <ListItem button>
            <ListItemIcon> <MailIcon /> </ListItemIcon>
            <ListItemText primary={'Applications'} />
          </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
            <ListItemIcon> <TodayIcon /> </ListItemIcon>
            <ListItemText primary={'Time Table'} />
          </ListItem>
          <ListItem button>
            <ListItemIcon> <LabelImportantIcon /> </ListItemIcon>
            <ListItemText primary={'Group Mail'} />
          </ListItem>
          <ListItem button onClick={()=>props.logout(props.auth.token)}>
            <ListItemIcon > <ExitToAppIcon /> </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
      </List>
    </div>
  );
    return (
        <div>
        
          <React.Fragment key={anchor.direction}>
            <AppBar position="sticky">
            <Toolbar>
            <Grid container
            direction="row"
            justify='space-between'
            alignItems="center">
            <Grid>
                <IconButton edge="start"  color="inherit" onClick={toggleDrawer(anchor.direction, true)} aria-label="menu">
                <ListIcon />
                </IconButton>
                <Typography display='inline' variant="h6">
                Attendance Management System
                </Typography>
            </Grid>
            <Drawer anchor={anchor.direction} open={anchor[anchor.direction]} onClose={toggleDrawer(anchor.direction, false)}>
                {list(anchor.direction)}
            </Drawer>
            </Grid>
            </Toolbar>
        </AppBar>
          </React.Fragment>
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
        logout: (token)=> dispatch(attemptLogout(token)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(AdminNav)


