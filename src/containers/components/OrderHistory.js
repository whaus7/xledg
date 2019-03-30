import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import moment from 'moment';
import { Row, Col } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Numeral from 'numeral';

import COLORS from '../../services/colors';
import AmountBar from '../ui/AmountBar';
import Number from '../ui/Number';

export default class OrderHistory extends Component {
   constructor(props) {
      super(props);
   }

   componentDidMount() {}

   render() {
      const { allTxs, counterCurrency, baseCurrency } = this.props;

      return (
         <Row className={'tightTable'} style={{ color: '#ffffff', fontSize: 11 }}>
            <ReactTable
               //filterable
               // defaultFilterMethod={(filter, row) =>
               // 	row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
               // }
               defaultSorted={[
                  {
                     id: 'filename',
                     desc: false
                  }
               ]}
               data={allTxs}
               columns={[
                  // {
                  // 	Header: '',
                  // 	id: 'bar',
                  // 	accessor: row => row.specification.direction,
                  // 	Cell: row => (
                  // 		<span
                  // 			style={{
                  // 				color: row.value === 'buy' ? COLORS.green : COLORS.red
                  // 			}}>
                  //         {row.value.toUpperCase()}
                  //      </span>
                  // 	)
                  // },
                  {
                     Header: '',
                     id: 'amount_bar',
                     maxWidth: 30,
                     accessor: row => row.specification,
                     Cell: row => (
                        <AmountBar
                           val={row.value.quantity.value}
                           color={row.value.direction === 'buy' ? COLORS.green : COLORS.red}
                        />
                     )
                  },
                  {
                     Header: `Size (${baseCurrency.value})`,
                     id: 'size',
                     maxWidth: 80,
                     style: {
                        textAlign: 'right'
                     },
                     accessor: row => row.specification,
                     Cell: row => <Number val={row.value.quantity.value} type={row.value.quantity.currency} />
                  },
                  {
                     Header: `Price (${counterCurrency.value})`,
                     id: 'price',
                     maxWidth: 80,
                     accessor: row => row.specification,
                     Cell: row => (
                        <Number
                           val={row.value.totalPrice.value / row.value.quantity.value}
                           type={row.value.quantity.currency}
                        />
                     )
                  },
                  {
                     Header: `Time`,
                     id: 'time',
                     maxWidth: 80,
                     // style: {
                     // 	textAlign: 'right'
                     // },
                     accessor: row => row.outcome.timestamp,
                     Cell: row => moment(row.value).fromNow(true)
                  }
               ]}
               showPagination={false}
               defaultPageSize={300}
               style={{
                  height: this.props.winH - 60
               }}
               noDataText={'Loading Trade History..'}
               minRows={2}
               className="-highlight"
            />
         </Row>
      );
   }
}
