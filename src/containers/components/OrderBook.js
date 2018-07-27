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

   getOrderBook() {}

   // onSelectChange(value) {
   //    this.setState({ offerCurrency: value });
   // }

   //(1.00000000*orderbook.asks[i].specification.totalPrice.value)/(1.00000000*orderbook.asks[i].specification.quantity.value);

   // orders(type) {
   //    type.map(order => {
   //       return order.specification.totalPrice.value / order.specification.quantity.value;
   //    });
   // }

   render() {
      const { orderBook } = this.props;

      const Orders = props => {
         let orderRows = [];

         props.orders.map((order, i) => {
            orderRows.push(
               <div key={`${props.type}_${i}`}>
                  {parseFloat(order.specification.totalPrice.value / order.specification.quantity.value).toFixed(4)}
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
               padding: 15
            }}>
            <div
               style={{
                  width: '100%',
                  paddingRight: 10
               }}>
               <h2>ASKS</h2>
               <Orders orders={orderBook.asks} type={'asks'} />
            </div>
            <div
               style={{
                  width: '100%',
                  paddingLeft: 10
               }}>
               <h2>BIDS</h2>
               <Orders orders={orderBook.bids} type={'bids'} />
            </div>
         </div>
      );
   }
}

OrderBook.propTypes = {
   orderBook: PropTypes.object
};
