import { createBrowserRouter, createHashRouter } from "react-router-dom"
import Other from "../components/other"
import React from "react"
import { SignIn,SignUp } from "../components/login"
import AuthRoute from "../utils/AuthRoute"

const createRouter = (...routes) => {
  routes.push({
    path: "other",
    element: <AuthRoute><Other /></AuthRoute>,
  }, {
    path: "signIn",
    element: <SignIn />,
  }, {
    path: "signUp",
    element: <SignUp />,
  })

  return createBrowserRouter([{
    path: "/web",
    children: routes,
  },
  ])

}


export default createRouter
