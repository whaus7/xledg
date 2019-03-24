import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

import { updateInput } from '../../services/helpers';
import COLORS from '../../services/colors';
import Order from './Order';

export default class OrderBook extends Component {
   constructor(props) {
      super(props);

      this.orderBookWrap = React.createRef();

      this.updateInput = updateInput.bind(this);
   }

   componentDidMount() {
      // TODO how to set scroll position..
      // if (this.orderBookWrap !== null) {
      //    this.orderBookWrap.scrollTop = 1000;
      // }
      let el = document.querySelector('#orderBookWrap');
      console.log('orderBookWrap height');
      console.log(el.offsetHeight);
      console.log('Screen height');
      console.log(this.props.winH);
      el.scrollTop = 1000 - this.props.winH * 0.4;
      //el.scrollTop = 1000;
   }

   render() {
      const { orderBook, titleTextAlign, height } = this.props;

      const Orders = props => {
         let orderRows = [];
         //console.log(props.orders);

         // Sort the order book by best offers/asks
         let sortedOrders = props.orders.sort(function(a, b) {
            let d1 = a.specification.totalPrice.value / a.specification.quantity.value;
            let d2 = b.specification.totalPrice.value / b.specification.quantity.value;
            return d2 - d1;
         });

         sortedOrders.map((order, i) => {
            orderRows.push(
               <Order
                  type={props.type}
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
            id={'orderBookWrap'}
            ref={this.orderBookWrap}
            className={'noScrollBar'}
            style={{
               height: this.props.winH,
               overflowY: 'auto',
               color: COLORS.white,
               padding: 15,
               fontSize: 11,
               paddingBottom: 65
            }}>
            <Row
               style={{
                  width: '100%'
               }}>
               <div
                  style={{
                     display: 'flex',
                     color: COLORS.red,
                     height: 1000
                  }}>
                  <Row style={{ alignSelf: 'flex-end', width: '100%' }}>
                     <Orders orders={orderBook.asks.reverse()} type={'asks'} />
                  </Row>
               </div>
            </Row>
            <Row>Spread</Row>
            <Row
               style={{
                  width: '100%'
               }}>
               <div
                  style={{
                     color: COLORS.green,
                     height: 1000
                  }}>
                  <Orders orders={orderBook.bids} type={'bids'} />
               </div>
            </Row>
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
