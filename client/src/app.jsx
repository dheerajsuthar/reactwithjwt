import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { browserHistory, Router } from 'react-router';
import routes from './routes.js'

injectTapEventPlugin();

ReactDom.render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={browserHistory} routes={routes}/>
  </MuiThemeProvider>),
  document.getElementById('react-app'));
