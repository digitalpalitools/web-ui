import * as M from '@material-ui/core'
import React, { Suspense, lazy } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import * as KSCUI from '@kitamstudios/common-ui'
import TelemetryProvider from './services/Telemetry/TelemetryProvider'
import * as T from './themes'
import * as C from './components'
import * as H from './hooks'

const HomePage = lazy(() => import('./pages/Home/Home'))
const WordFrequencyPage = lazy(() => import('./pages/WordFrequency/WordFrequency'))
const PaliSortPage = lazy(() => import('./pages/PaliSort/PaliSort'))
const CountPage = lazy(() => import('./pages/Count/Count'))
const ComingSoonPage = lazy(() => import('./pages/ComingSoon/ComingSoon'))

const { REACT_APP_VERSION, REACT_APP_AI_INSTRUMENTATION_KEY } = process.env

const AppContainer = styled(M.Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  max-width: unset;
`

const AppBody = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  > div {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
  }
`

const CenteredDiv = styled.footer`
  align-self: center;
`

const AppFooter = ({ version }: any) => {
  return (
    <CenteredDiv>
      <M.Typography variant="caption" color="textSecondary">
        <M.Link color="inherit" href="https://github.com/digitalpalitools/">
          Digital Pāli Tools
        </M.Link>
        {` | ${version}`}
      </M.Typography>
    </CenteredDiv>
  )
}

const App = () => {
  const [theme, setTheme] = H.useLocalStorageState<T.ThemeType>('dark', 'currentTheme')

  const handleToggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  return (
    <M.StylesProvider injectFirst>
      <M.ThemeProvider theme={theme === 'light' ? T.lightTheme : T.darkTheme}>
        <M.CssBaseline />
        <AppContainer>
          <C.AppHeader theme={theme} toggleTheme={handleToggleTheme} />
          <AppBody>
            <Router>
              <TelemetryProvider instrumentationKey={REACT_APP_AI_INSTRUMENTATION_KEY || '0xBAADF00D'}>
                <Suspense fallback={<div>Loading...</div>}>
                  <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/pali-sort" component={PaliSortPage} />
                    <Route exact path="/count" component={CountPage} />
                    <Route exact path="/converter" component={ComingSoonPage} />
                    <Route path="/word-frequency/:nodeId?" component={WordFrequencyPage} />
                    <Route exact path="/inflect" component={ComingSoonPage} />
                    <Route exact path="/match" component={ComingSoonPage} />
                    <Route exact path="/sandhi" component={ComingSoonPage} />
                    <Route exact path="/variant" component={ComingSoonPage} />
                    <Route exact path="/dict" component={ComingSoonPage} />
                    <Route exact path="/algo" component={ComingSoonPage} />
                    <Route component={() => <div>Not Found</div>} />
                  </Switch>
                </Suspense>
              </TelemetryProvider>
            </Router>
          </AppBody>
          <KSCUI.C.UpdateAppAlert langId="en" autoHideDuration={60_000} />
          <AppFooter version={REACT_APP_VERSION} />
        </AppContainer>
      </M.ThemeProvider>
    </M.StylesProvider>
  )
}

export default App
