import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src="/icon.jpg" alt="Logo" style={{
            objectFit: 'cover',
            width: '250px',
        }} />
    );
}
