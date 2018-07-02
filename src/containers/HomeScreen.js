import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';

class HomeScreen extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {};

      this.props.db
         .get('pindata')
         .then(function(pindata) {
            console.log('get pindata - then');
            console.log(pindata);
         })
         .catch(function(e) {
            console.log('get pindata - catch');
            console.log(e);
            if (e.message === 'missing') {
               that.props.setAccount('new');
            } else {
               that.props.setAccount('existing');
            }
         });
   }

   render() {
      const { walletStatus } = this.props;

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
               {walletStatus !== null ? (
                  <div style={{ alignSelf: 'center' }}>
                     {walletStatus === 'existing' ? (
                        <Link to="/locked" className={'btn'} style={{ marginRight: 15 }}>
                           LOGIN
                        </Link>
                     ) : (
                        false
                     )}
                     {walletStatus === 'new' ? (
                        <Link to="/locked" className={'btn'} style={{ marginRight: 15 }}>
                           NEW WALLET
                        </Link>
                     ) : (
                        false
                     )}
                     {walletStatus === 'new' ? (
                        <Link to="/import" className={'btn'}>
                           IMPORT WALLET
                        </Link>
                     ) : (
                        false
                     )}
                  </div>
               ) : (
                  false
               )}
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      db: state.xledg.db,
      walletStatus: state.xledg.walletStatus
   };
};

const mapDispatchToProps = dispatch => {
   return {
      setAccount: status => {
         dispatch(ReduxActions.setAccount(status));
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
