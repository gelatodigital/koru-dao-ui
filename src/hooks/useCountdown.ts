import { useEffect, useState } from 'react';

const getReturnValues = (countDown: any) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
};

const useCountdown = (date: any, direction?: 'up' | 'down') => {
    const [countDown, setCountDown] = useState(date - new Date().getTime());

    useEffect(() => {
        const _t = direction === 'up' ? new Date().getTime() - date : date - new Date().getTime();
        setCountDown(_t);

        const interval = setInterval(() => {
            const _t = direction === 'up' ? new Date().getTime() - date : date - new Date().getTime();
            setCountDown(_t);
        }, 1000);

        // When unmounted will clear the interval
        return () => clearInterval(interval);
    }, [date]);

    return getReturnValues(countDown);
};

export { useCountdown };
