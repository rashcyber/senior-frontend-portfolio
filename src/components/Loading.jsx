import React from 'react';
import '../styles/Loading.css';

const Loading = ({ size = 'medium', fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`spinner spinner-${size}`}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`spinner spinner-${size}`}></div>
    </div>
  );
};

export default Loading;
