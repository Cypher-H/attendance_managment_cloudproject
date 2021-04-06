import {
  Login_Failed,
  Logging_In,
  Login_Success,
  Log_Out,
} from "./actionsName";
import axios from "axios";
import { baseUrl } from "../../config";

export function loggingIn() {
  return {
    type: Logging_In,
  };
}

export function loginFailed(status) {
  return {
    type: Login_Failed,
    status: status,
  };
}

export function loginSuccess(token, status, uid, role, exp) {
  return {
    type: Login_Success,
    token: token,
    status: status,
    uid: uid,
    role: role,
    exp: exp,
  };
}

export function logOut() {
  return {
    type: Log_Out,
  };
}

export const attemptLogin = (username, password) => {
  return (dispatch) => {
    dispatch(loggingIn());
    axios
      .post(`${baseUrl}/login`, {
        username: username,
        password: password,
      })
      .then((value) => {
        if (value.data.auth) {
          const { token, status, uid, role, exp } = value.data;
          dispatch(loginSuccess(token, status, uid, role, exp));
        } else {
          dispatch(loginFailed(value.data.status));
        }
      })
      .catch((er) => console.log(er));
  };
};

export const attemptLogout = (token) => {
  return (dispatch) => {
    axios
      .get(`${baseUrl}/logout`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        dispatch(logOut());
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
