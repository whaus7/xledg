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

   render() {
      const { accountInfo, gateways, balanceSheet } = this.props;

      return <div>Order Book Here</div>;
   }
}

OrderBook.propTypes = {};
