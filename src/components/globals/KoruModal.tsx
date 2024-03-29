export default function KoruModal(props: any) {

    return (
        <div className="koru-modal z-10">

            <div className="relative">
                <div className="bg-white p-4 rounded-2xl">
                    {props?.modal}
                </div>
                <span className="cursor-pointer p-3 absolute text-koru-purple icon-close top-1 right-3 hover:opacity-50" onClick={() => props?.close(false)} />
            </div>
        </div>
    );
}
