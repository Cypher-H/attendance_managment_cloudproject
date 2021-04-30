import React from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Grid,
  IconButton,
  Avatar,
} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssessmentIcon from "@material-ui/icons/Assessment";
import TodayIcon from "@material-ui/icons/Today";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { connect } from "react-redux";
import { attemptLogout } from "../../Redux/Actions/authActions";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  large: {
    width: 70,
    height: 70,
  },
});

function StudentNav(props) {
  const classes = useStyles();
  const [anchor, setState] = React.useState({
    open: false,
    direction: "left",
  });

  const toggleDrawer = (anchorDirection, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...anchor, [anchorDirection]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <Grid container direction="column" alignItems="center">
            <Avatar
              alt={props.profile.username}
              src="/static/images/avatar/1.jpg"
              className={classes.large}
            />
            <ListItemText primary={props.profile.username} />
            <ListItemText style={{ fontSize: 2 }} secondary={props.profile.email} />
            <ListItemText style={{ fontSize: 10 }} secondary={props.profile.roll_no} />
            <ListItemText style={{ fontSize: 2 }} secondary={props.profile.phone_no} />

          </Grid>
        </ListItem>
        <Divider />
        <Link style={{ textDecoration: "None" }} to="/student">
          <ListItem button>
            <ListItemIcon>
              {" "}
              <DashboardIcon />{" "}
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItem>
        </Link>
        <Link style={{ textDecoration: "None" }} to="/student/changepassword">
          <ListItem button>
            <ListItemIcon>
              {" "}
              <AccountCircleIcon />{" "}
            </ListItemIcon>
            <ListItemText primary={"Change Password"} />
          </ListItem>
        </Link>
        <Link style={{ textDecoration: "None" }} to="/student/attendance">
          <ListItem button>
            <ListItemIcon>
              {" "}
              <FingerprintIcon />{" "}
            </ListItemIcon>
            <ListItemText primary={"Attendance"} />
          </ListItem>
        </Link>
        <ListItem button>
          <ListItemIcon>
            {" "}
            <AssignmentIcon />{" "}
          </ListItemIcon>
          <ListItemText primary={"Assignments"} />
        </ListItem>
        <Link style={{ textDecoration: "None" }} to="/student/reqenroll">
        <ListItem button>
          <ListItemIcon>
            {" "}
            <AssessmentIcon />{" "}
          </ListItemIcon>
          <ListItemText primary={"Request Enroll"} />
        </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
      <Link style={{ textDecoration: "None" }} to="/student/routine">
        <ListItem button>
          <ListItemIcon>
            {" "}
            <TodayIcon />{" "}
          </ListItemIcon>
          <ListItemText primary={"Time Table"} />
        </ListItem>
        </Link>
        <ListItem button>
          <ListItemIcon>
            {" "}
            <DirectionsRunIcon />{" "}
          </ListItemIcon>
          <ListItemText primary={"Leave Application"} />
        </ListItem>
        <ListItem button onClick={() => props.logout(props.auth.token)}>
          <ListItemIcon>
            {" "}
            <ExitToAppIcon />{" "}
          </ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItem>
      </List>
    </div>
  );
  return (
    <div>
      <React.Fragment key={anchor.direction}>
        <Grid   style={{
    width: `calc(100% - 240px)`,
    marginLeft: 240,
  }}>
        <AppBar position="sticky">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
                <Typography display="inline" variant="h6">
                  Attendance Management System
                </Typography>
            </Grid>
          </Toolbar>
        </AppBar>
        </Grid>
        <Drawer
                anchor={anchor.direction}
                variant='permanent'
                open={anchor[anchor.direction]}
                onClose={toggleDrawer(anchor.direction, false)}
              >
                {list(anchor.direction)}
              </Drawer>
      </React.Fragment>
    </div>
  );
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
    profile: state.profile
  };
};

const matchDispatchToProps = (dispatch) => {
  return {
    logout: (token) => dispatch(attemptLogout(token)),
  };
};

export default connect(matchStateToProps, matchDispatchToProps)(StudentNav);
