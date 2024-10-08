import axios from "axios"
import { getToken } from "./token"
import { errorNotice } from "./message"
import baseUrl from "./baseUrl"

const request = axios.create({
  baseURL:baseUrl.apiUrl,
  timeout: 60*1000
})

request.interceptors.request.use((config)=>{
  const token = getToken()
  if (token){
    config.headers.token = token ? token:"";
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
