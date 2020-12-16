import * as M from '@material-ui/core'
import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import TelemetryProvider from './services/Telemetry/TelemetryProvider'
import theme from './Theme'

const HomePage = lazy(() => import('./pages/Home/Home'))
const WordFrequencyPage = lazy(() => import('./pages/WordFrequency/WordFrequency'))

const { REACT_APP_VERSION, REACT_APP_AI_INSTRUMENTATION_KEY } = process.env

const AppFooter = ({ version }: any) => {
  const CenteredDiv = styled.footer`
    align-self: center;
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

const AppBody = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;

  > div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`

const AppContainer = styled(M.Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  max-width: unset;
`

const App = () => (
  <M.StylesProvider injectFirst>
    <M.ThemeProvider theme={theme}>
      <M.CssBaseline />
      <AppContainer>
        <AppBody>
          <Router>
            <TelemetryProvider instrumentationKey={REACT_APP_AI_INSTRUMENTATION_KEY || '0xBAADF00D'}>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route exact path="/word-frequency" component={WordFrequencyPage} />
                  <Route component={() => <div>Not Found</div>} />
                </Switch>
              </Suspense>
            </TelemetryProvider>
          </Router>
        </AppBody>
        <AppFooter version={REACT_APP_VERSION} />
      </AppContainer>
    </M.ThemeProvider>
  </M.StylesProvider>
)

export default App
