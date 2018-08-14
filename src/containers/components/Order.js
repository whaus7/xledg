import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Order extends Component {
   render() {
      const { order } = this.props;

      return (
         <div
            className={'orderRow'}
            style={{ display: 'flex', margin: '3px 0' }}
            onClick={() => this.props.updateFromOrder(order)}>
            <div style={{ width: 75, marginRight: 7, textAlign: 'right' }}>
               {parseFloat(order.specification.quantity.value).toFixed(2)}
            </div>
            <div style={{ width: 30 }}>{order.specification.quantity.currency}</div>
            <div style={{ width: 10, marginRight: 7, position: 'relative', top: -1 }}>@</div>
            <div style={{ width: 100 }}>
               {parseFloat(order.specification.totalPrice.value / order.specification.quantity.value).toFixed(
                  6
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
