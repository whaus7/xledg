import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';

const RippleAPI = require('ripple-lib').RippleAPI;

class Dashboard extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {
         //dataAPI: 'https://data.ripple.com',
         api: new RippleAPI({
            server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
         })
      };

      // const api = new RippleAPI({
      //    server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
      // });

      this.props.getGateways();

      this.state.api.on('error', (errorCode, errorMessage) => {
         console.log(errorCode + ': ' + errorMessage);
      });

      this.state.api.on('connected', () => {
         console.log('connected');
      });

      this.state.api.on('disconnected', code => {
         // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
         // will be 1000 if this was normal closure
         console.log('disconnected, code:', code);
      });

      this.state.api
         .connect()
         .then(() => {
            /* insert code here */
            this.state.api.getBalanceSheet('rPyURAVppfVm76jdSRsPyZBACdGiXYu4bf').then(balanceSheet => {
               console.log(balanceSheet);
            });
         })
         .then(() => {
            //return api.disconnect();
         })
         .catch(console.error);

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
   }

   render() {
      const { walletStatus } = this.props;

      return (
         // DASHBOARD
         <div
            style={
               {
                  // display: 'flex',
                  // height: '100vh',
                  // justifyContent: 'center',
                  // textAlign: 'center',
                  // background: '#202020'
               }
            }>
            {/*HEADER*/}
            <div
               id={'header'}
               style={{
                  display: 'flex',
                  width: '100%',
                  background: '#202020',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                  //height: 50,
                  padding: 15
               }}>
               {/*LOGO*/}
               <div>
                  <Logo size={'sm'} margin={'0'} />
               </div>

               <div style={{ alignSelf: 'center' }}>Actions</div>
            </div>

            {/*BODY*/}
            <Grid container spacing={24}>
               <Grid item xs={3}>
                  test
               </Grid>
               <Grid item xs={6}>
                  test
               </Grid>
               <Grid item xs={3}>
                  test
               </Grid>
            </Grid>
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      db: state.xledg.db,
      walletStatus: state.xledg.walletStatus,
      gateways: state.xledg.gateways,
      submitFetching: state.xledg.submitFetching
   };
};

const mapDispatchToProps = dispatch => {
   return {
      setAccount: status => {
         dispatch(ReduxActions.setAccount(status));
      },
      getGateways: () => {
         dispatch(ReduxActions.getGateways());
      }
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
