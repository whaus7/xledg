import React from 'react';

const Title = ({ text }) => {
   return (
      <div
         style={{
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            background: '#303b42',
            padding: '10px 15px'
         }}>
         {text}
      </div>
   );
};

export default Title;
