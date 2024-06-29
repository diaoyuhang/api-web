/**
 * @prettier
 */
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"

function App(props) {
  const { getComponent, layoutSelectors, specActions, specSelectors } = props
  const params = useParams()

  useEffect(() => {
    specActions.download("https://petstore.swagger.io/v2/swagger.json")
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

export default App
