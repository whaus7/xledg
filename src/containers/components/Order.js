import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Numeral from 'numeral';

export default class Order extends Component {
   render() {
      const { order } = this.props;

      return (
         <div
            className={'orderRow'}
            style={{ display: 'flex', margin: '1px 0' }}
            onClick={() => this.props.updateFromOrder(order)}>
            <div style={{ width: 75, marginRight: 7, textAlign: 'right' }}>
               {Numeral(order.specification.quantity.value).format(
                  order.specification.quantity.currency === 'BTC' ? '0,0.0000' : '0,0.00'
               )}
            </div>
            <div style={{ width: 30 }}>{order.specification.quantity.currency}</div>
            <div style={{ width: 10, marginRight: 7, position: 'relative', top: -1 }}>@</div>
            <div style={{ width: 100 }}>
               {Numeral(order.specification.totalPrice.value / order.specification.quantity.value).format(
                  order.specification.totalPrice.currency === 'BTC' ? '0,0.000000' : '0,0.0000'
               )}{' '}
               {order.specification.totalPrice.currency}
            </div>
         </div>
      );
   }
}

Order.propTypes = {
   order: PropTypes.object,
   updateFromOrder: PropTypes.func
};
