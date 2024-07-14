/**
 * @prettier
 */
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import withRouterParams from "../utils/withRouterParams"
import NavigationUtil from "../utils/navigationUtil"

function App(props) {
  const { getComponent, layoutSelectors, specActions, specSelectors,routerParams } = props
  const params = useParams()
  const baseURL = 'http://localhost:3201';

  const navigate = useNavigate();
  useEffect(() => {
    NavigationUtil.setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    let url = '';
    if (routerParams.projectId){
      url = baseURL + "/api/getBasicApiInfoList?projectId=" + encodeURIComponent(routerParams.projectId);
    }else if(routerParams.apiId){
      url = baseURL+"/api/apiMetaDateInfo?apiId="+encodeURIComponent(routerParams.apiId);
    }else if(routerParams.historyId){
      url = baseURL+"/api/historyApiMetaDateInfo?historyId="+encodeURIComponent(routerParams.historyId);
    }
    specActions.download(url);
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
