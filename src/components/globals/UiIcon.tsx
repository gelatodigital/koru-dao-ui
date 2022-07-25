import { useEffect, useState } from 'react';
import SVG from 'react-inlinesvg';

const modules = import.meta.glob('../assets/icons/**/*.svg', { as: 'raw' });

export default function UiIcon({ icon, classes }: any) {

    const [_icon, setIcons]: any = useState(null);
    const file = `icon-${icon}`;

    useEffect(() => {
        setIcons(modules['../assets/icons/' + file + '.svg']);
    }, [icon, modules]);

    return (
        <SVG src={_icon} className={classes} />
    );
};
