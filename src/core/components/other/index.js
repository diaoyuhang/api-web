import React from "react"
import { useNavigate } from "react-router-dom"

const Other=()=>{
  const navigate = useNavigate()
  return <div>
    <button onClick={() => navigate('/app/sasdas/false/')}>跳转项目</button>
  </div>
}
export default Other;
