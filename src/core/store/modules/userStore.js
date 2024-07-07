import { createSlice } from "@reduxjs/toolkit"

const userStore = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("api_token") || "",
    email: '',
    name: '',
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      localStorage.setItem("api_token", action.payload)
    },
  },
})

const userReducer = userStore.reducer
const { setToken } = userStore.actions


export { setToken }
export default userReducer
