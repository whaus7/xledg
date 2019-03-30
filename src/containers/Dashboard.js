import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import ReduxActions from '../redux/XledgRedux';

import { Row, Col, Tabs } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import spinner1 from '../images/spinners/xLedg-Spinner-1.svg';
import Logo from './components/Logo';
import xrpIcon from '../images/xrp-icon.svg';

import Balances from './components/Balances';
import TradingUI from './components/TradingUI';
import OrderBook from './components/OrderBook';
import Txs from './components/Txs';
import COLORS from '../services/colors';
import LineChart from './components/LineChart';
import { Motion, spring } from 'react-motion';
import { notification } from '../services/helpers';
import InfoMenu from './components/InfoMenu';
import Instructions from './components/Instructions';
import Title from './ui/Title';
import Order from './components/Order';
import OrderHistory from './components/OrderHistory';

const TabPane = Tabs.TabPane;

const MIN_COL_WIDTH = 250;
const MAX_COL_WIDTH = 350;

class Dashboard extends Component {
   constructor(props) {
      super(props);

      this.props.openTransport();

      this.state = {
         key: '', // for testing,
         showLoading: false,
         initialized: false,
         connected: false,
         connectionScreen: true,
         initBtnHovered: false
         //pendingSignature: false
      };

      // Connect to Ripple API
      this.props.connect();
   }

   componentDidMount() {
      window.addEventListener('resize', evt => {
         this.props.updateWindowDimensions(evt.target.innerWidth, evt.target.innerHeight);
      });
   }

   componentWillReceiveProps(nextProps) {
      // TEST WALLET - TEST
      if (nextProps.rippleApiConnected && !this.props.rippleApiConnected) {
         this.props.getGateways();

         if (nextProps.baseCurrency.value !== null && nextProps.counterCurrency.value !== null) {
            this.props.getExchangeHistory(nextProps.baseCurrency, nextProps.counterCurrency);
         }

         if (nextProps.pair.base !== null && nextProps.pair.counter !== null) {
            this.props.updateOrderBook(nextProps.publicAddress, nextProps.pair);
         }

         this.props.getBalanceSheet(nextProps.publicAddress);
         this.props.getAccountInfo(nextProps.publicAddress);
      }

      // LEDGER WALLET - PROD
      // if (nextProps.rippleApiConnected && !this.props.rippleApiConnected) {
      //    this.props.getGateways();
      //    if (nextProps.baseCurrency.value !== null && nextProps.counterCurrency.value !== null) {
      //       this.props.getExchangeHistory(nextProps.baseCurrency, nextProps.counterCurrency);
      //    }
      // }
      //
      // if (
      //    nextProps.rippleApiConnected &&
      //    this.props.publicAddress === null &&
      //    nextProps.publicAddress !== null
      // ) {
      //    if (nextProps.pair.base !== null && nextProps.pair.counter !== null) {
      //       this.props.updateOrderBook(nextProps.publicAddress, nextProps.pair);
      //    }
      //    this.props.getBalanceSheet(nextProps.publicAddress);
      //    this.props.getAccountInfo(nextProps.publicAddress);
      // }

      // Sign the prepared transaction/order
      if (nextProps.preparedOrder !== null) {
         console.log('prepared order');
         console.log(nextProps.preparedOrder);

         // if (nextProps.preparedOrderData !== null) {
         //    notification(
         //       `<span style="color: #21c2f8; margin-right: 20px">ORDER CREATED</span>${parseFloat(
         //          nextProps.preparedOrderData.quantity.value
         //       ).toFixed(2)} ${nextProps.preparedOrderData.quantity.currency} FOR
         //    ${parseFloat(nextProps.preparedOrderData.totalPrice.value).toFixed(6)} ${
         //          nextProps.preparedOrderData.totalPrice.currency
         //       }`,
         //       'success'
         //    );
         // }

         // this.setState({
         // pendingSignature: true
         // })
         this.props.signTx(nextProps.preparedOrder.txJSON, nextProps.publicKey);
      }

      // Submit the signed transaction/order
      if (nextProps.signedTx !== null) {
         //this.props.submitTx(nextProps.signedTx.signedTransaction);
         this.props.submitTx(nextProps.signedTx);
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

               if (nextProps.baseCurrency.value !== null && nextProps.counterCurrency.value !== null) {
                  this.props.getExchangeHistory(nextProps.baseCurrency, nextProps.counterCurrency);
               }

               if (nextProps.pair.base !== null && nextProps.pair.counter !== null) {
                  this.props.updateOrderBook(nextProps.publicAddress, nextProps.pair);
               }

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
         if (nextProps.pair.base !== null && nextProps.pair.counter !== null) {
            this.props.updateOrderBook(nextProps.publicAddress, nextProps.pair);
         }
         this.props.getExchangeHistory(nextProps.baseCurrency, nextProps.counterCurrency);
      }

      // Initialize the Ledger hardware wallet connection
      if (nextProps.publicAddress !== null) {
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
      }
   }

