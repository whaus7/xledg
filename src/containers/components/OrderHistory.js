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
      const { allTxs } = this.props;

      return (
         <Row>
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
                     Header: 'Side',
                     id: 'side',
                     accessor: row => row.specification.direction,
                     Cell: row => (
                        <span
                           style={{
                              color: row.value === 'buy' ? COLORS.green : COLORS.red
                           }}>
                           {row.value.toUpperCase()}
                        </span>
                     )
                  }
               ]}
               showPagination={false}
               defaultPageSize={300}
               noDataText={'Loading Trade History..'}
               minRows={2}
               className="-highlight"
            />
         </Row>
      );
   }
}
