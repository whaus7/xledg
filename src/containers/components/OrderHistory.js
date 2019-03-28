import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Row, Col } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Numeral from 'numeral';

import COLORS from '../../services/colors';

export default class OrderHistory extends Component {
   constructor(props) {
      super(props);
   }

   componentDidMount() {}

   render() {
      const { history } = this.props;

      return <Row>history</Row>;
   }
}
