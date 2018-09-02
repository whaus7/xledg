import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

import xrpIcon from '../../images/xrp-icon.svg';
import codeIcon from '../../images/icons/code.svg';
import walletIcon from '../../images/icons/wallet.svg';
import lockIcon from '../../images/icons/lock.svg';

const infoItems = [
   {
      id: 'xrp',
      svg: xrpIcon,
      text: (
         <div>
            <p>The XRP ledger is also a built in exchange, also known as a (DEX) decentralized exchange</p>
            <p>
               Anything of value can be traded between parties for less than a cent. xLedg is just an
               interface to the XRP ledger
            </p>
         </div>
      )
   },
   {
      id: 'wallet',
      svg: walletIcon,
      text: (
         <div>
            <p>Currently most people trade on centralized exchanges with large targets on their backs</p>
            <p>xLedg allows you to sign transactions straight from your cold wallet</p>
            <p>This means you can hold your private keys and trade safely</p>
         </div>
      )
   },
   // {
   //    id: 'lock',
   //    svg: lockIcon,
   //    text: 'Trade securely directly from your cold wallet'
   // },
   {
      id: 'code',
      svg: codeIcon,
      text: (
         <div>
            <p>Trading directly on a decentralized exchanged provides the highest level of security</p>
            <p>The only outgoing connections xLedg makes is trusted APIs: XRP Ledger & Ledger Hardware</p>
         </div>
      )
   }
];

export default class InfoMenu extends Component {
   constructor(props) {
      super(props);

      this.state = {
         hoveredItem: null
      };
   }

   render() {
      const { order } = this.props;

      const springConfig = { stiffness: 150, damping: 10 };

      return (
         <div>
            {/*TEXT DISPLAY*/}
            <div
               style={{
                  position: 'absolute',
                  right: 150,
                  top: 0,
                  height: '100vh',
                  width: 75
               }}>
               <div
                  className={`centerAbsolute fadeIn ${this.state.hoveredItem !== null ? 'fade' : false}`}
                  style={{ width: 250, fontSize: 12, left: this.state.hoveredItem === null ? 90 : 0 }}>
                  {this.state.hoveredItem !== null ? this.state.hoveredItem.text : 'What is xLedg?'}
               </div>
            </div>
            {/*ICON MENU*/}
            <div
               style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100vh',
                  width: 75
               }}>
               <div className={'centerAbsolute'}>
                  {infoItems.map((item, i) => {
                     return (
                        <div
                           key={`menu_item_${item.id}`}
                           onMouseEnter={() => {
                              this.setState({ hoveredItem: item });
                           }}
                           onMouseLeave={() => {
                              this.setState({ hoveredItem: null });
                           }}>
                           <Motion
                              defaultStyle={{
                                 right: 0
                              }}
                              style={{
                                 right: spring(
                                    this.state.hoveredItem !== null && this.state.hoveredItem.id === item.id
                                       ? 10
                                       : 0,
                                    springConfig
                                 )
                              }}>
                              {value => (
                                 <img
                                    className={`fadeIn ${
                                       this.state.hoveredItem !== null &&
                                       this.state.hoveredItem.id === item.id
                                          ? 'fade'
                                          : false
                                    }`}
                                    src={item.svg}
                                    style={{
                                       position: 'relative',
                                       width: 40,
                                       height: 40,
                                       right: value.right,
                                       marginBottom: 10,
                                       cursor:
                                          this.state.hoveredItem !== null &&
                                          this.state.hoveredItem.id === item.id
                                             ? 'help'
                                             : 'default'
                                    }}
                                    alt={item.description}
                                 />
                              )}
                           </Motion>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      );
   }
}

InfoMenu.propTypes = {
   order: PropTypes.object
};
