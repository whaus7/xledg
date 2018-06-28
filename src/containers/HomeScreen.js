import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import Logo from './components/Logo';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class HomeScreen extends Component {
   constructor(props) {
      super(props);

      this.state = {};
   }

   render() {
      return (
         // HOME SCREEN
         <div
            style={{
               display: 'flex',
               height: '100vh',
               justifyContent: 'center',
               textAlign: 'center',
               background: '#202020'
            }}>
            {/*HEADER*/}
            <div
               style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  height: 50,
                  padding: 15
               }}>
               {/*LOGO*/}
               <div>
                  <Logo size={'sm'} />
               </div>
               <div>buttons</div>
            </div>
         </div>
      );
   }
}
