import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification } from '../services/helpers';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import COLORS from '../services/colors';

import xrpIcon from '../images/xrp-icon.svg';
import spinner1 from '../images/spinners/xLedg-Spinner-1.svg';
import spinner2 from '../images/spinners/xLedg-Spinner-2.svg';

class HardwareConnection extends Component {
   constructor(props) {
      super(props);

      let that = this;

      this.state = {};
   }

   render() {
      return (
         <div
            style={{
               display: 'flex',
               height: '100vh',
               justifyContent: 'center',
               textAlign: 'center',
               background: COLORS.mocha,
               color: COLORS.white
            }}>
            {/*Hardware Ledger Connection Screen*/}
            <div
               //className={'pulsingCircle'}
               style={{
                  width: 600,
                  height: 600,
                  //borderRadius: 9999,
                  //background: '#ffffff',
                  alignSelf: 'center'
               }}>
               <img
                  src={spinner1}
                  style={{ width: 600, height: 600 }}
                  alt={'xLedg - Hardware Connection Screen'}
               />
               {/*<img*/}
               {/*className={'centerAbsolute'}*/}
               {/*src={spinner2}*/}
               {/*style={{ width: 600, height: 600 }}*/}
               {/*alt={'xLedg - Hardware Connection Screen'}*/}
               {/*/>*/}
               <img
                  className={'centerAbsolute'}
                  src={xrpIcon}
                  style={{ width: 180, height: 180 }}
                  alt={'xLedg - XRPL Decentralized Exchange'}
               />
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HardwareConnection));
