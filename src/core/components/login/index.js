import React from "react"
import { Box, Button, TextField } from "@mui/material"

const contentStyle = {
  height: `${window.innerHeight}px`,
  lineHeight: `${window.innerHeight}px`,
  color: "#150c0c",
  backgroundColor: "#fff",
  padding: 100,
}

const cardStyle = {
  width: 400,
  borderRadius:0
}

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}


const Login = () => {
  return (
    <Box component="form"
         sx={{
           '& > :not(style)': { m: 1, width: '25ch' },
         }}
         noValidate
         autoComplete="off">
      <TextField id="outlined-basic" label="dfdfdfd" variant="outlined"/>
      <Button variant="contained">你好，世界</Button>
    </Box>
  )
}

export default Login
