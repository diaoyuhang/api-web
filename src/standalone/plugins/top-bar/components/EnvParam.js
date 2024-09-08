import React, { useEffect, useState } from "react"
import { request } from "../../../../core/utils/request"
import { errorNotice, successNotice } from "../../../../core/utils/message"
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem } from "@mui/material"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import { FixedSizeList } from "react-window"

function EnvParam(props){
  const envParamFlag = props.envParamFlag;
  const setEnvParamFlag = props.setEnvParamFlag;

  const [envParamList, setEnvParamList] = useState([]);

  useEffect(() => {

    getEnvConfig();
  }, []);

  function getEnvConfig(){
    request.get("/userEnvConfig/get").then(r=>{
      if (r.code === 200) {
        setEnvParamList(r.data)
        console.log(r.data)
      } else {
        errorNotice(r.msg)
      }
    })
  }

  const deleteParam=(param,index)=>{
    if (!param.id){
      setEnvParamList(envParamList.filter((_, i) => i !== index));
      return;
    }
    request.post("/userEnvConfig/delete", {
      id: param.id,
    }).then(r  =>{
      if (r.code === 200){
        successNotice("删除成功");
        setEnvParamList(envParamList.filter((_, i) => i !== index));
      }else{
        errorNotice(r.msg);
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = data.get('id')
    const url = data.get('url')
    const description = data.get('description')
    if (!url){
      errorNotice("域名不能为空")
      return;
    }

    const reqParam = {
      id: id,
      url: url,
      description: description,
    }

    const uri = reqParam.id ? "/userEnvConfig/update" : "/userEnvConfig/add"
    request.post(uri, reqParam).then(r =>{
      if (r.code === 200){
        successNotice("保存成功");
        getEnvConfig();
      }else{
        errorNotice(r.msg);
      }
    });
  };

  function renderRow(props) {
    const { index, style } = props;
    const param = envParamList[index]
    return (

      <ListItem style={style} key={index} component="div">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <ListItemButton>
            <input name="id" value={param.id} type="hidden"/>
            <TextField name="url" label="域名" variant="standard" size="small" defaultValue={param.url} />
            <TextField name="description" label="描述" variant="standard" size="small" defaultValue={param.description} />

            <Button type="submit">保存</Button>
            <Button onClick={()=>deleteParam(param,index)}>删除</Button>
          </ListItemButton>
        </Box>

      </ListItem>
    );
  }

  const addNew = () => {
    setEnvParamList([{
      id: "",
      url: "",
      description: "",
    }, ...envParamList])
  }

  return (
    <Drawer
      anchor={'left'}
      open={envParamFlag}
      onClose={()=>setEnvParamFlag(false)}
    >
      <Box sx={{ width: '100%', height: 400, maxWidth: 1000, bgcolor: 'background.paper' }}>
        <List>
          <ListItemButton onClick={addNew}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText sx={{textAlign:"left"}} primary="添加配置" />
          </ListItemButton>
        </List>

        <FixedSizeList
          height={window.innerHeight}
          width={700}
          itemSize={60}
          itemCount={envParamList.length}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      </Box>
    </Drawer>
  );
}

export default EnvParam;
