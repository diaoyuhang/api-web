import { createBrowserRouter, createHashRouter } from "react-router-dom"
import React from "react"
import { SignIn,SignUp } from "../components/login"
import AuthRoute from "../utils/AuthRoute"
import ProjectList from "../components/project"

const createRouter = (...routes) => {
  routes.push({
    path: "signIn",
    element: <SignIn />,
  }, {
    path: "signUp",
    element: <SignUp />,
  }, {
    path: "projectList",
    element:  <AuthRoute><ProjectList /></AuthRoute>,
  })

  return createBrowserRouter([{
    path: "/web",
    children: routes,
  },{
    path: "*",
    element: <SignIn />,
  },
  ])

}


export default createRouter
