import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useAccount } from 'wagmi';
import { truncateStringInTheMiddle } from '../../utils/utils';
import UiIcon from './UiIcon';

export function KoruBox(props: any) {
    return (
        <div className="koru-box p-10">
            <div className="flex gap-4">
                <UiIcon icon="logo-pic" classes="w-12 h-12" />
                <div className="text-left w-full">
                    <h1 className="font-medium">
                        Koru DAO
                    </h1>
                    <p className="koru-gradient-text-1 inline-block font-medium">
                        @Koru DAO
                    </p>
                    {props.content}
                </div>
            </div>
        </div>
    );
}
