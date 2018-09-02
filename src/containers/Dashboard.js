import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReduxActions from '../redux/XledgRedux';

import spinner1 from '../images/spinners/xLedg-Spinner-1.svg';
import Logo from './components/Logo';
import xrpIcon from '../images/xrp-icon.svg';
import infoIcon from '../images/icons/info.svg';
import oneIcon from '../images/number_icons/1.svg';
import twoIcon from '../images/number_icons/2.svg';
import threeIcon from '../images/number_icons/3.svg';
import fourIcon from '../images/number_icons/4.svg';
import fiveIcon from '../images/number_icons/5.svg';

import Balances from './components/Balances';
import TradingUI from './components/TradingUI';
import OrderBook from './components/OrderBook';
import Txs from './components/Txs';
import COLORS from '../services/colors';
import LineChart from './components/LineChart';
import { Motion, spring } from 'react-motion';
import { notification } from '../services/helpers';
import InfoMenu from './components/InfoMenu';

const instructions = [
   { id: 1, text: 'Use a compatible browser and plug-in your Ledger wallet', icon: oneIcon },
   { id: 2, text: 'Unlock your Ledger wallet & open the XRP app', icon: twoIcon },
   { id: 3, text: "Go to 'Settings' and enable 'Browser support'", icon: fourIcon },
   { id: 4, text: "Click 'Fetch Wallet Address' to begin", icon: fiveIcon }
];

class Dashboard extends Component {
   constructor(props) {
      super(props);

      this.state = {
         key: '', // for testing,
         showLoading: false,
         connected: false,
         connectionScreen: true,
         instructionsHovered: false
      };

      // Connect to Ripple API
      this.props.connect();
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.rippleApiConnected && !this.props.rippleApiConnected) {
         this.props.getGateways();

         this.props.getExchangeHistory(nextProps.baseCurrency, nextProps.counterCurrency);

         this.props.getBalanceSheet(nextProps.publicAddress);
         this.props.getAccountInfo(nextProps.publicAddress);
         this.props.updateOrderBook(nextProps.publicAddress, nextProps.pair);
      }

      // Sign the prepared transaction/order
      if (nextProps.preparedOrder !== null) {
         console.log('prepared order');
         console.log(nextProps.preparedOrder);

         notification(
            `<span style="color: #21c2f8; margin-right: 20px">ORDER SUBMITTED</span>${parseFloat(
               nextProps.preparedOrderData.quantity.value
            ).toFixed(2)} ${nextProps.preparedOrderData.quantity.currency} @ 
            ${parseFloat(nextProps.preparedOrderData.totalPrice.value).toFixed(6)} ${
               nextProps.preparedOrderData.totalPrice.currency
            }`,
            'success'
         );
         this.props.signTx(nextProps.preparedOrder.txJSON, this.state.key);
      }

      // Submit the signed transaction/order
      if (nextProps.signedTx !== null) {
         this.props.submitTx(nextProps.signedTx.signedTransaction);
      }

      // Update the transaction list when a order is submitted
      if (this.props.signedTx !== null && nextProps.signedTx === null) {
         this.setState({
            showLoading: true
         });
         setTimeout(
            function() {
               this.props.getTxs(nextProps.publicAddress);
               this.props.getOrders(nextProps.publicAddress);
               this.props.getBalanceSheet(nextProps.publicAddress);
               this.props.getAccountInfo(nextProps.publicAddress);
               this.props.updateOrderBook(nextProps.publicAddress, nextProps.pair);

               this.setState({
                  showLoading: false
               });
            }.bind(this),
            8000
         );
      }

