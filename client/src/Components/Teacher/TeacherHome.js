import { Grid } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Timetable from "../Timetable";
import EnrollmentRequests from "./EnrollmentRequests";
import TeacherChangePassword from "./TeacherChangePassword";
import TeacherDashboard from "./TeacherDashboard";
import TeacherDetails from "./TeacherDetails";
import TeacherNav from "./TeacherNav";

function TeacherHome(props) {
  return (
    <Grid container
    direction="row"
    >
      <TeacherNav />
      <Grid style={{marginTop: 90}}>
      <Switch>
        <Route exact path="/Teacher">
          <TeacherDashboard />
        </Route>
        <Route path="/Teacher/changepassword">
          <TeacherChangePassword />
        </Route>
        <Route path="/Teacher/routine">
          <Timetable />
        </Route>
        <Route path="/Teacher/enrollment">
          <EnrollmentRequests />
        </Route>
        <Route path="/Teacher/details">
          <TeacherDetails />
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

export default connect(matchStateToProps)(TeacherHome);