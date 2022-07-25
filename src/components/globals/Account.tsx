import { useAccount, useEnsName } from 'wagmi';
import { truncateStringInTheMiddle } from '../../utils/utils';

export function Account() {
    const { address } = useAccount();
    const { data: ensNameData } = useEnsName({ address });

    return (
        <div className='text-black text-opacity-40'>
            {ensNameData ?? truncateStringInTheMiddle(address ?? '', 8, 4)}
            {ensNameData ? ` (${truncateStringInTheMiddle(address ?? '', 8, 4)})` : null}
        </div>
    );
}
