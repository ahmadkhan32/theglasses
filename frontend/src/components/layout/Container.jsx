import React from 'react';

const Container = ({ children, style = {} }) => (
  <div
    style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      ...style,
    }}
  >
    {children}
  </div>
);

export default Container;
