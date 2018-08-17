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
         xrpUpdated: false,
         assetsUpdated: []
      };
   }

   componentWillMount() {
      //this.updateBalances();
   }

   componentWillReceiveProps(nextProps) {
      // Check for change in XRP balance. Blink the text if there is
      if (nextProps.accountInfo.xrpBalance !== this.props.accountInfo.xrpBalance) {
         this.setState({
            xrpUpdated: true
         });
         setTimeout(
            function() {
               this.setState({
                  xrpUpdated: false
               });
            }.bind(this),
            1000
         );
      }

      let assetsUpdatedNew = [];
      // Check for change to issued asset balances. Blink the text if there is
      for (let key in this.props.assetTotals) {
         if (this.props.assetTotals[key] !== nextProps.assetTotals[key]) {
            // TODO
            assetsUpdatedNew.push(key);
         }
      }

      this.setState({
         assetsUpdated: assetsUpdatedNew
      });

      //this.updateBalances();
   }

   // updateBalances() {
   //    let groupedAssets = groupBy(this.props.balanceSheet.assets, 'currency');
   //    let totals = {};
   //
   //    for (let key in groupedAssets) {
   //       let total = 0;
   //       groupedAssets[key].map(asset => {
   //          total += parseFloat(asset.value, 10);
   //          return true;
   //       });
   //       //groupedAssets[key].total = CurrencyFormatter.format(total, { code: key });
   //       totals[key] = CurrencyFormatter.format(total, { code: key });
   //    }
   //
   //    this.setState({
   //       balances: groupedAssets,
   //       assetTotals: totals
   //    });
   // }

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
               <label className={this.state.xrpUpdated ? 'blinkText' : ''}>
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
   balanceSheet: PropTypes.object,
   assetTotals: PropTypes.object,
   updateTotals: PropTypes.func
};
