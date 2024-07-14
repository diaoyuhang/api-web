import { createSlice } from "@reduxjs/toolkit"
import { setToken as _setToken,getToken,removeToken } from "../../utils/token"
const userStore = createSlice({
  name: "user",
  initialState: {
    token: getToken() || "",
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      _setToken(action.payload);
    }
  },
})

const userReducer = userStore.reducer
const { setToken } = userStore.actions


export { setToken }
export default userReducer
