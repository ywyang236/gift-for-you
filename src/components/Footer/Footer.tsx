// components/Footer.tsx
import React from 'react';
import FooterCSS from './Footer.module.css';

const Footer: React.FC = () => (
    <footer className={FooterCSS.footer}>
        <p>版權 © 2023 禮品訂製所 Gift For You。保留所有權利。</p>
    </footer>
);

export default Footer;
