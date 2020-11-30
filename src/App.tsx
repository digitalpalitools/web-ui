import * as M from '@material-ui/core'
import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import TelemetryProvider from './services/Telemetry/TelemetryProvider'
import theme from './Theme'

const HomePage = lazy(() => import('./pages/Home/Home'))

const { REACT_APP_VERSION, REACT_APP_AI_INSTRUMENTATION_KEY } = process.env

const Footer = ({ version }: any) => {
  const CenteredDiv = styled.div`
    align-self: center;
    margin-top: auto;
  `

  return (
    <CenteredDiv>
      <M.Typography variant="caption" color="textSecondary">
        <M.Link color="inherit" href="https://www.kitamstudios.com/">
          Kitam Studios
        </M.Link>
        {` | ${version}`}
      </M.Typography>
    </CenteredDiv>
  )
}

const FullHeightContainer = styled(M.Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const App = () => (
  <M.StylesProvider injectFirst>
    <M.ThemeProvider theme={theme}>
      <M.CssBaseline />
      <FullHeightContainer>
        <Router>
          <TelemetryProvider instrumentationKey={REACT_APP_AI_INSTRUMENTATION_KEY || '0xBAADF00D'}>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route component={() => <div>Not Found</div>} />
              </Switch>
            </Suspense>
          </TelemetryProvider>
        </Router>
        <Footer version={REACT_APP_VERSION} />
      </FullHeightContainer>
    </M.ThemeProvider>
  </M.StylesProvider>
)

export default App
