import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

const CountdownTimer = ({ timestamp }: { timestamp: number }) => {
    const [days, hours, minutes, seconds] = useCountdown(timestamp);

    if (days + hours + minutes + seconds > 0) {
        return (
            <span>
                {days > 0 ? `${days}d ` : null}
                {hours > 0 ? `${hours}h ` : null}
                {minutes > 0 ? `${minutes}m ` : null}
                {seconds < 10 ? `0${seconds}s` : `${seconds}s`}
            </span>
        );
    } else {
        return <span>0s</span>;
    }
};

export { CountdownTimer };
