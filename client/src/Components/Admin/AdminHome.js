import React from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import AdminChangePassword from "./AdminChangePassword";
import AdminCreateUser from "./AdminCreateUser";
import AdminDashboard from "./AdminDashboard";
import AdminNav from "./AdminNav";

function AdminHome(props) {
  return (
    <div>
      <AdminNav />
      This is Admin home page token expiry {props.auth.exp}
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
      </Switch>
    </div>
  );
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(matchStateToProps)(AdminHome);
