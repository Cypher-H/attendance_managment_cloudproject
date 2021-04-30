import { Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Timetable from "../Timetable";
import AdminAttendance from "./AdminAttendance";
import AdminChangePassword from "./AdminChangePassword";
import AdminCreateUser from "./AdminCreateUser";
import AdminDashboard from "./AdminDashboard";
import AdminNav from "./AdminNav";
import ManageSubject from "./ManageSubject";

function AdminHome(props) {
  return (
    <Grid container
    direction="row"
    >
      <AdminNav />
      <Grid style={{marginTop: 90}}>
      <Switch>
        <Route exact path="/Admin">
          <AdminDashboard />
        </Route>
        <Route path="/Admin/createuser">
          <AdminCreateUser />
        </Route>
        <Route path="/Admin/changepassword">
          <AdminChangePassword />
        </Route>
        <Route path="/Admin/managesubject">
          <ManageSubject />
        </Route>
        <Route path="/Admin/routine">
          <Timetable />
        </Route>
        <Route path="/Admin/attendance">
          <AdminAttendance />
        </Route>
      </Switch>
      </Grid>
    </Grid>
  );
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(matchStateToProps)(AdminHome);
