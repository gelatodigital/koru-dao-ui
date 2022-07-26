import UiIcon from '../globals/UiIcon';

export default function MessageBox() {

    return (
        <div className="koru-box mt-6 lg:mt-10 p-10">
            <div className="flex gap-4">
                <UiIcon icon="logo-pic" classes="w-12 h-12" />
                <div className="text-left w-full">
                    <h1 className="font-medium">
                        Koru DAO
                    </h1>
                    <p className="koru-gradient-text-1 inline-block font-medium">
                        @Koru DAO
                    </p>
                    <textarea
                        disabled
                        rows={4} className="w-full p-4 mt-4"
                        placeholder="Hello, world!"
                    />
                </div>
            </div>
        </div>
    );
};
