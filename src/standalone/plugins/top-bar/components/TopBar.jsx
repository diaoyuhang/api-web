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

  static propTypes = {
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired
  }

  constructor(props,context) {
    super(props,context);
    this.state = {
      name: "",
      anchorEl: null,
      envParamFlag: false,
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

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    removeToken();
    this.handleClose();
    NavigationUtil.goTo("/web/signIn");
  };

  toggleEnvParamFlag = () => {
    this.setState((prevState) => ({
      envParamFlag: !prevState.envParamFlag
    }));
  };

  render() {
    const { name, anchorEl, envParamFlag } = this.state;
    const isMenuOpen = Boolean(anchorEl);

    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Logo />

            {getToken() && (
              <IconButton onClick={this.handleClick}>
                <Avatar sx={{ bgcolor: deepOrange[500], float: "right" }}>
                  {name.charAt(0)}
                </Avatar>
              </IconButton>
            )}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={isMenuOpen}
              onClose={this.handleClose}
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
              <MenuItem onClick={this.toggleEnvParamFlag}>
                <ListItemIcon>
                  <ConstructionOutlined fontSize="small" />
                </ListItemIcon>
                环境配置
              </MenuItem>
              <MenuItem onClick={this.handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                登出
              </MenuItem>
            </Menu>
          </div>
        </div>

        {getToken() && envParamFlag && (
          <EnvParam envParamFlag={envParamFlag} setEnvParamFlag={this.toggleEnvParamFlag} />
        )}
      </div>
    );
  }
}

export default TopBar;
