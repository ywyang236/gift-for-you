// components/Navbar/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import NavbarCSS from './Navbar.module.css';

const Navbar: React.FC = () => (
    <nav className={NavbarCSS.main}>
        <div className={NavbarCSS.container}>
            <div className={NavbarCSS.leftContainer}>
                <Link href='/' className={NavbarCSS.leftContainer}>禮品訂製所 Gift For You</Link>
            </div>
            <div className={NavbarCSS.rightContainer}>
                <Link href='/start-design' className={NavbarCSS.rightContainerText}>開始設計</Link>
                <Link href='/order-information' className={NavbarCSS.rightContainerText}>歷史訂單</Link>
                <Link href='/cart' className={NavbarCSS.rightContainerText}>購物車</Link>
                <Link href='/member-information' className={NavbarCSS.rightContainerText}>會員資料</Link>
                <span className={NavbarCSS.login}>登入</span>
                <span className={NavbarCSS.register}>註冊</span>
            </div>
        </div>
    </nav>
);

export default Navbar;
