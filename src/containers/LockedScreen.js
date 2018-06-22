import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

export default class LockScreen extends Component {
   render() {
      const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '?', 0, 'X'];

      const PinButtons = () => {
         return dialPad.map((num, i) => {
            return (
               <div key={`pin${i}`} className={'pinBtnWrap'}>
                  <div className={'pinBtn'}>{num}</div>
               </div>
            );
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
               <h2 style={{ fontSize: 50, fontWeight: 100, color: '#ffffff', margin: '30px 0' }}>xLedg</h2>

               {/*<div>digit enter</div>*/}

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
