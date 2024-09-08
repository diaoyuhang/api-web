import React, { useEffect, useState } from "react"
import Avatar from "@mui/material/Avatar"
import { Link } from "../../../../core/components/layout-utils"
import Logo from "./Logo"
import { deepOrange } from "@mui/material/colors"
import { request } from "../../../../core/utils/request"
import { errorNotice } from "../../../../core/utils/message"
import NavigationUtil from "../../../../core/utils/navigationUtil"
import { getToken, removeToken } from "../../../../core/utils/token"
import { Divider, IconButton, ListItemIcon, Menu, MenuItem, SvgIcon } from "@mui/material"
import { ConstructionOutlined, Logout, PersonAdd, Settings } from "@mui/icons-material"
import EnvParam from "./EnvParam"

function TopBar(props) {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

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
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    removeToken();
    handleClose();
    NavigationUtil.goTo("/web/signIn");
  };

  const [envParamFlag, setEnvParamFlag] = useState(false)

  return (
    <div className="topbar">
      <div className="wrapper">
        <div className="topbar-wrapper">
          <Link>
            <Logo />
          </Link>
          {getToken() &&
            <IconButton onClick={handleClick}>
              <Avatar sx={{ bgcolor: deepOrange[500], float: "right" }}>{name.charAt(0)}</Avatar>
            </IconButton>
          }

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >

            <MenuItem onClick={()=>setEnvParamFlag(!envParamFlag)}>
              <ListItemIcon>
                <ConstructionOutlined fontSize="small"/>
              </ListItemIcon>
              环境配置
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                  <Logout fontSize="small"/>
              </ListItemIcon>
              登出
            </MenuItem>
          </Menu>

        </div>
      </div>

      {(getToken() && envParamFlag) &&
        <EnvParam envParamFlag={envParamFlag} setEnvParamFlag={setEnvParamFlag}></EnvParam>}
    </div>
  )
}


export default TopBar
