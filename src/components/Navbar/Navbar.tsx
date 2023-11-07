// components/Navbar/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import NavbarCSS from './Navbar.module.css';

const Navbar: React.FC = () => (
    <nav className={NavbarCSS.container}>
        <span>
            <Link href='/'>禮品訂製所 Gift For You</Link>
        </span>
        <Link href='/start-design'>開始設計</Link>
        <Link href='/order-information'>歷史訂單</Link>
        <Link href='/member-information'>會員資料</Link>
    </nav>
);

export default Navbar;
