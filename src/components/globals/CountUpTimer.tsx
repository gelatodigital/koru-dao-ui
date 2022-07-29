import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

const CountUpTimer = ({ timestamp }: { timestamp: number }) => {
    const [days, hours, minutes, seconds] = useCountdown(timestamp, 'up');

    if (days + hours + minutes + seconds > 0) {
        return (
            <span>
                {days > 0 ? `${days} ${days > 1 ? 'days' : 'day'} ` : null}

                {days < 1 && hours > 0 ? `${hours} hours ` : null}

                {hours < 1 && minutes > 0 ? `${minutes} minutes ` : null}

                {hours < 1 && minutes < 1 &&
                  <span>
                    {seconds < 10 ? `0${seconds}s` : `${seconds}s`}
                </span>
                }
            </span>
        );
    } else {
        return <span>0s</span>;
    }
};

export { CountUpTimer };
