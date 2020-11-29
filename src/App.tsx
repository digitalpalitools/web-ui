import * as M from '@material-ui/core'
import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import TelemetryProvider from './services/Telemetry/TelemetryProvider'
import theme from './Theme'

const Page1 = lazy(() => import('./pages/Page1/Page1'))
const Page2 = lazy(() => import('./pages/Page2/Page2'))

const { REACT_APP_VERSION, REACT_APP_AI_INSTRUMENTATION_KEY } = process.env

function Copyright({ version }: any) {
  const Y = styled.div`
    align-self: center;
    margin-top: auto;
  `
  return (
    <Y>
      <M.Typography variant="caption" color="textSecondary">
        <M.Link color="inherit" href="https://www.kitamstudios.com/">
          Kitam Studios
        </M.Link>
        {` | ${version}`}
      </M.Typography>
    </Y>
  )
}

const X = styled(M.Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const App = () => (
  <M.StylesProvider injectFirst>
    <M.ThemeProvider theme={theme}>
      <M.CssBaseline />
      <X>
        <Router>
          <TelemetryProvider instrumentationKey={REACT_APP_AI_INSTRUMENTATION_KEY || '0xBAADF00D'}>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={Page1} />
                <Route exact path="/page2" component={Page2} />
                <Route component={() => <div>Not Found</div>} />
              </Switch>
            </Suspense>
          </TelemetryProvider>
        </Router>
        <Copyright version={REACT_APP_VERSION} />
      </X>
    </M.ThemeProvider>
  </M.StylesProvider>
)

export default App
