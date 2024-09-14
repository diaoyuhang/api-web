/**
 * @prettier
 */
import React from "react"
import withRouterParams from "../utils/withRouterParams"
import NavigationUtil from "../utils/navigationUtil"
import PropTypes from "prop-types"

class App extends React.Component {

  constructor(props) {
    super(props)
    this.baseURL = "http://localhost:8080"
    // this.baseURL = "http://localhost:3200"
    // this.baseURL = 'http://139.196.217.161:8080';
  }

  getLayout() {
    const { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)

    return Component
      ? Component
      : () => <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  componentDidMount() {
    const { routerParams, specActions,navigate } = this.props

    // 设置导航
    NavigationUtil.setNavigate(navigate)

    let url = ""
    if (routerParams.projectId) {
      url = this.baseURL + "/api/getBasicApiInfoList?projectId=" + encodeURIComponent(routerParams.projectId)
    } else if (routerParams.apiId) {
      url = this.baseURL + "/api/apiMetaDateInfo?apiId=" + encodeURIComponent(routerParams.apiId)
    } else if (routerParams.historyId) {
      url = this.baseURL + "/api/historyApiMetaDateInfo?historyId=" + encodeURIComponent(routerParams.historyId)
    }
    specActions.download(url)
  }
  render() {

    const Layout = this.getLayout()
    return <Layout />
  }
}


App.propTypes = {
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
}
export default withRouterParams(App)
