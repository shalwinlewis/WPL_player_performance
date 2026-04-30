import React from 'react';
import './Skeleton.css';

function Skeleton({ width = '100%', height = '20px', count = 1 }) {
  return (
    <>
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="skeleton"
          style={{ width, height, marginBottom: '10px' }}
        />
      ))}
    </>
  );
}

export default Skeleton;