      // Update the order book immediately if pair is changed
      if (
         nextProps.baseCurrency.value !== this.props.baseCurrency.value ||
         nextProps.counterCurrency.value !== this.props.counterCurrency.value
      ) {
         this.props.updateOrderBook(nextProps.pair);
         this.props.getExchangeHistory(nextProps.baseCurrency, nextProps.counterCurrency);
      }
   }

   render() {
      const { baseCurrency, baseAmount, counterCurrency, counterPrice } = this.props;

      const springConfig = { stiffness: 70, damping: 30 };

      return (
         <div style={{ height: this.state.connectionScreen ? '100vh' : 'auto', overflow: 'hidden' }}>
            {/*CONNECTION SCREEN*/}
            {this.state.connectionScreen ? (
               <div
                  className={this.state.connected ? 'fadeBackground' : ''}
                  style={{
                     position: 'absolute',
                     display: 'flex',
                     height: '100vh',
                     width: '100%',
                     justifyContent: 'center',
                     textAlign: 'center',
                     background: 'rgb(32, 32, 32, 1)',
                     color: COLORS.white,
                     zIndex: 1
                  }}>
                  {/*Hardware Ledger Connection Screen*/}
                  <Motion
                     defaultStyle={{
                        width: 600,
                        height: 600,
                        slideDown: 230
                     }}
                     style={{
                        width: spring(this.state.connected ? 4600 : 600, springConfig),
                        height: spring(this.state.connected ? 4600 : 600, springConfig),
                        slideDown: spring(this.state.connected ? 900 : 230, springConfig)
                     }}>
                     {value => (
                        <div
                           style={{
                              width: value.width,
                              height: value.height,
                              alignSelf: 'center'
                           }}>
                           <img
                              src={spinner1}
                              style={{ width: value.width, height: value.height }}
                              alt={'xLedg - Hardware Connection Screen'}
                           />

                           {/*<img*/}
                           {/*className={'centerAbsolute'}*/}
                           {/*src={spinner2}*/}
                           {/*style={{ width: 600, height: 600 }}*/}
                           {/*alt={'xLedg - Hardware Connection Screen'}*/}
                           {/*/>*/}
                           <img
                              className={`centerAbsolute fadeOut ${this.state.connected ? 'fade' : false}`}
                              src={xrpIcon}
                              style={{
                                 width: 180,
                                 height: 180
                              }}
                              alt={'xLedg - XRPL Decentralized Exchange'}
                           />

                           <div
                              style={{ color: '#202020', fontSize: 12, marginTop: -220 }}
                              className={`centerAbsolute blinkTextWhite fadeOut ${
                                 this.state.connected ? 'fade' : false
                              }`}>
                              Waiting For Cold Connection...
                           </div>

                           <div
                              style={{ marginTop: value.slideDown, opacity: 0.5 }}
                              className={`centerAbsolute btn btnHover fadeOut ${
                                 this.state.connected ? 'fade' : false
                              }`}
                              onClick={() => {
                                 this.setState({
                                    connected: true
                                 });

                                 setTimeout(
                                    function() {
                                       this.setState({
                                          connectionScreen: false
                                       });
                                    }.bind(this),
                                    1000
                                 );
                              }}>
                              JUST BROWSING
                           </div>
                        </div>
                     )}
                  </Motion>

                  {/*INSTRUCTIONS*/}
                  <div
                     style={{
                        position: 'absolute',
                        left: 105,
                        top: 0,
                        height: '100vh',
                        width: 75
                     }}>
                     <div
                        onMouseEnter={() =>
                           this.setState({
                              instructionsHovered: true
                           })
                        }
                        onMouseLeave={() =>
                           this.setState({
                              instructionsHovered: false
                           })
                        }
                        className={`centerAbsolute fadeIn ${
                           this.state.instructionsHovered !== false ? 'fade' : false
                        }`}
                        style={{ width: 250, fontSize: 14 }}>
                        <div
                           style={{
                              textAlign: 'left',
                              fontSize: 12,
                              cursor: this.state.instructionsHovered !== false ? 'help' : 'default'
                           }}>
                           <div style={{ textAlign: 'center', marginBottom: 10 }}>
                              <img
                                 src={infoIcon}
                                 style={{
                                    width: 40,
                                    height: 40
                                 }}
                              />
                           </div>
                           <div style={{ textAlign: 'center', marginBottom: 10 }}>
                              <h2>INSTRUCTIONS</h2>
                           </div>

                           {instructions.map((item, i) => {
                              return (
                                 <div
                                    key={`xLedg_instructions_${i}`}
                                    style={{ display: 'flex', marginBottom: 8 }}>
                                    <div style={{ minWidth: 32, alignSelf: 'center' }}>
                                       <img src={item.icon} width={20} height={20} />
                                    </div>
                                    <div>{item.text}</div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  <InfoMenu />
               </div>
            ) : (
               false
            )}

            {/*DASHBOARD*/}
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

                  <div style={{ alignSelf: 'center' }}>
                     {/*TEMP KEY INPUT*/}
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
               {/*LOADING BAR*/}
               <div style={{ position: 'relative' }}>
                  <div className={`loadingBar ${this.state.showLoading ? 'inProgress' : ''}`} />
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
                        height: '100%',
                        minHeight: '100vh',
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
                              balances={this.props.balances}
                              assetTotals={this.props.assetTotals}
                           />
                        ) : (
                           false
                        )}
                     </div>

                     {this.props.rippleApiConnected > 0 ? (
                        <Txs
                           publicAddress={this.props.publicAddress}
                           allTxs={this.props.allTxs}
                           openOrders={this.props.openOrders}
                           getTxs={address => this.props.getTxs(address)}
                           getOrders={address => this.props.getOrders(address, { limit: 10 })}
                           cancelOrder={tx => {
                              console.log(tx);
                              this.props.cancelOrder(this.props.publicAddress, {
                                 orderSequence: tx.properties.sequence
                              });
                           }}
                        />
                     ) : (
                        <div style={{ color: COLORS.grey, fontSize: 11 }}>No Pending Transactions</div>
                     )}
                  </div>

                  {/*CENTER*/}
                  <div
                     id={'centerCol'}
                     style={{
                        width: '45%'
                     }}>
                     <LineChart
                        data={this.props.exchangeHistory}
                        baseCurrency={this.props.baseCurrency}
                        counterCurrency={this.props.counterCurrency}
                     />
                  </div>

                  {/*RIGHT BAR*/}
                  <div
                     style={{
                        width: '40%',
                        borderLeft: '1px solid #383939'
                     }}>
                     {/*TRADING UI - OFFERS/ASK*/}
                     <TradingUI
                        {...this.props}
                        prepareOrder={() =>
                           this.props.prepareOrder(
                              this.props.publicAddress,
                              {
                                 direction: this.props.action,
                                 quantity: {
                                    currency: baseCurrency.value,
                                    value: baseAmount
                                 },
                                 totalPrice: {
                                    counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B', // Bitstamp
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

                     {/*ORDER BOOK*/}
                     {this.props.orderBook !== null ? (
                        <OrderBook
                           orderBook={this.props.orderBook}
                           action={this.props.action}
                           updateFromOrder={order => this.props.updateFromOrder(order)}
                           titleTextAlign={'center'}
                           height={300}
                        />
                     ) : (
                        <div style={{ display: 'flex', minHeight: 160, color: '#ffffff' }}>
                           <div
                              style={{
                                 width: '100%',
                                 textAlign: 'center',
                                 alignSelf: 'center',
                                 fontSize: 12
                              }}>
                              Select a Trading Pair to View Order Book
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      publicAddress: state.xledg.publicAddress,
      db: state.xledg.db,
      walletStatus: state.xledg.walletStatus,
      gateways: state.xledg.gateways,
      exchangeHistory: state.xledg.exchangeHistory,
      rippleApiConnected: state.xledg.rippleApiConnected,
      accountInfo: state.xledg.accountInfo,
      balanceSheet: state.xledg.balanceSheet,
      balances: state.xledg.balances,
      assetTotals: state.xledg.assetTotals,
      action: state.xledg.action,
      baseAmount: state.xledg.baseAmount,
      baseCurrency: state.xledg.baseCurrency,
      counterPrice: state.xledg.counterPrice,
      counterCurrency: state.xledg.counterCurrency,
      pair: state.xledg.pair,
      orderBook: state.xledg.orderBook,
      preparedOrder: state.xledg.preparedOrder,
      preparedOrderData: state.xledg.preparedOrderData,
      signedTx: state.xledg.signedTx,
      allTxs: state.xledg.allTxs,
      openOrders: state.xledg.openOrders
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
      getExchangeHistory: (baseCurrency, counterCurrency) => {
         dispatch(ReduxActions.getExchangeHistory(baseCurrency, counterCurrency));
      },
      getAccountInfo: address => {
         dispatch(ReduxActions.getAccountInfo(address));
      },
      getBalanceSheet: address => {
         dispatch(ReduxActions.getBalanceSheet(address));
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
      updateOrderBook: (address, pair) => {
         dispatch(ReduxActions.updateOrderBook(address, pair));
      },
      prepareOrder: (address, order, instructions) => {
         dispatch(ReduxActions.prepareOrder(address, order, instructions));
      },
      cancelOrder: (address, orderCancellation) => {
         dispatch(ReduxActions.cancelOrder(address, orderCancellation));
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
      },
      getOrders: (address, options) => {
         dispatch(ReduxActions.getOrders(address, options));
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
