import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
//import sodium from 'sodium';
import nacl_factory from 'js-nacl';
import { Motion, spring } from 'react-motion';
import Noty from 'noty';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import ActiveKey from './components/ActiveKey';


class LockScreen extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {
         pinInput: '',
         pinRepeat: ''
      };

      this.props.db
         .get('pindata')
         .then(function(pindata) {
            console.log('get pindata - then');
            console.log(pindata);
         })
         .catch(function(e) {
            console.log('get pindata - catch');
            console.log(e);
            if (e.message === 'missing') {
               that.props.setAccount('new');
            } else {
               that.props.setAccount('existing');
            }
         });

      // TESTING
		nacl_factory.instantiate(function (nacl) {
		   console.log('TESTING NACL')
			console.log(nacl.to_hex(nacl.random_bytes(16)));
		});

      this.validKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      document.onkeydown = function(e) {
         e = e || window.event;
         this.updatePinInput(e.key, e.keyCode);
      }.bind(this);
   }

   componentWillMount() {}

   //Generate a checksum and prepend it to data, returns as hex
   // tohex_chksum(data) {
   //    if (typeof data === 'string') data = sodium.from_string(data);
   //    return sodium.crypto_generichash(4, data, '', 'hex') + sodium.to_hex(data);
   // }

   //Remove a checksum from the front of data, check if the data matches
	//return the data if the checksum matches (as uint8array) or false
	//if data does not match
	// fromhex_chksum(hex, format) {
    //   let chksum = hex.slice(0, 8);
    //   let payload = sodium.from_hex(hex.slice(8));
    //   if (sodium.crypto_generichash(4, payload, '', 'hex') != chksum) return false;
    //   if (format == 'string') return sodium.to_string(payload);
    //   return payload;
	// }

   updatePinInput(key, keyCode) {
      if (this.validKey.indexOf(key) !== -1 && this.state.pinInput.length < 4) {
         // Don't check the length until we have a callback from our setState
         this.setState(
            {
               pinInput: this.state.pinInput + key
            },
            function() {
               if (this.state.pinInput.length === 4) {
                  // Lets wait for our dial pad input animation to finish before determining the views route
                  setTimeout(
                     function() {
                        this.updateLockedView();
                     }.bind(this),
                     800
                  );
               }
            }
         );
      } else if (keyCode === 8 || keyCode === 'X') {
         this.setState({
            pinInput: ''
         });
      }
   }

   updateLockedView() {
      if (this.props.walletStatus === 'new' && this.state.pinRepeat === '') {
         this.setState({
            pinInput: '',
            pinRepeat: this.state.pinInput
         });
      } else if (this.props.walletStatus === 'new' && this.state.pinRepeat !== '') {
         // MATCH SUCCESS
         if (this.state.pinRepeat === this.state.pinInput) {
            console.log('winner!');
            //insert new pin into DB
            //TODO compile error with sodium.js??
            // let salt;
            // let pindata = {
            //    salt: this.tohex_chksum((salt = sodium.randombytes_buf(sodium.crypto_shorthash_KEYBYTES))),
            //    hash: this.tohex_chksum(sodium.crypto_shorthash(this.state.pinInput, salt))
            // };
				//
            // this.props.db
            //    .upsert('pindata', function(doc) {
            //       return { data: JSON.stringify(pindata) };
            //    })
            //    .then(function(x) {
            //       console.log('insert pin - then');
            //       console.log(x);
            //    })
            //    .catch(function(x) {
            //       console.log('insert pin - catch');
            //       console.log(x);
            //    });
         } else {
            // NO MATCH ERROR
            new Noty({
               text: 'Mismatching PIN',
               theme: 'sunset',
               type: 'error',
               layout: 'top',
               timeout: 3000
            }).show();

            this.setState({
               pinInput: '',
               pinRepeat: ''
            });
         }
      } else if (this.props.walletStatus === 'existing') {
         // TODO check if pin matches DB - toast example
      }
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

      const CurrentStatus = () => {
         if (this.props.walletStatus === 'new' && this.state.pinRepeat === '') {
            return 'New Wallet';
         } else if (this.props.walletStatus === 'new' && this.state.pinRepeat !== '') {
            return 'One More Time';
         } else if (this.props.walletStatus === 'existing') {
            return 'Login';
         }
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

               {/*CURRENT STATUS*/}
               {this.props.walletStatus !== null ? (
                  <div style={{ margin: '10px 0', fontSize: 12, color: '#ffffff' }}>{<CurrentStatus />}</div>
               ) : (
                  false
               )}

               {/*PIN ANIMATED INPUTS*/}
               <div style={{ display: 'flex', margin: '15px 20px 30px 20px', justifyContent: 'space-between' }}>
                  <ActiveKey length={this.state.pinInput.length - 1} i={0} />
                  <ActiveKey length={this.state.pinInput.length - 1} i={1} />
                  <ActiveKey length={this.state.pinInput.length - 1} i={2} />
                  <ActiveKey length={this.state.pinInput.length - 1} i={3} />
               </div>

               {/*PIN PAD*/}
               <div>{<PinButtons />}</div>
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      db: state.xledg.db,
      walletStatus: state.xledg.walletStatus
   };
};

const mapDispatchToProps = dispatch => {
   return {
      setAccount: status => {
         dispatch(ReduxActions.setAccount(status));
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(LockScreen);
