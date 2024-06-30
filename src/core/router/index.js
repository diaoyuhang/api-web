import { createBrowserRouter, createHashRouter } from "react-router-dom"
import Other from "../components/other"
import React from "react"
import Login from "../components/login"


const createRouter = (...routes) => {
  routes.push({
    path: "other",
    element: <Other />,
  },{
    path: "login",
    element: <Login />,
  });

  return createBrowserRouter([{
    path: "/web",
    children: routes,
  },
  ])

}


export default createRouter
