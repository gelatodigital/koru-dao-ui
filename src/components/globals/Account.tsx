import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export function Account() {
    const { lensHandler }: any = useContext(AppContext);

    return (
        <div>
            {lensHandler && <p className="koru-btn _link">
                {`@${lensHandler.handle}`}
            </p>}
        </div>
    );
}
