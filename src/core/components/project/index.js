import React, { useEffect, useState } from "react"
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemButton, ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Unstable_Grid2"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { request } from "../../utils/request"
import TextField from "@mui/material/TextField"
import validator from "validator/es"
import { errorNotice, successNotice } from "../../utils/message"
import { Container as LayoutContainer } from "../layout-utils.jsx"
import TopBar from "../../../standalone/plugins/top-bar/components/TopBar"
import { useNavigate } from "react-router-dom"
import NavigationUtil from "../../utils/navigationUtil"
import { FixedSizeList } from "react-window"
import AddIcon from '@mui/icons-material/Add'
import ProjectParam from "./ProjectParam"
import { getToken } from "../../utils/token"
import EnvParam from "../../../standalone/plugins/top-bar/components/EnvParam"


function ProjectList() {

  const [projectList, setProjectList] = useState([]);
  const [createProjectWindowFlag,setCreateProjectWindowFlag] = useState(false)
  const [fieldValues,setFieldValues] = useState({
    name:"",
    description:""
  })
  const [envParamFlag, setEnvParamFlag] = useState(false)

  const [errors, setErrors] = useState({
    name: '',
  });

  const navigate = useNavigate();
  useEffect(() => {
    NavigationUtil.setNavigate(navigate);
  }, [navigate]);

  function getProjectList(){
    request.get("/project/projectList")
      .then(res=>{
        if (res.code === 200){
          setProjectList(res.data);
        }else{
          errorNotice(res.msg);
        }
      })
  }

  useEffect(() => {
    getProjectList()
  }, []);

  function handleClose(){
    setCreateProjectWindowFlag(false);
    Object.keys(fieldValues).forEach(k => setFieldValues({ ...fieldValues, k: "" }));
    Object.keys(errors).forEach(k => setFieldValues({ ...fieldValues, k: "" }));
    getProjectList()
  }

  function handleClickOpen(){
    setCreateProjectWindowFlag(true);
  }

  function createProject(){

    if (validator.isEmpty(fieldValues.name)) {
      setErrors({...errors,"name":"项目名不能为空"});
      return;
    }

    request.post("/project/createProject",fieldValues)
      .then(res=>{
        if (res.code === 200){
          successNotice("创建成功");
          handleClose();
        }else{
          errorNotice(res.msg);
        }
      })

  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFieldValues({ ...fieldValues, [name]: value });
  };

  const [anchorEl, setAnchorEl] = React.useState({});
  const [projectId,setProjectId] = useState(null);
  function handleCloseMenu(projectId){
    setAnchorEl((prev) => ({
      ...prev,
      [projectId]: null,
    }));
  }

  function handleOpenMenu(event,projectId){
    setAnchorEl((prev) => ({
      ...prev,
      [projectId]: event.currentTarget,
    }));
  }


  const [openDelete, setOpenDelete] = useState(false)
  function handleOpenDelete(projectId){
    setOpenDelete(true);
    setDeleteProjectId(projectId)
    handleCloseMenu(projectId)
  }

  function handleCloseDelete(){
    setOpenDelete(false);
    setDeleteProjectId("");
    getProjectList()
  }

  function handleDelete(){
    request.post("/project/deleteProject",{projectId:deleteProjectId})
      .then(res=>{
        if (res.code === 200){
          successNotice("删除成功");
          handleCloseDelete();
        }else{
          errorNotice(res.msg);
          handleCloseDelete();
        }
      })
  }

  const [drawerState, setDrawerState] = useState(false);
  const [permissionType, setPermissionType] = useState([]);
  const [deleteProjectId, setDeleteProjectId] = useState("");
  const [projectAuthInfoList,setProjectAuthInfoList] = useState([]);

  useEffect(() => {
    request.get("/permission/getPermissionTypeList").then(r => {
      if (r.code === 200){
        r.data.pop();
        setPermissionType(r.data);
      }else{
        errorNotice(r.msg);
      }
    })
  }, [])

  function editPermission(projectId) {
    request.get("/permission/getProjectAuthInfo?projectId="+encodeURIComponent(projectId)).then(r => {
      if (r.code === 200) {
        setProjectAuthInfoList(r.data)
        setDrawerState(true)
        setProjectId(projectId)
      } else {
        errorNotice(r.msg)
      }
    })
    handleCloseMenu(projectId);
  }

  function closeDrawer(){
    setDrawerState(false);
    setProjectId(null);
    setProjectAuthInfoList([]);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const checkboxes = event.currentTarget.querySelectorAll('input[name="permission"]:checked');
    const permissions = Array.from(checkboxes).map(checkbox => checkbox.value);
    const email = data.get('email')
    if (!email){
      errorNotice("邮箱不能为空")
      return;
    }
    if (permissions.length<1){
      errorNotice("权限不能为空")
      return;
    }
    if (!projectId){
      errorNotice("项目id不能为空")
      return;
    }

    request.post("/permission/addPermission", {
      email: email,
      permissionTypes: permissions,
      projectId: projectId
    }, ).then(r =>{
      if (r.code === 200){
        successNotice("保存成功");
      }else{
        errorNotice(r.msg);
      }
    });
  };

  const deleteProjectAuth=(email,index)=>{
    if (!email){
      setProjectAuthInfoList(projectAuthInfoList.filter((_, i) => i !== index));
      return;
    }
    request.post("/permission/deletePermission", {
      email: email,
      projectId: projectId
    }).then(r  =>{
      if (r.code === 200){
        successNotice("删除成功");
        setProjectAuthInfoList(projectAuthInfoList.filter((_, i) => i !== index));
      }else{
        errorNotice(r.msg);
      }
    })
  }

  const addNewEmail = ()=>{
    setProjectAuthInfoList([{
      email:"",
      permissionType:[],
    },...projectAuthInfoList]);
  }

  // 项目参数配置
  const [paramDrawerState,setParamDrawerState] =useState(false);
  function editParam(projectId) {
    setParamDrawerState(true);
    setProjectId(projectId);
    handleCloseMenu(projectId);
  }


  function renderRow(props) {
    const { index, style } = props;
    const projectAuthInfo = projectAuthInfoList[index]
    const emailReadOnly = !!projectAuthInfo.email;
    return (

      <ListItem style={style} key={index} component="div">
        <Box component="form" onSubmit={handleSubmit} noValidate>
        <ListItemButton>
            <TextField name="email" InputProps={{readOnly: emailReadOnly}} label="邮箱" variant="standard" size="small" defaultValue={projectAuthInfo.email} />

            <FormGroup row={true}>
              {
                permissionType.map(p=>{
                  return (
                    <FormControlLabel key={p.type}
                                      control={<Checkbox defaultChecked = {projectAuthInfo.permissionType.indexOf(p.type) > -1}
                                                         name="permission" value={p.type} />} label={p.desc} />
                  )})
              }
            </FormGroup>

            <Button type="submit">保存</Button>
            <Button onClick={()=>deleteProjectAuth(projectAuthInfo.email,index)}>删除</Button>
        </ListItemButton>
        </Box>

      </ListItem>
    );
  }

  return (
    <LayoutContainer className='swagger-ui'>
      <TopBar/>

      <Container component="main" maxWidth="lg" sx={{marginTop:4}}>
        <CssBaseline />

        <Button variant="outlined" onClick={handleClickOpen} style={{ marginLeft: 5, marginRight: 5 }}>新建项目</Button>
        <Button variant="outlined" onClick={()=>setEnvParamFlag(!envParamFlag)} style={{ marginLeft: 5, marginRight: 5 }}>环境配置</Button>

        <Box sx={{ flexGrow: 1, marginTop: 8 }}>

          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {projectList.map((project, index) => {
              let projectId = project.projectId;
              return (
                <Grid item xs={2} sm={2} md={3} key={index}>
                  <Card>
                    <CardHeader
                      action={
                        <IconButton aria-label="settings" onClick={(event)=>handleOpenMenu(event,projectId)} id={projectId}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={project.name}
                    />
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {project.description}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button size="small"
                              onClick={() => window.open("/web/api?projectId=" + encodeURIComponent(projectId))}>查
                        看</Button>
                    </CardActions>

                  </Card>
                  <Menu
                    id={projectId}
                    open={ Boolean(anchorEl[projectId])}
                    onClose={()=>handleCloseMenu(projectId)}
                    anchorEl={anchorEl[projectId]}
                    MenuListProps={{ "aria-labelledby": `${projectId}` }}>

                    <MenuItem onClick={() => editPermission(projectId)}>添加成员</MenuItem>
                    <MenuItem onClick={() => editParam(projectId)}>配置参数</MenuItem>
                    <MenuItem onClick={() => handleOpenDelete(projectId)}>删除</MenuItem>
                  </Menu>

                </Grid>

              )
            })}

          </Grid>
        </Box>

        {paramDrawerState && <ProjectParam paramDrawerState={paramDrawerState} setParamDrawerState={setParamDrawerState} projectId={projectId}></ProjectParam>}

        <Dialog open={createProjectWindowFlag} onClose={handleClose}>
          <DialogTitle>新建项目</DialogTitle>
          <DialogContent>

            <TextField
              required
              autoFocus
              margin="dense"
              id="name"
              label="项目名"
              type="name"
              name="name"
              value={fieldValues.name}
              fullWidth
              variant="standard"
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <TextField
              margin="dense"
              id="description"
              label="项目描述"
              value={fieldValues.description}
              type="description"
              fullWidth
              variant="standard"
              name="description"
              onChange={handleChange}

            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={createProject}>创建</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">
            {"确认删除项目?"}
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleCloseDelete}>取消</Button>
            <Button onClick={handleDelete} autoFocus>提交</Button>
          </DialogActions>
        </Dialog>

        <Drawer
          anchor={'left'}
          open={drawerState}
          onClose={closeDrawer}
        >
          <Box sx={{ width: '100%', height: 400, maxWidth: 1000, bgcolor: 'background.paper' }}>
            <List>
              <ListItemButton onClick={addNewEmail}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText sx={{textAlign:"left"}} primary="添加成员" />
              </ListItemButton>
            </List>

          <FixedSizeList
            height={window.innerHeight}
            width={1000}
            itemSize={60}
            itemCount={projectAuthInfoList.length}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
          </Box>
        </Drawer>

      </Container>

      {getToken() && envParamFlag && (
        <EnvParam envParamFlag={envParamFlag} setEnvParamFlag={()=>setEnvParamFlag(!envParamFlag)} />
      )}
    </LayoutContainer>
  )
}

export default ProjectList;
