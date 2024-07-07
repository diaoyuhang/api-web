/**
 * @prettier
 */
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import withRouterParams from "../utils/withRouterParams"

function App(props) {
  const { getComponent, layoutSelectors, specActions, specSelectors,routerParams } = props
  const params = useParams()

  useEffect(() => {
    if (routerParams.projectId){
      specActions.download("http://localhost:3201/api/getBasicApiInfoList?projectId="+encodeURIComponent(routerParams.projectId));
    }else if(routerParams.apiId){
      specActions.download("http://localhost:3201/api/apiMetaDateInfo?apiId="+encodeURIComponent(routerParams.apiId));
    }
  }, [])

  const getLayout = () => {
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)

    return Component
      ? Component
      : () => <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  const Layout = getLayout()
  return <Layout />
}

export default withRouterParams(App);
