import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useAccount } from 'wagmi';
import { truncateStringInTheMiddle } from '../../utils/utils';

export function Account() {
    const { lensHandler }: any = useContext(AppContext);
    const { address } = useAccount();

    return (
        <div className='text-koru-purple font-medium bg-koru-gray-light px-6 py-3 rounded-2xl text-xs lg:text-base'>
            {lensHandler ? <p className="">
                {`@${lensHandler.handle}`}
            </p> : <p className="">{truncateStringInTheMiddle(address ?? '', 6, 4)}</p>}
        </div>
    );
}
