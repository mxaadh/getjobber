import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src="/logo.png" alt="Logo" style={{
            objectFit: 'cover',
            width: '250px',
        }} />
    );
}
