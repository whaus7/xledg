import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import ActiveKey from './components/ActiveKey';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

//import Button from '@material-ui/core/Button';
import xrpIcon from '../images/xrp-icon.svg';

export default class LockScreen extends Component {
   constructor(props) {
      super(props);

      this.state = {
         pinInput: ''
      };

      this.validKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      document.onkeydown = function(e) {
         e = e || window.event;
         this.updatePinInput(e.key, e.keyCode);
      }.bind(this);
   }

   updatePinInput(key, keyCode) {
      if (this.validKey.indexOf(key) !== -1 && this.state.pinInput.length < 4) {
         this.setState({
            pinInput: this.state.pinInput + key
         });
      } else if (keyCode === 8 || keyCode === 'X') {
         this.setState({
            pinInput: this.state.pinInput.slice(0, -1)
         });
      }
      console.log(this.state.pinInput);
   }

   render() {
      const dialPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '?', '0', 'X'];

      const PinButtons = () => {
         return dialPad.map((num, i) => {
            return (
               <div key={`pin${i}`} className={'pinBtnWrap'}>
                  <div onClick={() => this.updatePinInput(num, num)} className={'pinBtn'}>
                     {num}
                  </div>
               </div>
            );
         });
      };

      return (
         <div
            style={{
               display: 'flex',
               height: '100vh',
               justifyContent: 'center',
               textAlign: 'center',
               background: '#202020'
            }}>
            <div style={{ maxWidth: 300 }}>
               {/*TITLE*/}
               <div
                  style={{
                     display: 'flex',
                     justifyContent: 'center',
                     margin: '30px 0 15px 0'
                  }}>
                  <img
                     src={xrpIcon}
                     style={{ maxWidth: 100, maxHeight: 100 }}
                     alt={'xLedg - XRPL Decentralized Exchange'}
                  />
                  <div
                     style={{ fontSize: 50, fontWeight: 100, color: '#ffffff', alignSelf: 'center', marginLeft: -10 }}>
                     ledg
                  </div>
               </div>

               <div style={{ display: 'flex', margin: '15px 20px 30px 20px', justifyContent: 'space-between' }}>
                  <ActiveKey length={this.state.pinInput.length - 1} i={0} />
                  <ActiveKey length={this.state.pinInput.length - 1} i={1} />
                  <ActiveKey length={this.state.pinInput.length - 1} i={2} />
                  <ActiveKey length={this.state.pinInput.length - 1} i={3} />
               </div>

               <div>{<PinButtons />}</div>
            </div>
         </div>
      );
   }
}
