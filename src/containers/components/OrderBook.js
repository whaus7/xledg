import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { updateInput } from '../../services/helpers';
import COLORS from '../../services/colors';
import Order from './Order';

export default class OrderBook extends Component {
   constructor(props) {
      super(props);

      this.updateInput = updateInput.bind(this);
   }

   render() {
      const { orderBook, titleTextAlign, height } = this.props;

      const Orders = props => {
         let orderRows = [];

         props.orders.map((order, i) => {
            // console.log('order obj');
            // console.log(order);
            orderRows.push(
               <Order
                  key={`${props.type}_${i}`}
                  order={order}
                  updateFromOrder={order => this.props.updateFromOrder(order)}
               />
            );
            return true;
         });

         return orderRows;
      };

      return (
         <div
            style={{
               display: 'flex',
               color: COLORS.white,
               padding: 15,
               fontSize: 11
               //flexDirection: this.props.action === 'buy' ? 'row' : 'row-reverse'
            }}>
            <div
               style={{
                  width: '100%'
               }}>
               <h2
                  style={{
                     color: this.props.action === 'buy' ? COLORS.red : COLORS.white,
                     opacity: this.props.action === 'buy' ? 1 : 0.5,
                     textAlign: titleTextAlign
                  }}>
                  OFFERS TO SELL
               </h2>
               <div
                  className={'customScroll'}
                  style={{
                     maxHeight: height,
                     overflowY: 'scroll',
                     overflowX: 'hidden',
                     opacity: this.props.action === 'buy' ? 1 : 0.5
                  }}>
                  <Orders orders={orderBook.asks} type={'asks'} />
               </div>
            </div>
            <div
               style={{
                  width: '100%'
               }}>
               <h2
                  style={{
                     color: this.props.action === 'sell' ? COLORS.green : COLORS.white,
                     opacity: this.props.action === 'sell' ? 1 : 0.5,
                     textAlign: titleTextAlign
                  }}>
                  OFFERS TO BUY
               </h2>
               <div
                  className={'customScroll'}
                  style={{
                     maxHeight: height,
                     overflowY: 'scroll',
                     overflowX: 'hidden',
                     opacity: this.props.action === 'sell' ? 1 : 0.5
                  }}>
                  <Orders orders={orderBook.bids} type={'bids'} />
               </div>
            </div>
         </div>
      );
   }
}

OrderBook.propTypes = {
   orderBook: PropTypes.object,
   action: PropTypes.string,
   updateFromOrder: PropTypes.func,
   titleTextAlign: PropTypes.string,
   height: PropTypes.number
};
