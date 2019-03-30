import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Numeral from 'numeral';
import COLORS from '../../services/colors';
import AmountBar from '../ui/AmountBar';
import Number from '../ui/Number';

export default class Order extends Component {
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
               <AmountBar val={orderQuantity.value} color={type === 'asks' ? COLORS.red : COLORS.green} />
            </div>

            {/*SIZE*/}
            <div
               style={{ width: '40%', marginRight: 10, textAlign: 'right', color: '#ffffff', opacity: 0.9 }}>
               <Number val={orderQuantity.value} type={orderQuantity.currency} />
            </div>

            {/*PRICE*/}
            <div style={{ width: '40%', textAlign: 'right' }}>
               <Number
                  val={order.specification.totalPrice.value / orderQuantity.value}
                  type={order.specification.totalPrice.currency}
               />
               {/*{this.formatZeros(*/}
               {/*Numeral(order.specification.totalPrice.value / orderQuantity.value).format(*/}
               {/*order.specification.totalPrice.currency === 'BTC' ? '0,0.000000' : '0,0.0000'*/}
               {/*)*/}
               {/*)}{' '}*/}
            </div>
         </div>
      );
   }
}

Order.propTypes = {
   order: PropTypes.object,
   updateFromOrder: PropTypes.func
};
