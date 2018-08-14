import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import Balances from './components/Balances';
import TradingUI from './components/TradingUI';
import OrderBook from './components/OrderBook';
import Txs from './components/Txs';
import COLORS from '../services/colors';

class Dashboard extends Component {
   constructor(props) {
      super(props);

      this.state = {
         key: '' // for testing
      };

      // Connect to Ripple API
      this.props.connect();
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.rippleApiConnected && !this.props.rippleApiConnected) {
         this.props.getGateways();
         this.props.getBalanceSheet();
         this.props.getAccountInfo();
         this.props.updateOrderBook(nextProps.pair);
      }

      // Sign the currently prepared transaction/order
      if (nextProps.preparedOrder !== null) {
         this.props.signTx(nextProps.preparedOrder.txJSON, this.state.key);
      }

      // Submit the currently signed transaction/order
      if (nextProps.signedTx !== null) {
         this.props.submitTx(nextProps.signedTx.signedTransaction);
      }

      // Update the order book immediately if pair is changed
      if (
         nextProps.baseCurrency.value !== this.props.baseCurrency.value ||
         nextProps.counterCurrency.value !== this.props.counterCurrency.value
      ) {
         this.props.updateOrderBook(nextProps.pair);
      }
   }

   render() {
      const { baseCurrency, baseAmount, counterCurrency, counterPrice } = this.props;

      return (
         // DASHBOARD
         <div>
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
                  <Logo size={'xs'} margin={'0'} />
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
                  <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #383939' }}>
                     <h2>BALANCES</h2>
                     {this.props.gateways !== null &&
                     this.props.balanceSheet !== null &&
                     this.props.accountInfo !== null ? (
                        <Balances
                           gateways={this.props.gateways}
                           accountInfo={this.props.accountInfo}
                           balanceSheet={this.props.balanceSheet}
                        />
                     ) : (
                        false
                     )}
                  </div>

                  {this.props.rippleApiConnected > 0 ? (
                     <Txs allTxs={this.props.allTxs} getTxs={address => this.props.getTxs(address)} />
                  ) : (
                     <div style={{ color: COLORS.grey, fontSize: 11 }}>No Pending Transactions</div>
                  )}

                  {/*TEMP KEY INPUT*/}
                  <div style={{ marginTop: 20 }}>
                     <input
                        placeholder={'for testing'}
                        onChange={e => {
                           this.setState({
                              key: e.target.value
                           });
                        }}
                        value={this.state.key}
                     />
                  </div>
               </div>

               {/*TRADING UI - OFFERS/ASK*/}
               <div
                  style={{
                     width: '45%'
                  }}
               />

               {/*ORDER BOOK*/}
               <div
                  style={{
                     width: '40%',
                     borderLeft: '1px solid #383939'
                  }}>
                  <TradingUI
                     {...this.props}
                     prepareOrder={() =>
                        this.props.prepareOrder(
                           'rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf',
                           {
                              direction: this.props.action,
                              quantity: {
                                 currency: baseCurrency.value,
                                 value: baseAmount
                              },
                              totalPrice: {
                                 counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
                                 currency: counterCurrency.value,
                                 value: counterPrice
                              }
                           },
                           {
                              maxFee: 500,
                              maxLedgerVersion: 100
                           }
                        )
                     }
                  />

                  {this.props.orderBook !== null ? (
                     <OrderBook
                        orderBook={this.props.orderBook}
                        action={this.props.action}
                        updateFromOrder={order => this.props.updateFromOrder(order)}
                        titleTextAlign={'center'}
                        height={200}
                     />
                  ) : (
                     <div style={{ display: 'flex', minHeight: 160, color: '#ffffff' }}>
                        <div
                           style={{ width: '100%', textAlign: 'center', alignSelf: 'center', fontSize: 12 }}>
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
      rippleApiConnected: state.xledg.rippleApiConnected,
      accountInfo: state.xledg.accountInfo,
      balanceSheet: state.xledg.balanceSheet,
      action: state.xledg.action,
      baseAmount: state.xledg.baseAmount,
      baseCurrency: state.xledg.baseCurrency,
      counterPrice: state.xledg.counterPrice,
      counterCurrency: state.xledg.counterCurrency,
      pair: state.xledg.pair,
      orderBook: state.xledg.orderBook,
      preparedOrder: state.xledg.preparedOrder,
      signedTx: state.xledg.signedTx,
      allTxs: state.xledg.allTxs
   };
};

const mapDispatchToProps = dispatch => {
   return {
      connect: () => {
         dispatch(ReduxActions.connect());
      },
      getGateways: () => {
         dispatch(ReduxActions.getGateways());
      },
      getAccountInfo: () => {
         dispatch(ReduxActions.getAccountInfo());
      },
      getBalanceSheet: () => {
         dispatch(ReduxActions.getBalanceSheet());
      },
      updateAction: action => {
         dispatch(ReduxActions.updateAction(action));
      },
      updateFromOrder: order => {
         dispatch(ReduxActions.updateFromOrder(order));
      },
      updateBaseAmount: amount => {
         dispatch(ReduxActions.updateBaseAmount(amount));
      },
      updateBaseCurrency: currency => {
         dispatch(ReduxActions.updateBaseCurrency(currency));
      },
      updateCounterPrice: price => {
         dispatch(ReduxActions.updateCounterPrice(price));
      },
      updateCounterCurrency: currency => {
         dispatch(ReduxActions.updateCounterCurrency(currency));
      },
      updateOrderBook: pair => {
         dispatch(ReduxActions.updateOrderBook(pair));
      },
      prepareOrder: (address, order, instructions) => {
         dispatch(ReduxActions.prepareOrder(address, order, instructions));
      },
      signTx: (txJSON, key) => {
         dispatch(ReduxActions.signTx(txJSON, key));
      },
      submitTx: signedTx => {
         dispatch(ReduxActions.submitTx(signedTx));
      },
      getTxStatus: txID => {
         dispatch(ReduxActions.getTxStatus(txID));
      },
      getTxs: address => {
         dispatch(ReduxActions.getTxs(address));
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
