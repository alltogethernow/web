import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Meta from '../components/Meta'
import Grid from '@material-ui/core/Grid'
import { SnackbarProvider } from 'notistack'
import useLocalState from '../hooks/use-local-state'
import AppBar from '../components/AppBar'
import LandingPage from '../components/LandingPage'
import Home from '../components/Home'
import MainPosts from '../components/Layout'
import ChannelMenu from '../components/ChannelMenu'
import AppSettings from '../components/AppSettings'
import ChannelSettings from '../components/ChannelSettings'
import Login from '../components/Login'
import Auth from '../components/Auth'
import MicropubEditor from '../components/MicropubEditorFull'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalShortcuts from '../components/GlobalShotcuts'
import ShortcutHelp from '../components/ShortcutHelp'
import Source from '../components/Source'
import TestMe from '../components/TestMe'
import Share from '../components/Share'
import Donate from '../components/Donate'
import ServiceWorker from '../components/ServiceWorker'
import style from './style'
import PropTypes from 'prop-types'

import { ShortcutManager } from 'react-shortcuts'
import keymap from '../modules/keymap'

const shortcutManager = new ShortcutManager(keymap)

class ShortcutProvider extends Component {
  static childContextTypes = {
    shortcuts: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { shortcuts: shortcutManager }
  }

  render() {
    return this.props.children
  }
}
const AuthedRoute = ({ component: Component, ...routeProps }) => {
  const [localState] = useLocalState()

  return (
    <Route
      {...routeProps}
      render={props =>
        localState && localState.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}

const App = ({ classes }) => {
  const [localState] = useLocalState()
  const authed = localState && localState.token

  return (
    <ErrorBoundary>
      <SnackbarProvider
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Router>
          <ShortcutProvider>
            {authed ? (
              <Switch>
                <Route path="/about" component={LandingPage} />
                <Route path="/">
                  <GlobalShortcuts className={classes.appWrapper}>
                    <Grid container spacing={0} className={classes.appWrapper}>
                      <Meta />
                      <AppBar />
                      <Grid item container spacing={0} className={classes.root}>
                        <ChannelMenu />
                        <main className={classes.main}>
                          <AuthedRoute exact path="/" component={Home} />
                          <AuthedRoute
                            path="/channel/:channelSlug"
                            component={MainPosts}
                          />
                          <AuthedRoute
                            path="/me/:postType"
                            component={TestMe}
                          />
                          <AuthedRoute path="/me" component={TestMe} />
                          <Switch>
                            <AuthedRoute
                              path="/channel/:channelSlug/edit"
                              component={ChannelSettings}
                            />
                            <AuthedRoute
                              path="/channel/:channelSlug/:source"
                              component={Source}
                            />
                          </Switch>
                          <AuthedRoute
                            path="/editor"
                            component={MicropubEditor}
                          />
                          <AuthedRoute
                            path="/settings"
                            component={AppSettings}
                          />
                          <ShortcutHelp />
                          <Route path="/share" component={Share} />
                          <Route path="/donate" component={Donate} />
                        </main>
                        <Route path="/login" component={Login} />
                        <Route path="/auth" component={Auth} />
                      </Grid>
                    </Grid>
                  </GlobalShortcuts>
                </Route>
              </Switch>
            ) : (
              <>
                <Route path="/" component={LandingPage} />
                <Switch>
                  <Route path="/login" component={Login} />
                  <Route path="/auth" component={Auth} />
                  <Route component={() => <Redirect to="/" />} />
                </Switch>
              </>
            )}
          </ShortcutProvider>
        </Router>
        <ServiceWorker />
      </SnackbarProvider>
    </ErrorBoundary>
  )
}

export default withStyles(style)(App)
