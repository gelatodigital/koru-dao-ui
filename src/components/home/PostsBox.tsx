import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { KoruBox } from '../globals/KoruBox';

export default function PostsBox() {

    const { publications, canUserPost }: any = useContext(AppContext);

    return (
        <div className="mt-20">
            <h3 className="bg-white rounded-2xl inline-block px-14 py-3 text-koru-purple-dark font-medium">
                Posts
            </h3>
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
