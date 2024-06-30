import { createBrowserRouter, createHashRouter } from "react-router-dom"
import Other from "../components/other"
import React from "react"


const createRouter = (...routes) => {
  routes.push({
    path: "other",
    element: <Other />,
  })
  return createBrowserRouter([{
    path: "/web",
    children: routes,
  },
  ])

}


export default createRouter
