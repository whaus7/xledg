import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import xrpIcon from '../../images/xrp-icon.svg';

export default class Logo extends Component {
   constructor(props) {
      super(props);

      this.state = {};
   }

   render() {
      let svgSize = null;
      let textSize = null;

      switch (this.props.size) {
         case 'sm':
            svgSize = 50;
            textSize = 20;
            break;
         case 'md':
            svgSize = 80;
            textSize = 30;
            break;
         case 'lg':
            svgSize = 100;
            textSize = 50;
            break;
      }

      return (
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               margin: '30px 0 15px 0'
            }}>
            <img
               src={xrpIcon}
               style={{ maxWidth: svgSize, maxHeight: svgSize }}
               alt={'xLedg - XRPL Decentralized Exchange'}
            />
            <div
               style={{ fontSize: textSize, fontWeight: 100, color: '#ffffff', alignSelf: 'center', marginLeft: -10 }}>
               ledg
            </div>
         </div>
      );
   }
}

Logo.propTypes = {
   size: PropTypes.string
};