   render() {
      const {
         winH,
         winW,
         action,
         baseCurrency,
         baseAmount,
         counterCurrency,
         counterPrice,
         orderBook,
         gateways,
         exchangeHistory,
         accountInfo,
         balanceSheet,
         balances,
         assetTotals,
         rippleApiConnected,
         publicAddress,
         allTxs
      } = this.props;

      const springConfig = { stiffness: 70, damping: 30 };

      return (
         <div
            style={{
               position: 'absolute',
               background: '#202020',
               height: winH,
               width: '100%',
               overflow: 'hidden'
            }}>
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
                     background: '#202020',
                     color: COLORS.white,
                     zIndex: 2
                  }}>
                  {/*Hardware Ledger Connection Screen*/}
                  <Motion
                     defaultStyle={{
                        spinnerSize: 600,
                        iconSize: 180,
                        slideDown: 230,
                        slideUp: -230,
                        slideWaitingTextUp: -180
                     }}
                     style={{
                        spinnerSize: spring(
                           this.state.connected ? 4600 : this.state.initialized ? 450 : 600,
                           springConfig
                        ),
                        iconSize: spring(
                           this.state.connected ? 0 : this.state.initialized ? 135 : 180,
                           springConfig
                        ),
                        slideDown: spring(this.state.connected ? 900 : 230, springConfig),
                        slideUp: spring(this.state.connected ? -900 : -230, springConfig),
                        slideWaitingTextUp: spring(this.state.connected ? -900 : -180, springConfig)
                     }}>
                     {value => (
                        <div
                           style={{
                              width: value.spinnerSize,
                              height: value.spinnerSize,
                              alignSelf: 'center'
                           }}>
                           <img
                              src={spinner1}
                              style={{ width: value.spinnerSize, height: value.spinnerSize }}
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
                                 width: value.iconSize,
                                 height: value.iconSize
                              }}
                              alt={'xLedg - XRPL Decentralized Exchange'}
                           />

                           {this.state.initialized ? (
                              <div
                                 style={{
                                    color: '#ffffff',
                                    fontSize: 12,
                                    marginTop: value.slideWaitingTextUp
                                 }}
                                 className={`centerAbsolute blinkTextWhite`}>
                                 Waiting for cold connection...<br />Confirm prompt on your Ledger wallet
                              </div>
                           ) : (
                              false
                           )}

