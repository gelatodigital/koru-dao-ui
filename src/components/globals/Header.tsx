import IconLogo from '../../assets/icons/icon-logo.svg';
import Networks from './Networks';
import { Account } from './Account';

export default function Header() {
    return (
        <header className="flex justify-between items-center">
            <img src={IconLogo} alt={'Gelato for EthCC5'} className="w-40" />
            <div className='flex items-center gap-4'>
                <Account />
                <Networks />
            </div>
        </header>
    );
};
