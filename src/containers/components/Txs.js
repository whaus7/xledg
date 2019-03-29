import React, { Component } from 'react';
import PropTypes from 'prop-types';

import COLORS from '../../services/colors';
import Title from '../ui/Title';
import Order from './Order';
import AmountBar from '../ui/AmountBar';
import Number from '../ui/Number';

export default class Txs extends Component {
   constructor(props) {
      super(props);

      this.props.getTxs(props.publicAddress);
      this.props.getOrders(props.publicAddress);

      setInterval(
         function() {
            this.props.getTxs(props.publicAddress);
         }.bind(this),
         1200000
      );
   }

   render() {
      const { publicAddress, allTxs, openOrders, baseCurrency, counterCurrency } = this.props;

      // console.log('openOrders');
      // console.log(openOrders);
      console.log('allTxs');
      console.log(allTxs);

      const Txs = () => {
         let completedTxsRows = [];

         allTxs.map((tx, i) => {
            if (
               publicAddress in tx.outcome.orderbookChanges &&
               tx.outcome.orderbookChanges[publicAddress][0].status === 'filled'
            ) {
               // console.log('filled tx');
               // console.log(tx);
               let txChanges = tx.outcome.orderbookChanges[publicAddress][0];

               completedTxsRows.push(
                  <div key={`completed_txs_${i}`} style={{ display: 'flex', width: '100%', margin: '1px 0' }}>
                     {/*AMOUNT BAR*/}
                     <div style={{ width: '20%' }}>
                        <AmountBar
                           val={txChanges.quantity.value}
                           color={txChanges.direction === 'buy' ? COLORS.green : COLORS.red}
                        />
                     </div>

                     {/*BUY/SELL SIDE*/}
                     <div
                        style={{
                           width: '20%'
                        }}>
                        <span
                           style={{
                              color: txChanges.direction === 'buy' ? COLORS.green : COLORS.red
                           }}>
                           {txChanges.direction.toUpperCase()}
                        </span>
                     </div>

                     {/*AMOUNT*/}
                     <div
                        style={{
                           width: '30%'
                        }}>
                        <Number val={txChanges.quantity.value} type={txChanges.quantity.currency} />
                     </div>

                     {/*TOTAL PRICE*/}
                     <div
                        style={{
                           width: '30%'
                        }}>
                        <Number
                           val={parseFloat(txChanges.totalPrice.value) / parseFloat(txChanges.quantity.value)}
                           type={txChanges.totalPrice.currency}
                        />
                     </div>

                     {/*<div style={{ width: '100%' }}>*/}
                     {/*/!*index debug*!/*/}
                     {/*/!*{i}.*!/*/}
                     {/*<span*/}
                     {/*style={{*/}
                     {/*color: txChanges.direction === 'buy' ? COLORS.green : COLORS.red*/}
                     {/*}}>*/}
                     {/*{txChanges.direction.toUpperCase()}*/}
                     {/*</span>{' '}*/}
                     {/*{parseFloat(txChanges.quantity.value).toFixed(2)}*/}
                     {/*{txChanges.quantity.currency}*/}
                     {/*</div>*/}

                     {/*<div style={{ display: 'flex', width: '100%' }}>*/}
                     {/*<div style={{ width: 8, marginRight: 7, position: 'relative', top: -1 }}>@</div>*/}
                     {/*<div style={{ width: 100 }}>*/}
                     {/*{(*/}
                     {/*parseFloat(txChanges.totalPrice.value) / parseFloat(txChanges.quantity.value)*/}
                     {/*).toFixed(6)}{' '}*/}
                     {/*{txChanges.totalPrice.currency}*/}
                     {/*</div>*/}
                     {/*</div>*/}
                  </div>
               );
            }
            return true;
         });

         return (
            <div>
               <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #383939' }}>
                  {/*FILLED ORDERS TABLE HEADER*/}
                  <div style={{ display: 'flex', fontSize: 11, margin: '5px 0', color: '#ffffff' }}>
                     <div style={{ width: '20%' }}>&nbsp;</div>
                     <div style={{ width: '20%' }}>Side</div>
                     <div style={{ width: '40%', marginRight: 20, textAlign: 'right' }}>
                        Size ({baseCurrency.value})
                     </div>
                     <div style={{ width: '40%' }}>Price ({counterCurrency.value})</div>
                  </div>
                  <div
                     className={'customScroll'}
                     style={{
                        maxHeight: 250,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                     }}>
                     {completedTxsRows.length === 0 ? (
                        <div style={{ color: COLORS.grey, fontSize: 11 }}>
                           This wallet has no filled orders
                        </div>
                     ) : (
                        completedTxsRows
                     )}
                  </div>
               </div>
            </div>
         );
      };

      const OpenOrders = () => {
         let openOrdersRows = [];

         openOrders.map((tx, i) => {
            let direction = tx.specification.direction;
            let amount = tx.specification.quantity;
            let total = tx.specification.totalPrice;

            openOrdersRows.push(
               <div
                  key={`pending_txs_${i}`}
                  //className={'btnHover'}
                  style={{
                     display: 'flex',
                     //justifyContent: 'space-between',
                     margin: '1px 0'
                  }}
                  onClick={() => this.props.cancelOrder(tx)}>
                  {/*AMOUNT BAR*/}
                  <div style={{ width: '20%' }}>
                     <AmountBar val={amount.value} color={direction === 'buy' ? COLORS.green : COLORS.red} />
                  </div>

                  {/*BUY/SELL SIDE*/}
                  <div
                     style={{
                        width: '10%'
                     }}>
                     <span
                        style={{
                           color: direction === 'buy' ? COLORS.green : COLORS.red
                        }}>
                        {direction.toUpperCase()}
                     </span>
                  </div>

                  {/*AMOUNT*/}
                  <div
                     style={{
                        width: '30%'
                     }}>
                     <Number val={amount.value} type={amount.currency} />
                  </div>

                  {/*TOTAL PRICE*/}
                  <div
                     style={{
                        width: '30%'
                     }}>
                     <Number val={total.value / amount.value} type={total.currency} />
                  </div>

                  {/*ACTION*/}
                  <div
                     style={{
                        width: '10%'
                     }}>
                     <div
                        className={'btnHover'}
                        style={{
                           fontSize: 16,
                           padding: '0 5px'
                        }}>
                        x
                     </div>
                  </div>

                  {/*<div style={{ lineHeight: '14px' }}>*/}
                  {/*<div style={{ width: '100%' }}>*/}
                  {/*/!*index debug*!/*/}
                  {/*/!*{i}.*!/*/}
                  {/*<span*/}
                  {/*style={{*/}
                  {/*color: tx.specification.direction === 'buy' ? COLORS.green : COLORS.red*/}
                  {/*}}>*/}
                  {/*{tx.specification.direction.toUpperCase()}*/}
                  {/*</span>{' '}*/}
                  {/*{parseFloat(tx.specification.quantity.value).toFixed(2)}*/}
                  {/*{tx.specification.quantity.currency}*/}
                  {/*</div>*/}

                  {/*<div style={{ display: 'flex', width: '100%' }}>*/}
                  {/*<div style={{ width: 8, marginRight: 7, position: 'relative', top: -1 }}>@</div>*/}
                  {/*<div style={{ width: 100 }}>*/}
                  {/*{parseFloat(*/}
                  {/*tx.specification.totalPrice.value / tx.specification.quantity.value*/}
                  {/*).toFixed(6)}{' '}*/}
                  {/*{tx.specification.totalPrice.currency}*/}
                  {/*</div>*/}
                  {/*</div>*/}
                  {/*</div>*/}

                  {/*CANCEL ICON*/}
                  {/*<div*/}
                  {/*className={'btnHover'}*/}
                  {/*style={{*/}
                  {/*fontSize: 16,*/}
                  {/*padding: '0 5px'*/}
                  {/*}}>*/}
                  {/*x*/}
                  {/*</div>*/}
               </div>
            );
            return true;
         });

         return (
            <div>
               <div style={{ marginBottom: 20 }}>
                  {/*<h2>OPEN ORDERS</h2>*/}
                  <div
                     className={'customScroll'}
                     style={{
                        //marginBottom: 25,
                        maxHeight: 150,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                     }}>
                     {/*OPEN ORDERS TABLE HEADER*/}
                     <div style={{ display: 'flex', fontSize: 11, margin: '5px 0', color: '#ffffff' }}>
                        <div style={{ width: '20%' }}>&nbsp;</div>
                        <div style={{ width: '10%' }}>Side</div>
                        <div style={{ width: '30%', marginRight: 20, textAlign: 'right' }}>
                           Size ({baseCurrency.value})
                        </div>
                        <div style={{ width: '30%' }}>Price ({counterCurrency.value})</div>
                        <div style={{ width: '10%' }}>&nbsp;</div>
                     </div>

                     {openOrdersRows.length === 0 ? (
                        <div style={{ color: COLORS.grey, fontSize: 11 }}>No Open Orders</div>
                     ) : (
                        openOrdersRows
                     )}
                  </div>
               </div>
            </div>
         );
      };

      return (
         <div
            style={{
               display: 'flex',
               color: COLORS.white,
               fontSize: 12
            }}>
            <div
               style={{
                  width: '100%'
               }}>
               <div>
                  <Title text={`Open Orders`} />
                  <OpenOrders />
               </div>
               <div>
                  <Title text={`Filled Orders`} />
                  <Txs />
               </div>
            </div>
         </div>
      );
   }
}

Txs.propTypes = {
   publicAddress: PropTypes.string,
   allTxs: PropTypes.array,
   openOrders: PropTypes.array,
   getTxs: PropTypes.func,
   getOrders: PropTypes.func,
   cancelOrder: PropTypes.func
};
