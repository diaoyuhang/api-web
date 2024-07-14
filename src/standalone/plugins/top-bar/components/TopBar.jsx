import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import { Link } from "../../../../core/components/layout-utils"
import Logo from "./Logo"
import { deepOrange } from "@mui/material/colors"
import { request } from "../../../../core/utils/request"
import { errorNotice } from "../../../../core/utils/message"
import NavigationUtil from "../../../../core/utils/navigationUtil"
import { getToken } from "../../../../core/utils/token"

function TopBar(props) {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");

  useEffect(() => {
    if (getToken()) {

      request.get("/user/getUserInfo").then(r => {
        if (r.code === 200) {
          setName(r.data.name);
          setEmail(r.data.email);
        } else {
          errorNotice(r.msg)
          NavigationUtil.goTo("/web/SignIn")
        }
      })
    }
  }, [])
  return (
    <div className="topbar">
      <div className="wrapper">
        <div className="topbar-wrapper">
          <Link>
            <Logo />
          </Link>
          {getToken() &&
            <Avatar sx={{ bgcolor: deepOrange[500], float: "right" }}>{name.charAt(0)}</Avatar>}
        </div>

      </div>
    </div>
  )
}


export default TopBar
