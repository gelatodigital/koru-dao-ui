import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import KoruModal from '../globals/KoruModal';

export default function NoHandlerModal() {
    const { setNoLensModal } = useContext(AppContext);

    return (
        <KoruModal
            close={setNoLensModal}
            modal={<div className="px-6 pb-10 text-center">
                <h2 className="text-2xl text-center font-bold py-12">
                    Please Claim Your Lens Protocol Handle
                </h2>
                <p>
                    Before you start with Koru DAO, you must have a lens Protocol <br />handle, please visit
                    <span className="text-koru-purple mx-2">https://claim.lens.xyz</span> to claim your handle
                </p>
                <a href="https://claim.lens.xyz/"
                   className="koru-btn _primary mx-auto mt-6 inline-block"
                   target="_blank"
                >
                    Go to claim your handle now
                </a>
            </div>} />
    );
}
