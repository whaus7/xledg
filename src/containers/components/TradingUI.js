import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { materialTheme, importAll } from '../../services/helpers';
import COLORS from '../../services/colors';
import MAJOR_CURRENCIES from '../../services/major_currencies';
const CURRENCY_ICONS_BLACK = importAll(
   require.context('../../images/currency_icons/black', false, /\.(svg)$/)
);
const CURRENCY_ICONS_WHITE = importAll(
   require.context('../../images/currency_icons/white', false, /\.(svg)$/)
);

export default class TradingUI extends Component {
   render() {
      // OPTION - REACT-SELECT
      class CurrencyOption extends Component {
         handleMouseDown(event) {
            event.preventDefault();
            event.stopPropagation();
            this.props.onSelect(this.props.option, event);
         }

         handleMouseEnter(event) {
            this.props.onFocus(this.props.option, event);
         }

         handleMouseMove(event) {
            if (this.props.isFocused) return;
            this.props.onFocus(this.props.option, event);
         }

         render() {
            return (
               <div
                  className={this.props.className}
                  onMouseDown={this.handleMouseDown.bind(this)}
                  onMouseEnter={this.handleMouseEnter.bind(this)}
                  onMouseMove={this.handleMouseMove.bind(this)}
                  title={this.props.option.title}>
                  <div style={{ display: 'flex' }}>
                     <div style={{ alignSelf: 'center', marginRight: 10, height: 20 }}>
                        <img
                           src={CURRENCY_ICONS_BLACK[`${this.props.option.value}.svg`]}
                           style={{ maxWidth: 20, maxHeight: 20 }}
                           alt={`${this.props.option.value} Icon`}
                        />
                     </div>
                     <div
                        style={{
                           fontSize: 14,
                           minWidth: 40,
                           marginRight: 10,
                           alignSelf: 'center'
                        }}>
                        <span>{this.props.option.value}</span>
                        <span style={{ color: COLORS.grey }}> - {this.props.option.label}</span>
                     </div>
                  </div>
               </div>
            );
         }
      }

      CurrencyOption.propTypes = {
         children: PropTypes.node,
         className: PropTypes.string,
         isDisabled: PropTypes.bool,
         isFocused: PropTypes.bool,
         isSelected: PropTypes.bool,
         onFocus: PropTypes.func,
         onSelect: PropTypes.func,
         option: PropTypes.object.isRequired
      };

      // SELECTION - REACT-SELECT
      class CurrencyValue extends Component {
         render() {
            return (
               <div className="Select-value" title={this.props.value.title}>
                  <div style={{ display: 'flex', height: '100%' }}>
                     <img
                        src={CURRENCY_ICONS_WHITE[`${this.props.value.value}.svg`]}
                        style={{ maxWidth: 20, maxHeight: 20, alignSelf: 'center', marginRight: 10 }}
                        alt={`${this.props.value.value} Icon`}
                     />
                     <div style={{ fontSize: 14, marginRight: 10 }}>
                        <span>{this.props.value.value}</span>
                        <span style={{ color: COLORS.grey }}> - {this.props.value.label}</span>
                     </div>
                  </div>
               </div>
            );
         }
      }

      CurrencyValue.propTypes = {
         children: PropTypes.node,
         placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
         value: PropTypes.object
      };

      return (
         <MuiThemeProvider theme={materialTheme}>
            {/*BUY / SELL BUTTONS*/}
            <div style={{ display: 'flex', padding: 15 }}>
               <div
                  onClick={() => {
                     this.props.updateAction('buy');
                  }}
                  className={'btn'}
                  style={{
                     borderColor: this.props.action === 'buy' ? COLORS.green : COLORS.white,
                     opacity: this.props.action === 'buy' ? 1 : 0.5,
                     width: '100%',
                     marginRight: 10
                  }}>
                  BUY
               </div>
               <div
                  onClick={() => {
                     this.props.updateAction('sell');
                  }}
                  className={'btn'}
                  style={{
                     borderColor: this.props.action === 'sell' ? COLORS.red : COLORS.white,
                     opacity: this.props.action === 'sell' ? 1 : 0.5,
                     width: '100%'
                  }}>
                  SELL
               </div>
            </div>

            {/*OFFER (BASE) CONTAINER*/}
            <div style={{ display: 'flex', padding: '0 15px 15px 15px' }}>
               <div style={{ width: '100%', paddingRight: 15 }}>
                  <TextField
                     style={{
                        width: '100%',
                        marginBottom: 10
                     }}
                     id="offer-amount-input"
                     value={this.props.baseAmount}
                     onChange={e => {
                        this.props.updateBaseAmount(e.target.value);
                     }}
                     label="Amount"
                     type="number"
                     margin="none"
                     color="secondary"
                  />

                  <Select
                     onChange={val => {
                        this.props.updateBaseCurrency(val);
                     }}
                     value={this.props.baseCurrency}
                     optionComponent={CurrencyOption}
                     options={MAJOR_CURRENCIES}
                     placeholder={'Currency'}
                     valueComponent={CurrencyValue}
                  />
               </div>

               {/*@ SIGN*/}
               <div style={{ alignSelf: 'center', fontSize: 30, fontWeight: 100, color: COLORS.white }}>
                  @
               </div>

               {/*ASK (COUNTER) CONTAINER*/}
               <div style={{ width: '100%', paddingLeft: 15 }}>
                  <TextField
                     style={{
                        width: '100%',
                        marginBottom: 10
                     }}
                     id="offer-price-input"
                     value={this.props.counterPrice}
                     onChange={e => {
                        this.props.updateCounterPrice(e.target.value);
                     }}
                     label="Price"
                     type="number"
                     margin="none"
                     color="secondary"
                  />

                  <Select
                     onChange={val => {
                        this.props.updateCounterCurrency(val);
                     }}
                     value={this.props.counterCurrency}
                     optionComponent={CurrencyOption}
                     options={MAJOR_CURRENCIES}
                     placeholder={'Currency'}
                     valueComponent={CurrencyValue}
                  />
               </div>
            </div>

            <div style={{ display: 'flex', padding: 15 }}>
               <div
                  onClick={() => {
                     this.props.prepareOrder();
                  }}
                  className={'btn btnHover'}
                  style={{
                     opacity: 0.5,
                     borderColor: this.props.action === 'buy' ? COLORS.green : COLORS.red,
                     width: '100%'
                  }}>
                  {`PLACE ${this.props.action.toUpperCase()} ORDER`}
               </div>
            </div>
         </MuiThemeProvider>
      );
   }
}

TradingUI.propTypes = {
   action: PropTypes.string,
   updateAction: PropTypes.func,
   updateBaseAmount: PropTypes.func,
   updateBaseCurrency: PropTypes.func,
   updateCounterPrice: PropTypes.func,
   updateCounterCurrency: PropTypes.func,
   prepareOrder: PropTypes.func
};
