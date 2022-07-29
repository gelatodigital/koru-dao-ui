import React, { useEffect, useState } from 'react';

const CircularProgress = ({ size, strokeWidth, percentage, color }) => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        setProgress(percentage);
    }, [percentage]);

    const viewBox = `0 0 ${size} ${size}`;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI * 2;
    const dash = (progress * circumference) / 100;

    return (
      <svg width={size} height={size} viewBox={viewBox}>
          <circle
            fill="none"
            stroke="#ccc"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
          />
          <circle
            fill="none"
            stroke={color}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeDasharray={[dash, circumference - dash]}
            strokeLinecap="round"
            style={{ transition: 'all 0.5s' }}
          />
      </svg>
    );
};

export default CircularProgress;
