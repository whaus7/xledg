import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import CurrencyFormatter from 'currency-formatter';

import xrpIcon from '../../images/xrp-icon.svg';

export default class Balances extends Component {
   constructor(props) {
      super(props);

      this.state = {
         assetsUpdated: {}
      };
   }

   componentWillReceiveProps(nextProps) {
      let assetsUpdatedNew = { ...this.state.assetsUpdated };

      // Check for change in XRP balance. Blink the text if there is
      if (nextProps.accountInfo.xrpBalance !== this.props.accountInfo.xrpBalance) {
         if (this.props.accountInfo.xrpBalance < nextProps.accountInfo.xrpBalance) {
            assetsUpdatedNew['XRP'] = 'buy';
         } else if (this.props.accountInfo.xrpBalance > nextProps.accountInfo.xrpBalance) {
            assetsUpdatedNew['XRP'] = 'sell';
         }

         setTimeout(
            function() {
               this.setState({
                  assetsUpdated: {}
               });
            }.bind(this),
            1000
         );
      }

      // Check for change to issued asset balances. Blink the text if there is
      for (let key in this.props.assetTotals) {
         if (this.props.assetTotals[key].value < nextProps.assetTotals[key].value) {
            assetsUpdatedNew[key] = 'buy';
         } else if (this.props.assetTotals[key].value > nextProps.assetTotals[key].value) {
            assetsUpdatedNew[key] = 'sell';
         }
      }

      this.setState({
         assetsUpdated: assetsUpdatedNew
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

   checkForUpdate(key) {
      if (key in this.state.assetsUpdated) {
         if (this.state.assetsUpdated[key] === 'buy') {
            return 'blinkTextGreen';
         } else if (this.state.assetsUpdated[key] === 'sell') {
            return 'blinkTextRed';
         }
      } else {
         return '';
      }
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

         for (let key in this.props.assetTotals) {
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
                     <label className={this.checkForUpdate(key)}>
                        {this.props.assetTotals[key].formatted}
                     </label>
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
               <label className={this.checkForUpdate('XRP')}>
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
   assetTotals: PropTypes.object
};
