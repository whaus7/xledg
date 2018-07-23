import React, { Component } from 'react';
//import Grid from '@material-ui/core/Grid';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import Balances from './components/Balances';
import TradingUI from './components/TradingUI';

const RippleAPI = require('ripple-lib').RippleAPI;

class Dashboard extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {
         api: new RippleAPI({
            server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
         }),
         balanceSheet: null
         //balances: null
      };

      // const api = new RippleAPI({
      //    server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
      // });

      // Ripple API for XRP Ledger
      this.props.getGateways();

      // DATA API - XRP Ledger
      this.state.api.on('error', (errorCode, errorMessage) => {
         console.log(errorCode + ': ' + errorMessage);
      });

      this.state.api.on('connected', () => {
         console.log('connected');
      });

      this.state.api.on('disconnected', code => {
         // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
         // will be 1000 if this was normal closure
         console.log('disconnected, code:', code);
      });

      this.state.api
         .connect()
         .then(() => {
            /* insert code here */
            this.updateBalances();
         })
         //.then(() => {
         //return api.disconnect();
         //})
         .catch(console.error);

      // Set the current account status
      // this.props.db
      //    .get('pindata')
      //    .then(function(pindata) {
      //       console.log('get pindata - then');
      //       console.log(pindata);
      //       that.props.setAccount('existing');
      //    })
      //    .catch(function(e) {
      //       console.log('get pindata - catch');
      //       console.log(e);
      //       if (e.message === 'missing') {
      //          that.props.setAccount('new');
      //       } else {
      //          that.props.setAccount('existing');
      //       }
      //    });
   }

   updateBalances() {
      this.state.api.getAccountInfo('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf').then(accountInfo => {
         console.log('ACCOUNT INFO');
         console.log(accountInfo);
         this.setState({
            accountInfo: accountInfo
         });
      });

      this.state.api.getBalanceSheet('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf').then(balanceSheet => {
         console.log('BALANCE SHEET');
         console.log(balanceSheet);
         this.setState({
            balanceSheet: balanceSheet
         });
      });

      // this.state.api.getBalances('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf').then(balances => {
      //    console.log('BALANCES');
      //    console.log(balances);
      //    this.setState({
      //       balances: balances
      //    });
      // });
   }

   componentWillReceiveProps(props) {
      // close the modal if we have a successful saga
      if (props.submitFetching === 'success') {
         this.props.resetToIdle();
      }

      console.log('props received');
      if (props.gateways !== null) {
         console.log('GATEWAYS');
         console.log(props.gateways);
         console.log('BALANCE SHEET');
         console.log(this.state.balanceSheet);
      }
   }

   render() {
      const { walletStatus } = this.props;

      return (
         // DASHBOARD
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
                  padding: 15,
                  borderBottom: '1px solid #383939'
               }}>
               {/*LOGO*/}
               <div>
                  <Logo size={'sm'} margin={'0'} />
               </div>

               <div style={{ alignSelf: 'center' }}>Actions</div>
            </div>

            {/*BODY*/}
            <div
               id={'body'}
               style={{
                  display: 'flex',
                  width: '100%',
                  background: '#202020',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box'
               }}>
               {/*BALANCES*/}
               <div
                  style={{
                     width: '15%',
                     height: '100vh',
                     textAlign: 'left',
                     color: '#ffffff',
                     padding: 15,
                     borderRight: '1px solid #383939'
                  }}>
                  <h2>BALANCES</h2>
                  {this.props.gateways !== null && this.state.balanceSheet !== null && this.state.balances !== null ? (
                     <Balances
                        gateways={this.props.gateways}
                        accountInfo={this.state.accountInfo}
                        balanceSheet={this.state.balanceSheet}
                     />
                  ) : (
                     false
                  )}
               </div>

               {/*TRADING UI - OFFERS/ASK*/}
               <div
                  style={{
                     width: '40%'
                  }}>
                  <TradingUI gateways={this.props.gateways} />
               </div>

               {/*ORDER BOOK*/}
               <div
                  style={{
                     width: '45%'
                  }}>
                  ORDER BOOK
               </div>

               {/*RIGHT BAR*/}
               {/*<div*/}
               {/*style={{*/}
               {/*width: '15%'*/}
               {/*}}>*/}
               {/*RIGHT BAR*/}
               {/*</div>*/}
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      db: state.xledg.db,
      walletStatus: state.xledg.walletStatus,
      gateways: state.xledg.gateways,
      submitFetching: state.xledg.submitFetching
   };
};

const mapDispatchToProps = dispatch => {
   return {
      resetToIdle: () => {
         dispatch(ReduxActions.resetToIdle());
      },
      setAccount: status => {
         dispatch(ReduxActions.setAccount(status));
      },
      getGateways: () => {
         dispatch(ReduxActions.getGateways());
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
