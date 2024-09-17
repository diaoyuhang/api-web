import React from "react"
import Logo from "./Logo"
import { getToken, removeToken } from "../../../../core/utils/token"
import EnvParam from "./EnvParam"
import { deepOrange } from "@mui/material/colors"
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import { ConstructionOutlined, Logout } from "@mui/icons-material"
import { errorNotice } from "../../../../core/utils/message"
import NavigationUtil from "../../../../core/utils/navigationUtil"
import { request } from "../../../../core/utils/request"

class TopBar extends React.Component {

  constructor(props,context) {
    super(props,context);
    this.state = {
      name: "",
    };
  }

  componentDidMount() {
    if (getToken()) {
      request.get("/user/getUserInfo").then(r => {
        if (r.code === 200) {
          this.setState({ name: r.data.name });
        } else {
          errorNotice(r.msg);
          NavigationUtil.goTo("/web/SignIn");
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }


  handleLogout = () => {
    removeToken();
    window.location.href = "/web/signIn";
  };
  render() {
    const { name } = this.state;

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Logo />

            {getToken() ?
              <span style={{fontSize:13,color:'#fff'}}>{name}<a style={{color:'#097eb2',cursor:"pointer"}} onClick={this.handleLogout}>登出</a></span>
              : <span><a style={{color:'#097eb2',cursor:"pointer"}} onClick={()=> window.location.href = "/web/signIn"}>登录</a></span>}
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
