import React, { useState } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import validator from "validator/es"
import { request } from "../../utils/request"
import { errorNotice, successNotice } from "../../utils/message"

export default function SignUp() {

  const [fieldValues,setFieldValues] = useState({
    email:"",
    password:"",
    name:""
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name:""
  });

  const [submitButtonStatus,setSubmitButtonStatus] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFieldValues({ ...fieldValues, [name]: value });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    if (name === "name") {
      let msg = ""
      if (validator.isEmpty(value)){
        msg = "用户名不能为空";
      }
      setErrors({...errors,[name]:msg});
    }
    if (name === "email") {
      let msg = ""
      if (validator.isEmpty(value)){
        msg = "邮箱不能为空";
      }else if (!value.endsWith("@digiwin.com")){
        msg = "邮箱以@digiwincloud.com结尾";
      }
      setErrors({...errors,[name]:msg});
    }
    if (name === "password") {
      let msg = "";
      if (validator.isEmpty(value)){
        msg = "密码不能为空";
      }
      setErrors({...errors,[name]:msg});
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    for (let key of Object.keys(errors)) {
      if (errors[key] !==""){
        return;
      }
    }
    setSubmitButtonStatus(true);
    request.post("/user/register", fieldValues)
      .then(res => {
        if (200 === res.code) {
          successNotice("注册成功，等待邮件点击激活");
        }else{
          errorNotice(res.msg);
        }
      });
    setSubmitButtonStatus(false);
  }

  return (
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ margin: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            接口平台
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="用户名"
              name="name"
              autoComplete="name"
              autoFocus
              value={fieldValues.name}
              error = {Boolean(errors.name)}
              helperText={errors.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="邮箱地址"
              name="email"
              autoComplete="email"
              value={fieldValues.email}
              error = {Boolean(errors.email)}
              helperText={errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              autoComplete="current-password"
              value={fieldValues.password}
              error = {Boolean(errors.password)}
              helperText={errors.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={submitButtonStatus}
            >
              注 册
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  忘记密码
                </Link>
              </Grid>
              <Grid item>
                <Link href="/web/signIn" variant="body2">
                  登录
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  )
}
