import React from 'react';

const Title = ({ text }) => {
   return (
      <div
         style={{
            fontSize: 12,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            background: '#303b42',
            padding: '8px 13px'
         }}>
         {text}
      </div>
   );
};

export default Title;
