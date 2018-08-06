import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import CurrencyFormatter from 'currency-formatter';

import { groupBy } from '../../services/helpers';
import xrpIcon from '../../images/xrp-icon.svg';

export default class Balances extends Component {
   constructor(props) {
      super(props);

      this.state = {
         balances: null
      };
   }

   componentWillMount() {
      this.updateBalances();
   }

   componentWillReceiveProps() {
      this.updateBalances();
   }

   updateBalances() {
      let groupedAssets = groupBy(this.props.balanceSheet.assets, 'currency');

      for (let key in groupedAssets) {
         let total = 0;
         groupedAssets[key].map(asset => {
            total += parseFloat(asset.value, 10);
            return true;
         });
         groupedAssets[key].total = CurrencyFormatter.format(total, { code: key });
      }

      this.setState({
         balances: groupedAssets
      });
   }

   getIssuerName(counterparty, currency) {
      let name = 'N/A';
      this.props.gateways[currency].map(gateway => {
         if (gateway.account === counterparty) {
            name = gateway.name;
         }
         return true;
      });
      return name;
   }

   render() {
      const { accountInfo, balanceSheet } = this.props;

      const Issuers = props => {
         let issuerRows = [];

         balanceSheet.assets.map(asset => {
            if (props.currency === asset.currency) {
               issuerRows.push(
                  <div
                     key={`issuer-${asset.counterparty}`}
                     style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                     <label>{this.getIssuerName(asset.counterparty, props.currency)}</label>
                     <label>
                        {CurrencyFormatter.format(parseFloat(asset.value).toFixed(2), {
                           code: asset.currency
                        })}
                     </label>
                  </div>
               );
            }
            return true;
         });

         return issuerRows;
      };

      const Balances = () => {
         let balanceRows = [];

         for (let key in this.state.balances) {
            balanceRows.push(
               <OverlayTrigger
                  key={`${key}-balance`}
                  trigger={['hover', 'focus']}
                  placement="right"
                  overlay={
                     <Popover id="asset-breakdown" title="Backed By">
                        <Issuers currency={key} />
                     </Popover>
                  }>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                     <label>{key}</label>
                     <label>{this.state.balances[key].total}</label>
                  </div>
               </OverlayTrigger>
            );
         }

         return balanceRows;
      };

      return (
         <div>
            {/*XRP balanec*/}
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
               <label>XRP</label>
               <label>
                  <img
                     src={xrpIcon}
                     style={{ maxWidth: 12, maxHeight: 12, marginRight: 1 }}
                     alt={'XRP Icon'}
                  />
                  {parseFloat(accountInfo.xrpBalance).toFixed(2)}
               </label>
            </div>
            {/*ALL IOU BALANCES*/}
            {this.state.balances !== null ? <Balances /> : false}
         </div>
      );
   }
}

Balances.propTypes = {
   gateways: PropTypes.object,
   accountInfo: PropTypes.object,
   balanceSheet: PropTypes.object
};
