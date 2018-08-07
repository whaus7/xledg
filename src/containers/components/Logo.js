import React, { Component } from 'react';
import PropTypes from 'prop-types';

import xrpIcon from '../../images/xrp-icon.svg';

export default class Logo extends Component {
   render() {
      const { size } = this.props;

      let svgSize = null;
      let textSize = null;

      switch (size) {
         case 'xs':
            svgSize = 30;
            textSize = 20;
            break;
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
         // Default to small
         default:
            svgSize = 50;
            textSize = 20;
            break;
      }

      return (
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               margin: this.props.margin
            }}>
            <img
               src={xrpIcon}
               style={{ maxWidth: svgSize, maxHeight: svgSize }}
               alt={'xLedg - XRPL Decentralized Exchange'}
            />
            <div
               style={{
                  fontSize: textSize,
                  fontWeight: 100,
                  color: '#ffffff',
                  alignSelf: 'center',
                  marginLeft: size === 'xs' ? 0 : size === 'sm' ? -5 : -10
               }}>
               ledg
            </div>
         </div>
      );
   }
}

Logo.propTypes = {
   size: PropTypes.string,
   margin: PropTypes.string
};
