import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import _abi from './koruContract.abi.json';

export class koruContract {
    static readonly abi = _abi;

    static createInterface() {
        return new utils.Interface(_abi);
    }

    static connect(address: string, signerOrProvider: Signer | Provider) {
        return new Contract(address, _abi, signerOrProvider) as any;
    }
}
