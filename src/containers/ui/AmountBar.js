import React from 'react';

const AmountBar = ({ val, color }) => {
   return (
      <div
         style={{
            width: Math.log10(val <= 1 ? 1.5 : val) * 10,
            height: 15,
            background: color,
            opacity: 0.4
         }}
      />
   );
};

export default AmountBar;
