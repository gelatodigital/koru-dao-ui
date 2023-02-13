import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { KoruBox } from '../globals/KoruBox';
import UiIcon from '../globals/UiIcon';

export default function PostsBox() {

    const { publications }: any = useContext(AppContext);

    return (
        <div className="mt-20">
            <div className="flex justify-between items-center">
                <h3 className="bg-white rounded-2xl inline-block px-14 py-3 text-koru-purple-dark font-medium">
                    Posts
                </h3>
                <a
                    className="flex items-center gap-2 bg-[#1d9bf0] text-white rounded-xl px-3 py-1 hover:opacity-80 text-xs"
                    href="https://twitter.com/koru_dao"
                    target="_blank"
                >
                    <UiIcon icon="twitter" classes="w-5 h-5" />
                    KoruDAO on Twitter
                </a>
            </div>
            <div className="mt-10 rounded-2xl">
                <ul className="flex flex-col gap-6">
                    {publications?.map((publication: any) => (
                        <li
                            key={publication.id}
                        >
                            <KoruBox
                                content={
                                    <p className="mt-4">{`${publication.metadata.content}`}</p>
                                }
                                timestamp={new Date(publication.createdAt).getTime()}
                                publication={publication}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
