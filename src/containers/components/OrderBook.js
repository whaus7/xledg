import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { OverlayTrigger, Popover } from 'react-bootstrap';
import { materialTheme, updateInput, importAll } from '../../services/helpers';

export default class OrderBook extends Component {
   constructor(props) {
      super(props);

      this.state = {};

      this.updateInput = updateInput.bind(this);
   }

   componentDidMount() {
      // console.log('images');
      // console.log(CURRENCY_ICONS);
   }

   componentWillMount() {}

   componentWillReceiveProps() {}

   render() {
      const { orderBook } = this.props;

      const Orders = props => {
         let orderRows = [];

         props.orders.map((order, i) => {
            orderRows.push(
               <div key={`${props.type}_${i}`} style={{ display: 'flex', margin: '3px 0' }}>
                  <div style={{ width: 75, marginRight: 7, textAlign: 'right' }}>
                     {parseFloat(order.specification.quantity.value).toFixed(2)}
                  </div>
                  <div style={{ width: 30 }}>{order.specification.quantity.currency}</div>
                  <div style={{ width: 10, marginRight: 7, position: 'relative', top: -1 }}>@</div>
                  <div style={{ width: 100 }}>
                     {parseFloat(order.specification.totalPrice.value / order.specification.quantity.value).toFixed(4)}{' '}
                     {order.specification.totalPrice.currency}
                  </div>
               </div>
            );
         });

         return orderRows;
      };

      return (
         <div
            style={{
               display: 'flex',
               color: '#ffffff',
               padding: 15,
               fontSize: 12
            }}>
            <div
               style={{
                  width: '100%',
                  paddingLeft: 10
               }}>
               <h2>OFFERS TO BUY</h2>
               <Orders orders={orderBook.bids} type={'bids'} />
            </div>
            <div
               style={{
                  width: '100%',
                  paddingRight: 10
               }}>
               <h2>OFFERS TO SELL</h2>
               <Orders orders={orderBook.asks} type={'asks'} />
            </div>
         </div>
      );
   }
}

OrderBook.propTypes = {
   orderBook: PropTypes.object
};
