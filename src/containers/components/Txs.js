import React, { Component } from 'react';
import PropTypes from 'prop-types';

import COLORS from '../../services/colors';

export default class Txs extends Component {
   constructor(props) {
      super(props);

      this.props.getTxs('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf');

      // setInterval(
      //    function() {
      //       this.props.pendingTxs.map(tx => {
      //          // TODO hmm. how to update TX status nicely
      //          this.props.getTxStatus(tx.id);
      //       });
      //    }.bind(this),
      //    5000
      // );
   }

   // componentWillReceiveProps(nextProps) {
   //
   // }

   render() {
      const { allTxs } = this.props;

      const Txs = () => {
         let pendingTxsRows = [];
         let completedTxsRows = [];

         allTxs.map((tx, i) => {
            if (
               'rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf' in tx.outcome.balanceChanges !== 'undefined' &&
               tx.outcome.balanceChanges.rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf.length === 1
            ) {
               pendingTxsRows.push(
                  <div
                     className={'orderRow'}
                     key={`pendingTx_${i}`}
                     style={{ display: 'flex', margin: '3px 0' }}>
                     <div>{`${i}.`}</div>
                  </div>
               );
            } else {
               completedTxsRows.push(
                  <div
                     className={'orderRow'}
                     key={`completedTx_${i}`}
                     style={{ display: 'flex', margin: '3px 0' }}>
                     <div>{`${i}.`}</div>
                  </div>
               );
            }
            return true;
         });

         return (
            <div>
               <h2>PENDING ORDERS</h2>
               <div
                  className={'customScroll'}
                  style={{
                     marginBottom: 25,
                     maxHeight: 150,
                     overflowY: 'scroll',
                     overflowX: 'hidden'
                  }}>
                  {pendingTxsRows}
               </div>
               <h2>COMPLETED ORDERS</h2>
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
                  <Txs />
               </div>
            </div>
         </div>
      );
   }
}

Txs.propTypes = {
   //pendingTxs: PropTypes.array,
   getTxStatus: PropTypes.func,
   allTxs: PropTypes.array,
   getTxs: PropTypes.func
};
