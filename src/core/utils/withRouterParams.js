import React from "react"
import { useLocation, useParams } from "react-router-dom"

const withRouterParams = (Component) => {
  return (props) => {
    const routerParams = useParams()

    const urlSearchParams = new URLSearchParams(useLocation().search)

    for (let [key, value] of urlSearchParams.entries()) {
      routerParams[key] = value;
    }
    return <Component {...props} routerParams={routerParams} />
  }
}

export default withRouterParams;
