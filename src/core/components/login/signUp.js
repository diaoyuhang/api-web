import React from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { useState } from "react"
import validator from "validator/es"
import { useDispatch, useSelector } from "react-redux"
import { request } from "../../utils/request"
import { Alert, Snackbar } from "@mui/material"
import { setToken } from "../../store/modules/userStore"

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

  const [alertSeverity,setAlertSeverity] = useState('info');
  const [submitButtonStatus,setSubmitButtonStatus] = useState(false);

  const [open,setOpen] = useState(false);
  const [snackbarState,setSnackbarState] = useState({
    vertical:'top',
    horizontal:'center'
  });
  const [loginErrorMsg,setLoginErrorMsg] = useState('');

  const { vertical, horizontal } = snackbarState;

  const dispatch = useDispatch()
  const msgHandleClose = ()=>{
    setOpen(false);
    setLoginErrorMsg('');
    setAlertSeverity('info');
  }

  const msgHandleOpen = (msg,severity)=>{
    setOpen(true);
    setLoginErrorMsg(msg);
    setAlertSeverity(severity);
  }

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
      }else if (!value.endsWith("@digiwincloud.com")){
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
          msgHandleOpen("注册成功，等待邮件点击激活","info")
        }else{
          msgHandleOpen(res.msg,"error")
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

            <Snackbar open={open} autoHideDuration={3500} onClose={msgHandleClose}
                      anchorOrigin={{ vertical , horizontal }}>
              <Alert variant="outlined" onClose={msgHandleClose} severity={alertSeverity} sx={{ width: '100%' }}>
                {loginErrorMsg}
              </Alert>
            </Snackbar>

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
