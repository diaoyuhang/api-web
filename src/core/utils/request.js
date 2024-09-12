import axios from "axios"
import { getToken } from "./token"
import { errorNotice } from "./message"

const request = axios.create({
  baseURL:"http://139.196.217.161:8080",
  timeout: 60*1000
})

request.interceptors.request.use((config)=>{
  const token = getToken()
  if (token){
    config.headers.token = token;
  }
  return config;
},(error)=>{
  return Promise.reject(error);
})

request.interceptors.response.use((response)=>{
  return response.data;
},(error)=>{
  if(403 === error.response.status){
    location.replace("/web/signIn");
    return;
  }
  return Promise.reject(error);
})

export {request}
