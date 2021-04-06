import React, { useState } from "react";
import {
  Typography,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Button,
} from "@material-ui/core";

import PersonIcon from "@material-ui/icons/Person";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import EmailIcon from "@material-ui/icons/Email";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";

import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "../../config";
import ServerDialog from "../ServerDialog";

function AddTeacher(props) {
  const formik = useFormik({
    initialValues: {
      Name: "",
      Number: "",
      Email: "",
    },
    validationSchema: Yup.object({
      Name: Yup.string().required("Name is required"),
      Number: Yup.string()
        .matches(/^[6-9]\d{9}$/, {
          message: "Please enter valid number.",
          excludeEmptyString: false,
        })
        .required("Number is required"),
      Email: Yup.string()
        .email("Please provide a proper email")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      handleClickOpen();

      axios
        .post(
          `${baseUrl}/createTeacher`,
          {
            name: values.Name,
            number: values.Number,
            email: values.Email,
          },
          {
            headers: {
              "x-access-token": props.auth.token,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          setMsg(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMsg("");
    formik.resetForm({
      Name: "",
      Number: "",
      Email: "",
    });
  };

  return (
    <div>
      <ServerDialog
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        msg={msg}
      />
      <Grid lg={6} container>
        <Paper style={{ padding: 10 }} elevation={5}>
          <Typography variant="h3" style={{ fontWeight: 800 }}>
            Teacher Details
          </Typography>
          <Grid container alignContent="center">
            <Grid lg={6} md={6} sm={12} xs={12} item>
              <FormControl style={{ margin: 5 }}>
                <InputLabel htmlFor="standard-new-name">Name</InputLabel>

                <Input
                  id="standard-new-name"
                  type={"text"}
                  value={formik.values.Name}
                  onChange={formik.handleChange("Name")}
                  endAdornment={<PersonIcon />}
                />
              </FormControl>
            </Grid>

            <Grid lg={6} md={6} sm={12} xs={12} item>
              <FormControl style={{ margin: 5 }}>
                <InputLabel htmlFor="standard-new-num">Number</InputLabel>

                <Input
                  id="standard-new-num"
                  type={"text"}
                  value={formik.values.Number}
                  onChange={formik.handleChange("Number")}
                  endAdornment={<ContactPhoneIcon />}
                />
              </FormControl>
            </Grid>

            <Grid lg={6} md={6} sm={12} xs={12} item>
              <FormControl style={{ margin: 5 }}>
                <InputLabel htmlFor="standard-new-email">Email</InputLabel>

                <Input
                  id="standard-new-email"
                  type={"text"}
                  value={formik.values.Email}
                  onChange={formik.handleChange("Email")}
                  endAdornment={<EmailIcon />}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Typography
            color="error"
            style={{ textAlign: "center", marginTop: 20 }}
          >
            {formik.errors.Name || formik.errors.Number || formik.errors.Email}
          </Typography>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Button
              onClick={formik.submitForm}
              style={{ backgroundColor: "blueviolet" }}
              color="default"
            >
              Create Teacher
            </Button>
          </div>
        </Paper>
      </Grid>
    </div>
  );
}

const matchStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(matchStateToProps)(AddTeacher);
