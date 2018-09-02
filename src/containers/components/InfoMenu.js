import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';

import xrpIcon from '../../images/xrp-icon.svg';
import codeIcon from '../../images/icons/code.svg';
import walletIcon from '../../images/icons/wallet.svg';

const infoItems = [
   {
      id: 'xrp',
      svg: xrpIcon,
      text: (
         <div>
            <p className={'border'}>
               The XRP ledger is also a built in exchange, known as a (DEX) decentralized exchange
            </p>
            <p className={'border'}>
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
            <p className={'border'}>
               Currently most people trade on centralized exchanges with large targets on their backs
            </p>
            <p className={'border'}>xLedg allows you to sign transactions straight from your cold wallet</p>
            <p className={'border'}>This means you can hold your private keys and trade safely</p>
         </div>
      )
   },
   {
      id: 'code',
      svg: codeIcon,
      text: (
         <div>
            <p className={'border'}>
               Trading directly on a decentralized exchanged provides the highest level of security
            </p>
            <p className={'border'}>
               The only outgoing connections xLedg establishes are with two industry trusted APIs: XRP Ledger
               & Ledger Hardware
            </p>
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
                  style={{
                     width: 250,
                     fontSize: 12,
                     textAlign: 'left',
                     left: this.state.hoveredItem === null ? 160 : 0
                  }}>
                  {this.state.hoveredItem !== null ? (
                     this.state.hoveredItem.text
                  ) : (
                     <h2 style={{ color: '#21c2f8' }}>WHAT IS XLEDG?</h2>
                  )}
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
