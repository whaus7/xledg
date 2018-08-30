import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification } from '../services/helpers';
import { Motion, spring } from 'react-motion';

import ReduxActions from '../redux/XledgRedux';
import Logo from './components/Logo';
import COLORS from '../services/colors';

import xrpIcon from '../images/xrp-icon.svg';
import spinner1 from '../images/spinners/xLedg-Spinner-1.svg';
import spinner2 from '../images/spinners/xLedg-Spinner-2.svg';

class HardwareConnection extends Component {
   constructor(props) {
      super(props);

      this.state = {
         connected: false
      };
   }

   render() {
      const springConfig = { stiffness: 120, damping: 30 };

      return (
         <div
            style={{
               display: 'flex',
               height: '100vh',
               justifyContent: 'center',
               textAlign: 'center',
               background: COLORS.dark,
               color: COLORS.white
            }}>
            {/*Hardware Ledger Connection Screen*/}
            <Motion
               defaultStyle={{
                  width: 600,
                  height: 600,
                  opacity: 1
               }}
               style={{
                  width: spring(this.state.connected ? 4000 : 600, springConfig),
                  height: spring(this.state.connected ? 4000 : 600, springConfig)
               }}>
               {value => (
                  <div
                     style={{
                        width: value.width,
                        height: value.height,
                        alignSelf: 'center'
                     }}>
                     <img
                        src={spinner1}
                        style={{ width: value.width, height: value.height }}
                        alt={'xLedg - Hardware Connection Screen'}
                     />

                     {/*<img*/}
                     {/*className={'centerAbsolute'}*/}
                     {/*src={spinner2}*/}
                     {/*style={{ width: 600, height: 600 }}*/}
                     {/*alt={'xLedg - Hardware Connection Screen'}*/}
                     {/*/>*/}
                     <img
                        onClick={() => {
                           this.setState({
                              connected: true
                           });
                        }}
                        className={`centerAbsolute fadeOut ${this.state.connected ? 'fade' : false}`}
                        src={xrpIcon}
                        style={{
                           width: 180,
                           height: 180
                        }}
                        alt={'xLedg - XRPL Decentralized Exchange'}
                     />

                     <div
                        style={{ color: '#202020', fontSize: 12, marginTop: 220 }}
                        className={`centerAbsolute blinkTextWhite fadeOut ${
                           this.state.connected ? 'fade' : false
                        }`}>
                        Waiting For Cold Connection...
                     </div>
                  </div>
               )}
            </Motion>
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
