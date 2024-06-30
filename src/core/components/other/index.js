import React from "react"
import { useNavigate } from "react-router-dom"

const Other=()=>{
  const navigate = useNavigate()
  return <div>
    <button onClick={() => navigate('/api?projectId=1234')}>跳转项目</button>
  </div>
}
export default Other;
