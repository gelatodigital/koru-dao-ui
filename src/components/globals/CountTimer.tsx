import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

const CountTimer = ({
                        timestamp,
                        direction = 'up',
                        classNames,
                    }: { timestamp: number, direction?: 'up' | 'down', classNames?: string }) => {
    const [days, hours, minutes, seconds] = useCountdown(timestamp, direction);

    if (days + hours + minutes + seconds > 0) {
        return (
            <span className={`inline-block ${classNames}`}>
                {direction === 'up' ?
                    <span>
                        {days > 0 ? `${days} ${days > 1 ? 'days' : 'day'} ` : null}

                        {days < 1 && hours > 0 ? `${hours} hours ` : null}

                        {days < 1 && hours < 1 && minutes > 0 ? `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ` : null}

                        {hours < 1 && minutes < 1 &&
                          <span>{seconds < 10 ? `0${seconds}s` : `${seconds}s`}</span>
                        }
                    </span>
                    :
                    <span>
                        {days > 0 ? `${days} ${days > 1 ? 'days' : 'day'} ` : null}

                        {hours > 0 ? `${hours} hours ` : null}

                        {minutes > 0 ? `${minutes}m ` : null}

                        {<span>{seconds < 10 ? `0${seconds}s` : `${seconds}s`}</span>}
                    </span>
                }
            </span>
        );
    } else {
        return <span className={`inline-block ${classNames}`}>0s</span>;
    }
};

export { CountTimer };
