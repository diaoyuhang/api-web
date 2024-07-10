import React, { PureComponent, useState } from "react"
import PropTypes from "prop-types"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import toString from "lodash/toString"
import withRouterParams from "../utils/withRouterParams"
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"
import Link from "@mui/material/Link"
import HistoryIcon from '@mui/icons-material/History';
import { Drawer, ListItem, ListItemButton, ListItemText } from "@mui/material"
import { request } from "../utils/request"
import Box from "@mui/material/Box"
import { FixedSizeList } from "react-window"
import { errorNotice } from "../utils/message"
import moment from "moment/moment"


function OperationSummary (props) {

/*  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    isShown: PropTypes.bool.isRequired,
    toggleShown: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
  }

  static defaultProps = {
    operationProps: null,
    specPath: List(),
    summary: ""
  }*/

  // render() {

    let {
      isShown,
      toggleShown,
      getComponent,
      authActions,
      authSelectors,
      operationProps,
      specPath,
      routerParams
    } = props

    let {
      summary,
      isAuthorized,
      method,
      op,
      showSummary,
      path,
      operationId,
      originalOperationId,
      displayOperationId,
    } = operationProps.toJS()

    let {
      summary: resolvedSummary,
    } = op

    let security = operationProps.get("security")

    const AuthorizeOperationBtn = getComponent("authorizeOperationBtn", true)
    const OperationSummaryMethod = getComponent("OperationSummaryMethod")
    const OperationSummaryPath = getComponent("OperationSummaryPath")
    const JumpToPath = getComponent("JumpToPath", true)
    const CopyToClipboardBtn = getComponent("CopyToClipboardBtn", true)
    const ArrowUpIcon = getComponent("ArrowUpIcon")
    const ArrowDownIcon = getComponent("ArrowDownIcon")

    const hasSecurity = security && !!security.count()
    const securityIsOptional = hasSecurity && security.size === 1 && security.first().isEmpty()
    const allowAnonymous = !hasSecurity || securityIsOptional

    const [drawerState, setDrawerState] = useState(false)
    const [historyData, setHistoryData] = useState([])

    const checkUpdateHistory = (apiId) => {
      request.get("/api/getApiHistoryInfo?apiId="+apiId).then(res=>{
        if (res.code === 200){
          setHistoryData(res.data);
          setDrawerState(true);
        }else{
          errorNotice(res.msg);
        }
      })
    }
    const closeDrawer = ()=>{
      setDrawerState(false);
      setHistoryData([]);
    }

  function renderRow(props) {
    const { index, style } = props;
    const eidtor = historyData[index].editor;
    const time = moment(new Date(historyData[index].editTime)).format("yyyy-MM-DD hh:mm:ss");
    return (

      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`${eidtor} ${time}`} />
        </ListItemButton>
      </ListItem>
    );
  }

    return (
      <div className={`opblock-summary opblock-summary-${method}`} >
        <button
          aria-expanded={isShown}
          className="opblock-summary-control"
          onClick={toggleShown}
        >
          <OperationSummaryMethod method={method} />
          <div className="opblock-summary-path-description-wrapper">
            <OperationSummaryPath getComponent={getComponent} operationProps={operationProps} specPath={specPath} />

            {!showSummary ? null :
              <div className="opblock-summary-description">
                {toString(resolvedSummary || summary)}
              </div>
            }
          </div>

          {displayOperationId && (originalOperationId || operationId) ? <span className="opblock-summary-operation-id">{originalOperationId || operationId}</span> : null}
        </button>
        <CopyToClipboardBtn textToCopy={`${specPath.get(1)}`} />
        {
          allowAnonymous ? null :
            <AuthorizeOperationBtn
              isAuthorized={isAuthorized}
              onClick={() => {
                const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                authActions.showDefinitions(applicableDefinitions)
              }}
            />
        }
        <JumpToPath path={specPath} />{/* TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}

        <Link href={"/web/shareApi?apiId=" + encodeURIComponent(operationProps.get("operationId") || routerParams.apiId)} underline="hover"
              color="inherit" sx={{ "&:hover": { backgroundColor: "#c1c3c7", borderRadius: 1 } }} target="_blank">
          <ShareOutlinedIcon />
        </Link>

        <Link href="#" underline="hover" onClick={()=>checkUpdateHistory(encodeURIComponent(operationProps.get("operationId") || routerParams.apiId))}
              color="inherit" sx={{ "&:hover": { backgroundColor: "#c1c3c7", borderRadius: 1 } }}>
          <HistoryIcon />
        </Link>

        <Drawer
          anchor={'left'}
          open={drawerState}
          onClose={closeDrawer}
        >
          <Box
            sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
          >
            <FixedSizeList
              height={window.innerHeight}
              width={360}
              itemSize={46}
              itemCount={historyData.length}
              overscanCount={5}
            >
              {renderRow}
            </FixedSizeList>
          </Box>
        </Drawer>

        <button
          aria-label={`${method} ${path.replace(/\//g, "\u200b/")}`}
          className="opblock-control-arrow"
          aria-expanded={isShown}
          tabIndex="-1"
          onClick={toggleShown}>
          {routerParams.apiId ? <ArrowUpIcon className="arrow" /> : <ArrowDownIcon className="arrow" />}
        </button>
      </div>
    )
  // }
}
export default withRouterParams(OperationSummary);