                           <div
                              onMouseEnter={() => {
                                 this.setState({
                                    initBtnHovered: true
                                 });
                              }}
                              onMouseLeave={() => {
                                 this.setState({
                                    initBtnHovered: false
                                 });
                              }}
                              style={{
                                 marginTop: value.slideUp,
                                 //marginTop: 0,
                                 borderColor:
                                    this.state.initBtnHovered || this.state.initialized
                                       ? '#21c2f8'
                                       : '#ffffff'
                              }}
                              className={`centerAbsolute ${
                                 this.state.initBtnHovered
                                    ? false
                                    : this.state.initialized ? false : 'blinkTextWhite'
                              } btn btnHover fadeOut ${this.state.connected ? 'fade' : false}`}
                              onClick={() => {
                                 this.setState({
                                    initialized: true
                                 });

                                 this.props.getWalletAddress();
                              }}>
                              INITIALIZE COLD CONNECTION
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
                              VIEW DEMO WALLET
                           </div>
                        </div>
                     )}
                  </Motion>

                  {/*INSTRUCTIONS & INFO MENU*/}
                  <div className={`fadeOut ${this.state.connected ? 'fade' : false}`}>
                     <InfoMenu />
                     <Instructions />
                  </div>
               </div>
            ) : (
               false
            )}

            {/*DESKTOP*/}
            {winW > 1000 ? (
               <Row>
                  {/*HEADER*/}
                  <Row
                     style={{
                        padding: 15,
                        borderBottom: '1px solid #383939'
                     }}>
                     <Col span={12}>
                        <Logo size={'xs'} margin={'0'} />
                     </Col>
                     <Col span={12}>
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
                     </Col>
                  </Row>

                  {/*MAIN*/}
                  <div style={{ display: 'flex', overflowX: 'auto' }}>
                     <div style={{ minWidth: MIN_COL_WIDTH, maxWidth: MAX_COL_WIDTH, padding: '0 1px' }}>
                        <Row
                           className={'noScrollBar'}
                           style={{ height: winH, overflowY: 'auto', paddingBottom: 65 }}>
                           {/*BALANCES*/}
                           <Title text={'Wallet Balance'} />
                           <Row style={{ color: '#ffffff', padding: 15 }}>
                              {gateways !== null &&
                              //this.props.balanceSheet !== null &&
                              accountInfo !== null ? (
                                 <Balances
                                    gateways={gateways}
                                    accountInfo={accountInfo}
                                    balanceSheet={balanceSheet}
                                    balances={balances}
                                    assetTotals={assetTotals}
                                 />
                              ) : (
                                 false
                              )}
                           </Row>

                           {/*TRADING UI - OFFERS/ASK*/}
                           <Row>
                              <TradingUI
                                 {...this.props}
                                 // prepareOrder={() =>
                                 //    this.props.prepareOrder(
                                 //       this.props.publicAddress,
                                 //       {
                                 //          direction: this.props.action,
                                 //          quantity: {
                                 //             currency: baseCurrency.value,
                                 //             value: baseAmount
                                 //          },
                                 //          totalPrice: {
                                 //             counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B', // Bitstamp
                                 //             currency: counterCurrency.value,
                                 //             value: (counterPrice * baseAmount).toString()
                                 //          }
                                 //       }
                                 //       {
                                 //          maxFee: 500,
                                 //          maxLedgerVersion: 100
                                 //       }
                                 //    )
                                 // }
                                 prepareOrder={() =>
                                    this.props.prepareOrder(
                                       this.props.publicAddress,
                                       {
                                          source: {
                                             address: this.props.publicAddress,
                                             maxAmount: {
                                                value: '1',
                                                currency: 'XRP'
                                             }
                                          },
                                          destination: {
                                             address: 'rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf',
                                             amount: {
                                                value: '1',
                                                currency: 'XRP'
                                             }
                                          }
                                       }
                                       // {
                                       //    maxFee: 500,
                                       //    maxLedgerVersion: 100
                                       // }
                                    )
                                 }
                              />
                           </Row>
                        </Row>
                     </div>
                     <div style={{ minWidth: MIN_COL_WIDTH, maxWidth: MAX_COL_WIDTH, padding: '0 1px' }}>
                        {/*ORDER BOOK*/}
                        <Title text={'Order Book'} />
                        <div style={{ display: 'flex', fontSize: 11, padding: '5px 15px', color: '#ffffff' }}>
                           <div style={{ width: '20%' }}>&nbsp;</div>
                           <div style={{ width: '40%', marginRight: 10, textAlign: 'right' }}>
                              Size ({baseCurrency.value})
                           </div>
                           <div style={{ width: '40%', textAlign: 'right' }}>
                              Price ({counterCurrency.value})
                           </div>
                        </div>
                        {orderBook !== null ? (
                           <OrderBook
                              winH={winH}
                              orderBook={orderBook}
                              action={action}
                              updateFromOrder={order => this.props.updateFromOrder(order)}
                              titleTextAlign={'center'}
                              height={1000}
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
                     <div id={'centerCol'} style={{ flex: 1, minWidth: 500, padding: '0 1px' }}>
                        <Row
                           className={'noScrollBar'}
                           style={{ height: winH, overflowY: 'auto', paddingBottom: 65 }}>
                           <Title text={`${baseCurrency.value}/${counterCurrency.value} Price & Volume`} />
                           <Row style={{ marginBottom: 20 }}>
                              <LineChart
                                 data={exchangeHistory}
                                 baseCurrency={baseCurrency}
                                 counterCurrency={counterCurrency}
                              />
                           </Row>
                           <Row>
                              <Row style={{ marginTop: 10 }}>
                                 {rippleApiConnected > 0 && publicAddress !== null ? (
                                    <Txs
                                       publicAddress={publicAddress}
                                       allTxs={allTxs}
                                       openOrders={this.props.openOrders}
                                       baseCurrency={baseCurrency}
                                       counterCurrency={counterCurrency}
                                       getTxs={address => this.props.getTxs(address)}
                                       getOrders={address => this.props.getOrders(address, { limit: 10 })}
                                       cancelOrder={tx => {
                                          console.log(tx);
                                          this.props.cancelOrder(publicAddress, {
                                             orderSequence: tx.properties.sequence
                                          });
                                       }}
                                    />
                                 ) : (
                                    <div style={{ color: COLORS.grey, fontSize: 11 }}>
                                       No Pending Transactions
                                    </div>
                                 )}
                              </Row>
                           </Row>
                        </Row>
                     </div>
                     <div style={{ minWidth: MIN_COL_WIDTH, maxWidth: MAX_COL_WIDTH, padding: '0 1px' }}>
                        <Title text={`Trade History`} />
                        <Row
                           className={'noScrollBar'}
                           style={{ height: winH, overflowY: 'auto', paddingBottom: 65 }}>
                           <OrderHistory
                              winH={winH}
                              allTxs={allTxs}
                              baseCurrency={baseCurrency}
                              counterCurrency={counterCurrency}
                           />
                        </Row>
                     </div>
                  </div>
               </Row>
            ) : (
               <Row id={'mobileLayout'}>
                  {/*MOBILE*/}
                  <Tabs defaultActiveKey="trade">
                     <TabPane tab="Trade" key="trade">
                        <Row
                           className={'noScrollBar'}
                           style={{
                              height: winH,
                              overflowY: 'auto',
                              paddingBottom: 65
                           }}>
                           {/*BALANCES*/}
                           <Title text={'Wallet Balance'} />
                           <Row style={{ color: '#ffffff', padding: 15 }}>
                              {gateways !== null &&
                              //this.props.balanceSheet !== null &&
                              accountInfo !== null ? (
                                 <Balances
                                    gateways={gateways}
                                    accountInfo={accountInfo}
                                    balanceSheet={balanceSheet}
                                    balances={balances}
                                    assetTotals={assetTotals}
                                 />
                              ) : (
                                 false
                              )}
                           </Row>

                           {/*TRADING UI - OFFERS/ASK*/}
                           <Row>
                              <TradingUI
                                 {...this.props}
                                 // prepareOrder={() =>
                                 //    this.props.prepareOrder(
                                 //       this.props.publicAddress,
                                 //       {
                                 //          direction: this.props.action,
                                 //          quantity: {
                                 //             currency: baseCurrency.value,
                                 //             value: baseAmount
                                 //          },
                                 //          totalPrice: {
                                 //             counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B', // Bitstamp
                                 //             currency: counterCurrency.value,
                                 //             value: (counterPrice * baseAmount).toString()
                                 //          }
                                 //       }
                                 //       {
                                 //          maxFee: 500,
                                 //          maxLedgerVersion: 100
                                 //       }
                                 //    )
                                 // }
                                 prepareOrder={() =>
                                    this.props.prepareOrder(
                                       this.props.publicAddress,
                                       {
                                          source: {
                                             address: this.props.publicAddress,
                                             maxAmount: {
                                                value: '1',
                                                currency: 'XRP'
                                             }
                                          },
                                          destination: {
                                             address: 'rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf',
                                             amount: {
                                                value: '1',
                                                currency: 'XRP'
                                             }
                                          }
                                       }
                                       // {
                                       //    maxFee: 500,
                                       //    maxLedgerVersion: 100
                                       // }
                                    )
                                 }
                              />
                           </Row>

                           <Row style={{ marginTop: 15 }}>
                              {rippleApiConnected > 0 && publicAddress !== null ? (
                                 <Txs
                                    publicAddress={publicAddress}
                                    allTxs={allTxs}
                                    openOrders={this.props.openOrders}
                                    baseCurrency={baseCurrency}
                                    counterCurrency={counterCurrency}
                                    getTxs={address => this.props.getTxs(address)}
                                    getOrders={address => this.props.getOrders(address, { limit: 10 })}
                                    cancelOrder={tx => {
                                       console.log(tx);
                                       this.props.cancelOrder(publicAddress, {
                                          orderSequence: tx.properties.sequence
                                       });
                                    }}
                                 />
                              ) : (
                                 <div style={{ color: COLORS.grey, fontSize: 11 }}>
                                    No Pending Transactions
                                 </div>
                              )}
                           </Row>
                        </Row>
                     </TabPane>
                     <TabPane tab="Order Book" key="book">
                        <Row>
                           {/*ORDER BOOK*/}
                           <Title text={'Order Book'} />
                           {/*TABLE HEADER*/}
                           <div
                              style={{
                                 display: 'flex',
                                 fontSize: 11,
                                 padding: '5px 15px',
                                 color: '#ffffff'
                              }}>
                              <div style={{ width: '20%' }}>&nbsp;</div>
                              <div style={{ width: '40%', marginRight: 10, textAlign: 'right' }}>
                                 Size ({baseCurrency.value})
                              </div>
                              <div style={{ width: '40%', textAlign: 'right' }}>
                                 Price ({counterCurrency.value})
                              </div>
                           </div>
                           {orderBook !== null ? (
                              <OrderBook
                                 winH={winH}
                                 orderBook={orderBook}
                                 action={action}
                                 updateFromOrder={order => this.props.updateFromOrder(order)}
                                 titleTextAlign={'center'}
                                 height={1000}
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
                        </Row>
                     </TabPane>
                     <TabPane tab="Chart" key="chart" forceRender>
                        <Row className={'noScrollBar'}>
                           <Title text={`${baseCurrency.value}/${counterCurrency.value} Price & Volume`} />
                           <Row style={{ marginBottom: 20 }}>
                              <LineChart
                                 data={exchangeHistory}
                                 baseCurrency={baseCurrency}
                                 counterCurrency={counterCurrency}
                              />
                           </Row>
                        </Row>
                     </TabPane>
                     <TabPane tab="History" key="history">
                        <OrderHistory />
                     </TabPane>
                  </Tabs>
               </Row>
            )}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      winH: state.xledg.winH, // window width
      winW: state.xledg.winW, // window height
      publicAddress: state.xledg.publicAddress,
      publicKey: state.xledg.publicKey,
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
      openOrders: state.xledg.openOrders,
      transportOpen: state.xledg.transportOpen
   };
};

const mapDispatchToProps = dispatch => {
   return {
      updateWindowDimensions: (width, height) => {
         dispatch(ReduxActions.updateWindowDimensions(width, height));
      },
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
      },
      openTransport: () => {
         dispatch(ReduxActions.openTransport());
      },
      getWalletAddress: () => {
         dispatch(ReduxActions.getWalletAddress());
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
