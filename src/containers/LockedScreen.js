import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

//import Button from '@material-ui/core/Button';

export default class LockScreen extends Component {
   constructor(props) {
      super(props);

      this.state = {
         pinInput: '',
         blink: true
      };

      this.validKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

      document.onkeydown = function(e) {
         e = e || window.event;
         console.log(e);

         if (this.validKey.indexOf(e.key) !== -1 && this.state.pinInput.length < 4) {
            this.setState({
               pinInput: this.state.pinInput + e.key
            });
         } else if (e.keyCode === 8) {
            this.setState({
               pinInput: this.state.pinInput.slice(0, -1)
            });
         }

         console.log(this.state.pinInput);
      }.bind(this);

      //Toggle blinking pin input
      // setInterval(
      //    function() {
      //       this.setState({
      //          //blink: !this.state.blink
      //          bounceHeight: 0
      //       });
      //    }.bind(this),
      //    600
      // );
   }

   render() {
      const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '?', 0, 'X'];
      const pinInput = [0, 1, 2, 3];

      //const springConfig = { stiffness: 180, damping: 6 };
      const config = { stiffness: 140, damping: 14 };
      //const toCSS = rotateX => ({ transform: `rotateX: ${rotateX}deg` });

      const PinButtons = () => {
         return dialPad.map((num, i) => {
            return (
               <div key={`pin${i}`} className={'pinBtnWrap'}>
                  <div className={'pinBtn'}>{num}</div>
               </div>
            );
         });
      };

      const PinInput = () => {
         return pinInput.map((num, i) => {
            if (i >= this.state.pinInput.length) {
               // EMPTY
               return (
                  <Motion defaultStyle={{ rotateX: 0 }} style={{ rotateX: spring(this.state.bounceHeight, config) }}>
                     {value => (
                        <div
                           key={`pinInput${i}`}
                           style={{
                              display: 'flex',
                              width: '20%',
                              height: 50
                              //transform: `rotateY: ${value.rotateX}deg`
                           }}>
                           <div
                              style={{
                                 alignSelf: 'flex-end',
                                 width: '100%',
                                 height: 2,
                                 //background: this.state.blink ? '#21c2f8' : 'none'
                                 background: '#21c2f8',
                                 marginBottom: value.rotateX
                                 //transform: `rotateX: ${value.rotateX}`
                                 //transform: `rotateX: ${value.rotateX}deg`
                              }}
                           />
                        </div>
                     )}
                  </Motion>
               );
            } else {
               // FILLED
               return (
                  <div
                     key={`pinInput${i}`}
                     style={{ display: 'flex', justifyContent: 'center', width: '20%', height: 50 }}>
                     <div
                        style={{
                           width: '50%',
                           height: '50%',
                           background: '#ffffff',
                           opacity: 0.9,
                           borderRadius: 30,
                           marginTop: 10
                        }}
                     />
                  </div>
               );
            }
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
               <h2 style={{ fontSize: 50, fontWeight: 100, color: '#ffffff', margin: '30px 0 15px 0' }}>xLedg</h2>

               <div style={{ display: 'flex', margin: '15px 20px 30px 20px', justifyContent: 'space-between' }}>
                  {<PinInput />}
               </div>

               <div>{<PinButtons />}</div>

               {/*<Link to="/dashboard">*/}
               {/*<Button variant="contained" color="primary">*/}
               {/*Create PIN*/}
               {/*</Button>*/}
               {/*</Link>*/}
            </div>
         </div>
      );
   }
}
