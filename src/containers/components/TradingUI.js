import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { OverlayTrigger, Popover } from 'react-bootstrap';
import { materialTheme, updateInput, importAll } from '../../services/helpers';

import MAJOR_CURRENCIES from '../../services/major_currencies';
const CURRENCY_ICONS = importAll(require.context('../../images/currency_icons', false, /\.(svg)$/));

export default class TradingUI extends Component {
   constructor(props) {
      super(props);

      this.state = {
         action: 'buy',
         offerAmountInput: '',
         offerCurrency: ''
      };

      this.updateInput = updateInput.bind(this);
   }

   componentDidMount() {
      console.log('images');
      console.log(CURRENCY_ICONS);
   }

   componentWillMount() {}

   componentWillReceiveProps() {}

   // onSelectChange(value) {
   //    this.setState({ offerCurrency: value });
   // }

   render() {
      const { accountInfo, gateways, balanceSheet } = this.props;

      // OPTION
      class CurrencyOption extends Component {
         constructor(props) {
            super(props);
         }

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
                     <div style={{ alignSelf: 'center', marginRight: 10 }}>
                        <img
                           src={CURRENCY_ICONS[`${this.props.option.value}.svg`]}
                           style={{ maxWidth: 25, maxHeight: 25 }}
                        />
                     </div>
                     <div style={{ marginRight: 10, lineHeight: '18px' }}>
                        <div style={{ marginRight: 10 }}>{this.props.option.value}</div>
                        <div style={{ fontSize: 12, color: '#bdc3c7' }}>{this.props.option.label}</div>
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

      // SELECTION
      class CurrencyValue extends Component {
         constructor(props) {
            super(props);
         }

         render() {
            return (
               <div className="Select-value" title={this.props.value.title}>
                  <span className="Select-value-label" style={{ color: '#ffffff', opacity: 1 }}>
                     {this.props.value.title}
                     {this.props.children}
                  </span>
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
                     this.setState({ action: 'buy' });
                  }}
                  className={'btn'}
                  style={{
                     borderColor: this.state.action === 'buy' ? '#21c2f8' : '#ffffff',
                     opacity: this.state.action === 'buy' ? 1 : 0.5,
                     width: '100%',
                     marginRight: 10
                  }}>
                  BUY
               </div>
               <div
                  onClick={() => {
                     this.setState({ action: 'sell' });
                  }}
                  className={'btn'}
                  style={{
                     borderColor: this.state.action === 'sell' ? '#21c2f8' : '#ffffff',
                     opacity: this.state.action === 'sell' ? 1 : 0.5,
                     width: '100%'
                  }}>
                  SELL
               </div>
            </div>

            {/*OFFER CONTAINER*/}
            <div style={{ display: 'flex', padding: '0 15px 15px 15px' }}>
               <div style={{ width: '100%', paddingRight: 15 }}>
                  <TextField
                     style={{
                        width: '100%'
                     }}
                     id="offer-amount-input"
                     value={this.state.offerAmountInput}
                     onChange={e => this.updateInput(e, 'offerAmountInput')}
                     label="Amount"
                     type="number"
                     margin="none"
                     color="secondary"
                  />
               </div>

               <div style={{ width: '100%', alignSelf: 'flex-end' }}>
                  <Select
                     onChange={val => this.setState({ offerCurrency: val })}
                     value={this.state.offerCurrency}
                     optionComponent={CurrencyOption}
                     options={MAJOR_CURRENCIES}
                     placeholder={'Currency'}
                     valueComponent={CurrencyValue}
                  />
               </div>
            </div>
         </MuiThemeProvider>
      );
   }
}

TradingUI.propTypes = {
   gateways: PropTypes.object,
   accountInfo: PropTypes.object,
   balanceSheet: PropTypes.object
};
