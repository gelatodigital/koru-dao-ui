import { useState } from 'react';
import UiIcon from './UiIcon';

export default function CopyTag({ text }: any) {
    const [copied, setCopied] = useState(false);

    const copyTextToClipboard = () => {
        if (!navigator.clipboard) {
            return;
        }
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1000);
            })
            .catch(e => {
                console.warn(e);
            });
    };

    return (
        <div className="">
            <div
                className="px-4 py-2 cursor-pointer bg-koru-gray rounded-2xl text-white text-sm flex gap-2 items-center justify-center"
                onClick={() => copyTextToClipboard()}>
                {text && copied ? 'Copied!' : `${text}`
                }
                {!copied && <UiIcon classes="text-white w-4" icon="copy" />}
            </div>
        </div>
    );
};
