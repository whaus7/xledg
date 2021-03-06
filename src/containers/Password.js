import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { updateInput, materialTheme } from '../services/helpers';
import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';

class Password extends Component {
   constructor(props) {
      super(props);

      this.state = {
         passwordInput: '',
         passwordRepeat: ''
      };

      // Set the current account status
      // this.props.db
      // 	.get('pindata')
      // 	.then(function(pindata) {
      // 		console.log('get pindata - then');
      // 		console.log(pindata);
      // 		that.props.setAccount('existing');
      // 	})
      // 	.catch(function(e) {
      // 		console.log('get pindata - catch');
      // 		console.log(e);
      // 		if (e.message === 'missing') {
      // 			that.props.setAccount('new');
      // 		} else {
      // 			that.props.setAccount('existing');
      // 		}
      // 	});

      this.updateInput = updateInput.bind(this);
   }

   componentWillMount() {}

   render() {
      const CurrentStatus = () => {
         if (
            this.state.passwordInput.length === this.state.passwordRepeat.length &&
            this.state.passwordInput !== this.state.passwordRepeat
         ) {
            return 'Mismatching Password';
         } else {
            return 'Encryption';
         }
      };

      return (
         <MuiThemeProvider theme={materialTheme}>
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
                  <p style={{ margin: '15px 0 0 0', color: '#ffffff' }}>{<CurrentStatus />}</p>

                  {/*inputs by google material-ui*/}
                  <TextField
                     id="password-input"
                     value={this.state.passwordInput}
                     onChange={e => this.updateInput(e, 'passwordInput')}
                     label="Password"
                     type="password"
                     margin="normal"
                     color="secondary"
                  />

                  <TextField
                     id="password-repeat"
                     value={this.state.passwordRepeat}
                     onChange={e => this.updateInput(e, 'passwordRepeat')}
                     label="Repeat"
                     type="password"
                     margin="normal"
                     color="secondary"
                  />

                  {/*INSTRUCTIONS*/}
                  <p style={{ margin: '35px 0', color: '#ffffff' }}>
                     This password is used to encrypt your secret key<br />Make sure it's long and random
                  </p>
               </div>
            </div>
         </MuiThemeProvider>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Password));
