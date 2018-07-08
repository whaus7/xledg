import React, { Component } from 'react';
import store from './redux';
import { Provider } from 'react-redux';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LockScreen from './containers/LockedScreen';
import HomeScreen from './containers/HomeScreen';
import Password from './containers/Password';

const Dashboard = () => (
   <div>
      <h2>Wallet Dashboard</h2>
   </div>
);

class App extends Component {
   render() {
      return (
         <Provider store={store}>
            <Router>
               <div>
                  {/*<div id={'header'} style={{ background: '#202020' }}>*/}
                  {/*<div style={{ padding: 15 }}>xLedg</div>*/}
                  {/*<div />*/}
                  {/*</div>*/}

                  <Route exact path="/" component={HomeScreen} />
                  <Route path="/locked" component={LockScreen} />
                  <Route path="/password" component={Password} />
                  <Route path="/dashboard" component={Dashboard} />
               </div>
            </Router>
         </Provider>
      );
   }
}

export default App;
