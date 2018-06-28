import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import LockScreen from './containers/LockedScreen';
import HomeScreen from './containers/HomeScreen';

const Dashboard = () => (
   <div>
      <h2>Wallet Dashboard</h2>
   </div>
);

class App extends Component {
   render() {
      return (
         <Router>
            <div>
               {/*<div id={'header'} style={{ background: '#202020' }}>*/}
               {/*<div style={{ padding: 15 }}>xLedg</div>*/}
               {/*<div />*/}
               {/*</div>*/}

               <Route exact path="/" component={HomeScreen} />
               <Route path="/locked" component={LockScreen} />
               <Route path="/dashboard" component={Dashboard} />
            </div>
         </Router>
      );
   }
}

export default App;
