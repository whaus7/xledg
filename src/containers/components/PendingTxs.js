import React, { Component } from 'react';
import PropTypes from 'prop-types';

import COLORS from '../../services/colors';

export default class PendingTxs extends Component {
   constructor(props) {
      super(props);

      this.state = {
         txsStatus: this.props.pendingTxs
      };

      setInterval(function() {
         this.props.pendingTxs.map(tx => {
            // TODO hmm. how to update TX status nicely
         });
      }, 3000);
   }

   // componentWillReceiveProps(nextProps) {
   //
   // }

   render() {
      const { pendingTxs } = this.props;

      const PendingTxs = () => {
         let pendingTxsRows = [];

         pendingTxs.map((order, i) => {
            pendingTxsRows.push(
               <div
                  className={'orderRow'}
                  key={`pendingTx_${i}`}
                  style={{ display: 'flex', margin: '3px 0' }}>
                  <div>{`${i}.`}</div>
               </div>
            );
            return true;
         });

         return pendingTxsRows;
      };

      return (
         <div
            style={{
               display: 'flex',
               color: COLORS.white,
               padding: 15,
               fontSize: 12
            }}>
            <div
               style={{
                  width: '100%'
               }}>
               {/*<h2*/}
               {/*style={{*/}
               {/*color: COLORS.white*/}
               {/*}}>*/}
               {/*PENDING ORDERS*/}
               {/*</h2>*/}
               <div>
                  <PendingTxs />
               </div>
            </div>
         </div>
      );
   }
}

PendingTxs.propTypes = {
   pendingTxs: PropTypes.array,
   getTxStatus: PropTypes.func
};
