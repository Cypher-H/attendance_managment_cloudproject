import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import StudentAttendance from "./StudentAttendance";
import StudentDashboard from "./StudentDashboard";
import StudentNav from "./StudentNav";
import StudentPasswordChange from "./StudentChangePassword";
import Timetable from "../Timetable"
import StudentSubjectRequest from "./StudentSubjectRequest";

function StudentHome(props) {
  return (
    <div>
      <StudentNav />
      <Switch >
        <Route exact path="/student">
          <StudentDashboard />
        </Route>
        <Route path="/student/changepassword">
          <StudentPasswordChange />
        </Route>
        <Route path="/student/attendance">
          <StudentAttendance />
        </Route>
        <Route path="/student/reqenroll">
          <StudentSubjectRequest />
        </Route>
        <Route path="/student/routine">
          <Timetable />
        </Route>
      </Switch>
    </div>
  );
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(matchStateToProps)(StudentHome);
