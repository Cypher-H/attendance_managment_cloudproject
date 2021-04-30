import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";

import { useEffect } from "react";
import { connect } from "react-redux";

import { logOut } from "../Redux/Actions/authActions";

import Home from "./Home";
import About from "./About";
import StudentHome from "./Student/StudentHome";
import AdminHome from "./Admin/AdminHome";
import TeacherHome from "./Teacher/TeacherHome";

function BaseComponent(props) {
  useEffect(() => {
    if (props.auth.exp < Math.floor(Date.now() / 1000) && props.auth.auth) {
      props.logOut();
    }
  });

  return (
    <Router>
      <Switch>
        <Route strict path="/about">
          <About />
        </Route>
        <Route exact path="/">
          {() => {
            if (props.auth.auth) {
              if (props.auth.role === "admin") {
                return <Redirect to="/Admin" />;
              } else if (props.auth.role === "teacher") {
                return <Redirect to="/teacher" />;
              } else if (props.auth.role === "student") {
                return <Redirect to="/student" />;
              }
            } else {
              return <Home />;
            }
          }}
        </Route>
        <Route strict path="/student">
          {props.auth.auth ? <StudentHome /> : <Redirect to="/" />}
        </Route>
        <Route strict path="/teacher">
          {props.auth.auth ? <TeacherHome /> : <Redirect to="/" />}
        </Route>
        <Route strict path="/Admin">
          {props.auth.auth ? <AdminHome /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const matchDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
  };
};

export default connect(matchStateToProps, matchDispatchToProps)(BaseComponent);
