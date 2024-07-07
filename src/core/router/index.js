import { createBrowserRouter, createHashRouter } from "react-router-dom"
import Other from "../components/other"
import React from "react"
import { SignIn,SignUp } from "../components/login"
import AuthRoute from "../utils/AuthRoute"
import ProjectList from "../components/project"

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
  }, {
    path: "projectList",
    element: <ProjectList />,
  })

  return createBrowserRouter([{
    path: "/web",
    children: routes,
  },
  ])

}


export default createRouter
