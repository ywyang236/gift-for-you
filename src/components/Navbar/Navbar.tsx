// components/Navbar/Navbar.tsx
"use client";
import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavbarCSS from './Navbar.module.css';
import {IoMenu} from "react-icons/io5";
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';

const Navbar: React.FC = () => {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setMenuVisible(prev => !prev);
    };

    const closeMenu = useCallback((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const menuButton = document.querySelector(`.${NavbarCSS.menuButton}`) as HTMLElement;
        if (menuVisible && target && !menuButton.contains(target) && !target.closest(`.${NavbarCSS.rightContainer}`)) {
            setMenuVisible(false);
        }
    }, [menuVisible]);

    useEffect(() => {
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, [menuVisible, closeMenu]);

    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    const handleLoginModal = () => {
        setIsLoginModalVisible(true);
    }

    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

    const handleRegisterModal = () => {
        setIsRegisterModalVisible(true);
    }

    return (
        <nav className={NavbarCSS.main}>
            <div className={NavbarCSS.container}>
                <div className={NavbarCSS.leftContainer}>
                    <Image
                        src="/favicon.ico"
                        alt="Logo"
                        width={25}
                        height={25}
                        className={NavbarCSS.leftContainerIcon}
                    />
                    <Link href='/' className={NavbarCSS.leftContainer}>禮品訂製所 Gift For You</Link>
                </div>
                <IoMenu className={NavbarCSS.menuButton} onClick={toggleMenu} />
                <div className={`${NavbarCSS.rightContainer} ${menuVisible ? NavbarCSS.activeMenu : ''}`}>
                    <Link href='/start-design' className={NavbarCSS.rightContainerText}>開始設計</Link>
                    <Link href='/order-information' className={NavbarCSS.rightContainerText}>歷史訂單</Link>
                    <Link href='/cart' className={NavbarCSS.rightContainerText}>購物車</Link>
                    <Link href='/member-information' className={NavbarCSS.rightContainerText}>會員資料</Link>
                    <span className={NavbarCSS.login} onClick={handleLoginModal}>登入</span>
                    {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
                    <span className={NavbarCSS.register} onClick={handleRegisterModal}>註冊</span>
                    {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowLogin={setIsLoginModalVisible} />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
