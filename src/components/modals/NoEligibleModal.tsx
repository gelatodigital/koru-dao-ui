import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import KoruModal from '../globals/KoruModal';

export default function NoHandlerModal() {
    const { setNotEligibleModal } = useContext(AppContext);

    return (
        <KoruModal
            close={setNotEligibleModal}
            modal={<div className="px-6 pb-10 text-center">
                <h2 className="text-2xl text-center font-bold py-12">
                    Sorry, you are not eligible to claim
                </h2>
                <p>
                    KoruDAO NFTs are available to active members of the Lens community. <br />
                    If you have any questions on minting please contact us.
                </p>
                <a href="https://t.me/gelatonetwork"
                   className="koru-btn _primary mx-auto mt-6 inline-block"
                   target="_blank"
                >
                    Go to our Telegram channel
                </a>
            </div>} />
    );
}
