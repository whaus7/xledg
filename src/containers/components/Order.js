import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Numeral from 'numeral';
import COLORS from '../../services/colors';

export default class Order extends Component {
   render() {
      const { order, type } = this.props;

      let orderQuantity = order.specification.quantity;

      return (
         <div
            className={'orderRow'}
            style={{ display: 'flex', margin: '1px 0' }}
            onClick={() => this.props.updateFromOrder(order)}>
            <div style={{ width: '20%' }}>
               <div
                  style={{
                     width: Math.log10(orderQuantity.value < 1 ? 1 : orderQuantity.value) * 6,
                     height: 15,
                     background: type === 'asks' ? COLORS.red : COLORS.green,
                     opacity: 0.4
                  }}
               />
            </div>
            <div style={{ width: '40%', marginRight: 20, textAlign: 'right' }}>
               {Numeral(orderQuantity.value).format(orderQuantity.currency === 'BTC' ? '0,0.0000' : '0,0.00')}
            </div>
            <div style={{ width: '40%' }}>
               {Numeral(order.specification.totalPrice.value / orderQuantity.value).format(
                  order.specification.totalPrice.currency === 'BTC' ? '0,0.000000' : '0,0.0000'
               )}{' '}
            </div>
         </div>
      );
   }
}

Order.propTypes = {
   order: PropTypes.object,
   updateFromOrder: PropTypes.func
};
