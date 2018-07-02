import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class ActiveKey extends Component {
   constructor(props) {
      super(props);

      this.state = {};
   }

   render() {
      const springConfig = { stiffness: 120, damping: 10 };

      const ActiveKeyToggle = () => {
         if (this.props.i === this.props.length) {
            // ACTIVE KEY
            return (
               <Motion
                  defaultStyle={{
                     width: 60,
                     height: 2,
                     radius: 0,
                     offset: 0,
                     active: 0,
                     red: 33,
                     green: 194,
                     blue: 248
                  }}
                  style={{
                     width: spring(30, springConfig),
                     height: spring(30, springConfig),
                     radius: spring(30, springConfig),
                     offset: spring(10, springConfig),
                     red: spring(255, springConfig),
                     green: spring(255, springConfig),
                     blue: spring(255, springConfig),
                     active: 1
                  }}>
                  {value => (
                     <div
                        style={{
                           display: 'flex',
                           width: '20%',
                           height: 50,
                           justifyContent: 'space-around'
                        }}>
                        <div
                           style={{
                              alignSelf: 'flex-end',
                              width: value.width,
                              height: value.height,
                              backgroundColor: `rgba(${value.red}, ${value.green}, ${value.blue}, 1)`,
                              borderRadius: value.radius,
                              marginBottom: value.offset
                           }}
                        />
                     </div>
                  )}
               </Motion>
            );
         } else if (this.props.i <= this.props.length) {
            // FULL
            return (
               <div style={{ display: 'flex', justifyContent: 'center', width: '20%', height: 50 }}>
                  <div
                     style={{
                        alignSelf: 'flex-end',
                        width: 30,
                        height: 30,
                        background: '#ffffff',
                        borderRadius: 30,
                        marginBottom: 10
                     }}
                  />
               </div>
            );
         } else {
            // EMPTY
            return (
               <div style={{ display: 'flex', justifyContent: 'center', width: '20%', height: 50 }}>
                  <div
                     style={{
                        alignSelf: 'flex-end',
                        width: '100%',
                        height: 2,
                        background: '#21c2f8'
                     }}
                  />
               </div>
            );
         }
      };

      return <ActiveKeyToggle />;
   }
}

ActiveKey.propTypes = {
   length: PropTypes.number,
   i: PropTypes.number
};
