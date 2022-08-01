import UiIcon from './UiIcon';
import { CountTimer } from './CountTimer';

export function KoruBox(props: any) {

    const statsMap: any = [
        {
            key: 'totalAmountOfComments',
            icon: 'comment',
            color: '#4085F3',
        },
        {
            key: 'totalAmountOfMirrors',
            icon: 'mirror',
            color: '#8B62F3',
        },
        {
            key: 'totalAmountOfCollects',
            icon: 'collect',
            color: '#ED4649',
        },
    ];

    return (
        <div className="koru-box !p-6">
            <div className="flex gap-4">
                <UiIcon icon="logo-pic" classes="w-12 h-12" />
                <div className="w-full">
                    <div className="flex justify-between">
                        <div>
                            <h1 className="font-medium">
                                Koru DAO
                            </h1>
                            <p className="koru-gradient-text-1 inline-block font-medium">
                                @Koru DAO
                            </p>
                        </div>
                        <div className="text-sm opacity-40">
                            <CountTimer timestamp={props.timestamp} /> ago
                        </div>
                    </div>
                    <div>
                        {props.content}
                    </div>
                    <div>
                        <ul className="flex gap-8 mt-6">
                            {statsMap.map((stat: any) => (
                                <li key={stat.key}
                                    className="flex gap-2 text-sm"
                                    style={{ color: stat.color }}
                                >
                                    <UiIcon icon={stat.icon} classes="w-5 h-5" /> {props.publication.stats[stat.key]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
