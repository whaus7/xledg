import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import nacl_factory from 'js-nacl';
import { notification } from '../services/helpers';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import ActiveKey from './components/ActiveKey';
import COLORS from '../services/colors';

class LockScreen extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {
         pinInput: '',
         pinRepeat: ''
      };

      // Set the current account status
      this.props.db
         .get('pindata')
         .then(function(pindata) {
            console.log('get pindata - then');
            console.log(pindata);
            that.props.setAccount('existing');
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

      this.validKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      document.onkeydown = function(e) {
         e = e || window.event;
         this.updatePinInput(e.key, e.keyCode);
      }.bind(this);
   }

   componentWillMount() {}

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
      let that = this;

      switch (this.props.walletStatus) {
         case 'new':
            // NEW ACCOUNT - PIN REPEAT
            if (this.state.pinRepeat === '') {
               this.setState({
                  pinInput: '',
                  pinRepeat: this.state.pinInput
               });
            } else if (this.state.pinRepeat !== '') {
               // NEW ACCOUNT
               // MATCH SUCCESS
               if (this.state.pinRepeat === this.state.pinInput) {
                  nacl_factory.instantiate(function(nacl) {
                     // Some big salt
                     let salt = nacl.to_hex(nacl.random_bytes(64));

                     that.props.db.upsert('pindata', function(doc) {
                        return {
                           salt: salt,
                           hash: nacl.to_hex(nacl.crypto_hash_string(salt + that.state.pinInput))
                        };
                     });

                     // New account set - change views
                     that.props.history.push('/password');
                  });
               } else {
                  // NO MATCH ERROR
                  notification('Mismatching PIN', 'error');

                  this.setState({
                     pinInput: '',
                     pinRepeat: ''
                  });
               }
            }
            break;
         case 'existing':
            // EXISTING ACCOUNT CHECK IF PIN MATCHES
            this.props.db
               .get('pindata')
               .then(function(pindata) {
                  console.log('get pindata - then');
                  console.log(pindata);

                  // Check if PIN matches
                  nacl_factory.instantiate(function(nacl) {
                     // PIN MATCH
                     if (
                        nacl.to_hex(nacl.crypto_hash_string(pindata.salt + that.state.pinInput)) ===
                        pindata.hash
                     ) {
                        that.props.history.push('/dashboard');
                     } else {
                        // NO MATCH ERROR
                        notification('Invalid PIN', 'error');

                        that.setState({
                           pinInput: '',
                           pinRepeat: ''
                        });
                     }
                  });
               })
               .catch(function(e) {
                  console.log('get pindata - catch');
                  console.log(e);
               });
            break;
         default:
            return true;
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
               background: COLORS.dark
            }}>
            <div style={{ maxWidth: 300 }}>
               {/*TITLE*/}
               <Link to="/" style={{ textDecoration: 'none' }}>
                  <Logo size={'lg'} margin={'30px 0 15px 0'} />
               </Link>

               {/*CURRENT STATUS*/}
               {this.props.walletStatus !== null ? (
                  <div style={{ margin: '10px 0', fontSize: 12, color: COLORS.white }}>
                     {<CurrentStatus />}
                  </div>
               ) : (
                  false
               )}

               {/*PIN ANIMATED INPUTS*/}
               <div
                  style={{ display: 'flex', margin: '15px 20px 30px 20px', justifyContent: 'space-between' }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LockScreen));
