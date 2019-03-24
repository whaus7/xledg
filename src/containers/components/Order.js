import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Numeral from 'numeral';
import COLORS from '../../services/colors';

export default class Order extends Component {
   formatZeros(num) {
      let numSplit = num.toString().split('.');

      return (
         <span>
            <span style={{ opacity: numSplit[0] === '0' ? 0.4 : 1 }}>{numSplit[0]}</span>.
            <span style={{ opacity: numSplit[1] === '00' ? 0.4 : 1 }}>{numSplit[1]}</span>
         </span>
      );
   }

   render() {
      const { order, type, category } = this.props;

      let orderQuantity = order.specification.quantity;

      return (
         <div
            className={'orderRow'}
            style={{ display: 'flex', width: '100%', margin: '1px 0' }}
            onClick={() => {
               if (category === 'book') {
                  this.props.updateFromOrder(order);
               }
            }}>
            {/*AMOUNT BAR*/}
            <div style={{ width: '20%' }}>
               <div
                  style={{
                     width: Math.log10(orderQuantity.value < 1 ? 1 : orderQuantity.value) * 10,
                     height: 15,
                     background: type === 'asks' ? COLORS.red : COLORS.green,
                     opacity: 0.4
                  }}
               />
            </div>

            {/*SIZE*/}
            <div
               style={{ width: '40%', marginRight: 20, textAlign: 'right', color: '#ffffff', opacity: 0.9 }}>
               {this.formatZeros(
                  Numeral(orderQuantity.value).format(
                     orderQuantity.currency === 'BTC' ? '0,0.0000' : '0,0.00'
                  )
               )}
            </div>

            {/*PRICE*/}
            <div style={{ width: '40%' }}>
               {this.formatZeros(
                  Numeral(order.specification.totalPrice.value / orderQuantity.value).format(
                     order.specification.totalPrice.currency === 'BTC' ? '0,0.000000' : '0,0.0000'
                  )
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
