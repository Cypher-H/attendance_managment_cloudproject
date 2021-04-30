import {
  Login_Failed,
  Logging_In,
  Login_Success,
  Log_Out,
  Get_Profile,
  Remove_Profile,
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

export function getProfile(username, roll_no, email, phone_no, subjects, url) {
  return {
    type: Get_Profile,
    username: username,
    roll_no: roll_no,
    email: email,
    phone_no: phone_no,
    subjects: subjects,
    url: url
  };
}

export function removeProfile() {
  return {
    type: Remove_Profile,
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
          axios.get(`${baseUrl}/profile`, {
            headers: {
              'x-access-token': token
            }
          })
          .then((res)=>{
            console.log(res.data)
            dispatch(getProfile(res.data.username, res.data.roll_no, res.data.email, res.data.phone_no, res.data.subjects, res.data.url))
          })
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
        dispatch(removeProfile())
        dispatch(logOut());
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
