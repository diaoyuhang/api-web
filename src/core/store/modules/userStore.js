import { createSlice } from "@reduxjs/toolkit"

const userStore = createSlice({
  name:"user",
  initialState:{
    token:''
  },
  reducers:{
    setToken(state,action){
      state.token=action.payload;
    }
  }
});

const userReducer = userStore.reducer
const {setToken} = userStore.actions


export {setToken}
export  default userReducer;
