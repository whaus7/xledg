import React, { Component } from 'react';
import PropTypes from 'prop-types';

import COLORS from '../../services/colors';

export default class Txs extends Component {
   constructor(props) {
      super(props);

      this.props.getTxs('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf');
      this.props.getOrders('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf');

      setInterval(
         function() {
            this.props.getTxs('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf');
         }.bind(this),
         1200000
      );
   }

   render() {
      const { allTxs, openOrders } = this.props;

      const Txs = () => {
         let completedTxsRows = [];

         allTxs.map((tx, i) => {
            if (
               'rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf' in tx.outcome.balanceChanges !== 'undefined' &&
               tx.outcome.balanceChanges.rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf.length === 1
            ) {
               console.log('UNSIGNED TX');
               console.log(tx);
            } else {
               completedTxsRows.push(
                  <div key={`completed_txs_${i}`} style={{ margin: '0 0 10px 0', lineHeight: '14px' }}>
                     <div style={{ width: '100%' }}>
                        {/*index debug*/}
                        {/*{i}.*/}
                        <span
                           style={{
                              color: tx.specification.direction === 'buy' ? COLORS.green : COLORS.red
                           }}>
                           {tx.specification.direction.toUpperCase()}
                        </span>{' '}
                        {parseFloat(tx.specification.quantity.value).toFixed(2)}
                        {tx.specification.quantity.currency}
                     </div>

                     <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: 8, marginRight: 7, position: 'relative', top: -1 }}>@</div>
                        <div style={{ width: 100 }}>
                           {parseFloat(
                              tx.specification.totalPrice.value / tx.specification.quantity.value
                           ).toFixed(6)}{' '}
                           {tx.specification.totalPrice.currency}
                        </div>
                     </div>
                  </div>
               );
            }
            return true;
         });

         return (
            <div>
               <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #383939' }}>
                  <h2>ORDER HISTORY</h2>
                  <div
                     className={'customScroll'}
                     style={{
                        maxHeight: 150,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                     }}>
                     {completedTxsRows}
                  </div>
               </div>
            </div>
         );
      };

      const OpenOrders = () => {
         let openOrdersRows = [];

         openOrders.map((tx, i) => {
            openOrdersRows.push(
               <div
                  key={`pending_txs_${i}`}
                  className={'btnHover'}
                  style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     margin: '0 0 10px 0',
                     opacity: 0.5
                  }}
                  onClick={() => this.props.cancelOrder(tx)}>
                  {/*ORDER*/}
                  <div style={{ lineHeight: '14px' }}>
                     <div style={{ width: '100%' }}>
                        {/*index debug*/}
                        {/*{i}.*/}
                        <span
                           style={{
                              color: tx.specification.direction === 'buy' ? COLORS.green : COLORS.red
                           }}>
                           {tx.specification.direction.toUpperCase()}
                        </span>{' '}
                        {parseFloat(tx.specification.quantity.value).toFixed(2)}
                        {tx.specification.quantity.currency}
                     </div>

                     <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ width: 8, marginRight: 7, position: 'relative', top: -1 }}>@</div>
                        <div style={{ width: 100 }}>
                           {parseFloat(
                              tx.specification.totalPrice.value / tx.specification.quantity.value
                           ).toFixed(6)}{' '}
                           {tx.specification.totalPrice.currency}
                        </div>
                     </div>
                  </div>
                  {/*CANCEL ICON*/}
                  <div
                     className={'btnHover'}
                     style={{
                        fontSize: 16,
                        padding: '0 5px'
                     }}>
                     x
                  </div>
               </div>
            );
            return true;
         });

         return (
            <div>
               <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid #383939' }}>
                  <h2>OPEN ORDERS</h2>
                  <div
                     className={'customScroll'}
                     style={{
                        //marginBottom: 25,
                        maxHeight: 150,
                        overflowY: 'scroll',
                        overflowX: 'hidden'
                     }}>
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
                  <OpenOrders />
               </div>
               <div>
                  <Txs />
               </div>
            </div>
         </div>
      );
   }
}

Txs.propTypes = {
   allTxs: PropTypes.array,
   openOrders: PropTypes.array,
   getTxs: PropTypes.func,
   getOrders: PropTypes.func,
   cancelOrder: PropTypes.func
};
