import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import ActiveKey from './components/ActiveKey';
import Logo from './components/Logo';

class LockScreen extends Component {
   constructor(props) {
      super(props);

      this.state = {
         pinInput: '',
         newAccount: this.props.db.get('pindata').then(function(pindata) {
            console.log(pindata);
            try {
               if (pindata.data === undefined || pindata.data === '') {
                  return true;
               }
            } catch (e) {
               console.log(e);
               return false;
            }
         })
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
            pinInput: ''
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
               <Link to="/" style={{ textDecoration: 'none' }}>
                  <Logo size={'lg'} margin={'30px 0 15px 0'} />
               </Link>

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

const mapStateToProps = state => {
   return {
      db: state.db
   };
};

const mapDispatchToProps = dispatch => {
   return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen);
