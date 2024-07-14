import React, { useEffect, useState } from "react"
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu, MenuItem,
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


function ProjectList() {

  const [projectList, setProjectList] = useState([]);
  const [createProjectWindowFlag,setCreateProjectWindowFlag] = useState(false)
  const [fieldValues,setFieldValues] = useState({
    name:"",
    description:""
  })

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
          setProjectList([]);
        }else{
          errorNotice(res.msg);
        }
      })

  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFieldValues({ ...fieldValues, [name]: value });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  function handleCloseMenu(event){
    setAnchorEl(null);

  }
  function handleOpenMenu(event){
    setAnchorEl(event.currentTarget);
  }


  const [openDelete, setOpenDelete] = useState(false)
  const [deleteProjectId, setDeleteProjectId] = useState("")
  function handleOpenDelete(projectId){
    setOpenDelete(true);
    setDeleteProjectId(projectId)
    handleCloseMenu()
  }

  function handleCloseDelete(){
    setOpenDelete(false);
    setDeleteProjectId("");
  }

  function handleDelete(){
    request.post("/project/deleteProject",{projectId:deleteProjectId})
      .then(res=>{
        if (res.code === 200){
          successNotice("删除成功");
          handleCloseDelete();
          setProjectList([]);
        }else{
          errorNotice(res.msg);
          handleCloseDelete();
        }
      })
  }

  return (
    <LayoutContainer className='swagger-ui'>
      <TopBar/>

      <Container component="main" maxWidth="lg" sx={{marginTop:4}}>
        <CssBaseline />

        <Button variant="outlined" onClick={handleClickOpen}>新建项目</Button>

        <Box sx={{ flexGrow: 1, marginTop: 8 }}>

          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {projectList.map((project, index) => (

              <Grid item xs={2} sm={2} md={3} key={index}>
                <Card>
                  <CardHeader
                    action={
                      <IconButton aria-label="settings" onClick={handleOpenMenu} id={project.projectId}>
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
                            onClick={() => window.open("/web/api?projectId=" + encodeURIComponent(project.projectId))}>查
                      看</Button>
                  </CardActions>

                </Card>
                <Menu
                  id={project.projectId}
                  open={menuOpen}
                  onClose={handleCloseMenu}
                  anchorEl={anchorEl}
                  MenuListProps={{ "aria-labelledby": `${project.projectId}` }}>

                  <MenuItem >添加成员</MenuItem>
                  <MenuItem onClick={()=>handleOpenDelete(project.projectId)}>删除</MenuItem>
                </Menu>

              </Grid>

            ))}

          </Grid>
        </Box>

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

      </Container>
    </LayoutContainer>
  )
}

export default ProjectList;
