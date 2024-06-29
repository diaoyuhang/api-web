import React from "react"
import { useParams } from "react-router-dom"

const withRouterParams = (Component) => {
  return (props) => {
    const routerParams = useParams()
    return <Component {...props} routerParams={routerParams} />
  }
}

export default withRouterParams;
