import React, { Component } from 'react';

import infoIcon from '../../images/icons/info.svg';
import oneIcon from '../../images/number_icons/1.svg';
import twoIcon from '../../images/number_icons/2.svg';
import threeIcon from '../../images/number_icons/3.svg';
import fourIcon from '../../images/number_icons/4.svg';

const instructions = [
   { id: 1, text: 'Use Google Chrome browser and plug-in your Ledger wallet', icon: oneIcon },
   { id: 2, text: 'Unlock your Ledger wallet & open the XRP app', icon: twoIcon },
   { id: 3, text: "Go to 'Settings' and enable 'Browser support'", icon: threeIcon },
   { id: 4, text: "Click 'Initialize Cold Connection' to begin", icon: fourIcon }
];

export default class Instructions extends Component {
   constructor(props) {
      super(props);

      this.state = {
         instructions: instructions,
         instructionsHovered: false
      };
   }

   render() {
      return (
         <div
            style={{
               position: 'absolute',
               left: 105,
               top: 0,
               height: '100vh',
               width: 75
            }}>
            <div
               onMouseEnter={() =>
                  this.setState({
                     instructionsHovered: true
                  })
               }
               onMouseLeave={() =>
                  this.setState({
                     instructionsHovered: false
                  })
               }
               className={`centerAbsolute fadeIn ${
                  this.state.instructionsHovered !== false ? 'fade' : false
               }`}
               style={{ width: 250, fontSize: 14 }}>
               <div
                  style={{
                     textAlign: 'left',
                     fontSize: 12,
                     cursor: this.state.instructionsHovered !== false ? 'help' : 'default'
                  }}>
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                     <img
                        alt={`xLedg Instructions`}
                        src={infoIcon}
                        style={{
                           width: 40,
                           height: 40
                        }}
                     />
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                     <h2 style={{ color: '#21c2f8' }}>INSTRUCTIONS</h2>
                  </div>

                  {this.state.instructions.map((item, i) => {
                     return (
                        <div
                           key={`xLedg_instructions_${i}`}
                           style={{
                              display: 'flex',
                              marginBottom: i !== this.state.instructions.length - 1 ? 8 : 0
                           }}>
                           <div style={{ minWidth: 32, alignSelf: 'center' }}>
                              <img
                                 alt={`xLedg Instructions - Step ${item.id}`}
                                 src={item.icon}
                                 width={20}
                                 height={20}
                              />
                           </div>
                           <div>{item.text}</div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      );
   }
}
