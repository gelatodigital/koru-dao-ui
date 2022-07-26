import IconLogo from '../../assets/icons/icon-logo.svg';
import Networks from './Networks';
import { Account } from './Account';
import { useAccount } from 'wagmi';

export default function Header() {
    const { isConnected } = useAccount();
    return (
        <header className="flex justify-between items-center">
            <img src={IconLogo} alt={'Gelato for EthCC5'} className="w-40" />
            <div className="items-center gap-4 hidden lg:flex">
                {isConnected && <Account />}
                <Networks />
            </div>
        </header>
    );
};
