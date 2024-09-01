import Box from "@mui/material/Box"
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup, InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText, MenuItem, Select,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { FixedSizeList } from "react-window"
import React, { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { request } from "../../utils/request"
import { errorNotice, successNotice } from "../../utils/message"


function ProjectParam(props){

  const [paramList, setParamList] = useState([]);

  const paramDrawerState = props.paramDrawerState
  const setParamDrawerState = props.setParamDrawerState
  const projectId= props.projectId;

  const handleClose = function (){

  }

  useEffect(() => {

    getProjectParam(encodeURIComponent(projectId));
  }, []);

  function getProjectParam(projectId){
    request.get("/projectRequestParam/getParam?projectId="+projectId).then(r=>{
      if (r.code === 200) {
        setParamList(r.data)
        console.log(r.data)
      } else {
        errorNotice(r.msg)
      }
    })
  }

  const deleteProjectParam=(param,index)=>{
    if (!param.id){
      setParamList(paramList.filter((_, i) => i !== index));
      return;
    }
    request.post("/projectRequestParam/deleteParam", {
      id: param.id,
      projectId: param.projectId
    }).then(r  =>{
      if (r.code === 200){
        successNotice("删除成功");
        setParamList(paramList.filter((_, i) => i !== index));
      }else{
        errorNotice(r.msg);
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')
    const id = data.get('id')
    const pId = data.get('projectId')
    const type = data.get('type')
    const required = data.get('required')
    if (!name){
      errorNotice("参数名不能为空")
      return;
    }

    const reqParam = {
      id: id,
      projectId: pId,
      name: name,
      required: required,
      type: type,
    }

    console.log("reqParam",reqParam);

    const uri = reqParam.id ? "/projectRequestParam/updateParam" : "/projectRequestParam/addParam"
    request.post(uri, reqParam).then(r =>{
      if (r.code === 200){
        successNotice("保存成功");
        getProjectParam(encodeURIComponent(pId));
      }else{
        errorNotice(r.msg);
      }
    });
  };

  function renderRow(props) {
    const { index, style } = props;
    const param = paramList[index]
    return (

      <ListItem style={style} key={index} component="div">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <ListItemButton>
            <input name="id" value={param.id} type="hidden"/>
            <input name="projectId" value={param.projectId} type="hidden"/>
            <TextField name="name" label="参数名" variant="standard" size="small" defaultValue={param.name} />

            <TextField
              id="type"
              select
              label="类型"
              defaultValue={param.type}
              size="small"
              name="type"
            >
              <MenuItem value={0}>Header</MenuItem>
              <MenuItem value={1}>Cookie</MenuItem>
            </TextField>

            <TextField
              id="required"
              select
              label="必填"
              defaultValue={param.required}
              size="small"
              name="required"
            >
              <MenuItem value={true}>true</MenuItem>
              <MenuItem value={false}>false</MenuItem>
            </TextField>

            <Button type="submit">保存</Button>
            <Button onClick={()=>deleteProjectParam(param,index)}>删除</Button>
          </ListItemButton>
        </Box>

      </ListItem>
    );
  }

  const addNew = () => {
    setParamList([{
      projectId: projectId,
      type: 0,
      name: "",
      required: false,
    }, ...paramList])
  }

  return (
    <Drawer
      anchor={'left'}
      open={paramDrawerState}
      onClose={()=>setParamDrawerState(false)}
    >
      <Box sx={{ width: '100%', height: 400, maxWidth: 1000, bgcolor: 'background.paper' }}>
        <List>
          <ListItemButton onClick={addNew}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText sx={{textAlign:"left"}} primary="添加参数" />
          </ListItemButton>
        </List>

        <FixedSizeList
          height={window.innerHeight}
          width={700}
          itemSize={60}
          itemCount={paramList.length}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      </Box>
    </Drawer>
  );
}

export default ProjectParam;
