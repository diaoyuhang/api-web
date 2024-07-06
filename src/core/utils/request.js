import axios from "axios"

const request = axios.create({
  baseURL:"http://localhost:3201",
  timeout: 60*1000
})

request.interceptors.request.use((config)=>{
  return config;
},(error)=>{
  return Promise.reject(error);
})

request.interceptors.response.use((response)=>{
  return response.data;
},(error)=>{
  return Promise.reject(error);
})

export {request}
