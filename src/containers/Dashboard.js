import React, { Component } from 'react';
//import Grid from '@material-ui/core/Grid';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import Balances from './components/Balances';
import TradingUI from './components/TradingUI';
import OrderBook from './components/OrderBook';

const RippleAPI = require('ripple-lib').RippleAPI;

class Dashboard extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {
         api: new RippleAPI({
            server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
         }),
         balanceSheet: null,
         orderBook: null,

         // DEFAULT PAIR
         pair: {
            base: {
               currency: 'XRP'
               //counterparty: ''
            },
            counter: {
               currency: 'USD',
               counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'
            }
         }
      };

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
            // Get the current wallet/account balances
            that.updateBalances();
            // Get the current orderbook
            that.updateOrderBook();

            setInterval(function() {
               // Get the current wallet/account balances
               that.updateBalances();

               // Get the current orderbook
               if (that.state.orderInfo !== null) {
                  that.updateOrderBook();
               }
            }, 200000);
         })
         .catch(console.error);
   }

   // TODO build the pair from the order info and update the pair state
   // call updateOrderBook on setState callback
   updatePair() {}

   updateOrderBook() {
      console.log('ORDER INFO');
      console.log(this.state.orderInfo);

      this.state.api
         .getOrderbook('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf', this.state.pair, {
            limit: 10
         })
         .then(orderBook => {
            console.log('ORDER BOOK');
            console.log(orderBook);
            this.setState({
               orderBook: orderBook
            });
         });
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
                  <TradingUI
                     gateways={this.props.gateways}
                     updateOrder={orderInfo => {
                        this.setState(
                           {
                              orderInfo: orderInfo
                           },
                           () => this.updateOrderBook()
                        );
                     }}
                  />
               </div>

               {/*ORDER BOOK*/}
               <div
                  style={{
                     width: '45%'
                  }}>
                  {this.state.orderBook !== null ? (
                     <OrderBook orderBook={this.state.orderBook} />
                  ) : (
                     <div style={{ display: 'flex', minHeight: 160, color: '#ffffff' }}>
                        <div style={{ width: '100%', textAlign: 'center', alignSelf: 'center', fontSize: 12 }}>
                           Select a Trading Pair to View Order Book
                        </div>
                     </div>
                  )}
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
