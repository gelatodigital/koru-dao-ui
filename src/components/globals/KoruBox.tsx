import UiIcon from './UiIcon';
import { CountUpTimer } from './CountUpTimer';

export function KoruBox(props: any) {
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
                        <p className="text-sm opacity-40">
                            <CountUpTimer timestamp={props.timestamp} /> ago
                        </p>
                    </div>
                    <div>
                        {props.content}
                    </div>
                    <div>
                        <ul>
                            {Object.keys(props.publication.stats).map((key: string) => (
                                <li key={key}>
                                    {key}: {props.publication.stats[key]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
