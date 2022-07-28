export default function KoruModal(props: any) {

    return (
        <div className="koru-modal">

            <div className="relative">
                <div className="bg-white p-4 rounded-2xl">
                    {props?.content}
                </div>
                <span className="cursor-pointer p-3 absolute text-koru-purple icon-close top-1 right-3 hover:opacity-50" onClick={() => props?.close(false)} />
            </div>
        </div>
    );
}
