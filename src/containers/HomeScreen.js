import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import Logo from './components/Logo';

class HomeScreen extends Component {
   constructor(props) {
      super(props);

      this.state = {};
   }

   render() {
      return (
         // HOME SCREEN
         <div
            style={
               {
                  // display: 'flex',
                  // height: '100vh',
                  // justifyContent: 'center',
                  // textAlign: 'center',
                  // background: '#202020'
               }
            }>
            {/*HEADER*/}
            <div
               id={'header'}
               style={{
                  display: 'flex',
                  width: '100%',
                  background: '#202020',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  //height: 50,
                  padding: 15
               }}>
               {/*LOGO*/}
               <div>
                  <Logo size={'sm'} margin={'0'} />
               </div>
               <div style={{ alignSelf: 'center' }}>
                  <Link to="/locked" className={'btn'} style={{ marginRight: 15 }}>
                     LOGIN
                  </Link>
                  <Link to="/locked" className={'btn'} style={{ marginRight: 15 }}>
                     NEW WALLET
                  </Link>
                  <Link to="/import" className={'btn'}>
                     IMPORT WALLET
                  </Link>
               </div>
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {};
};

const mapDispatchToProps = dispatch => {
   return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
