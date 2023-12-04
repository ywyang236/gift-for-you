// components/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import FooterCSS from './Footer.module.css';
import {IoLogoGithub, IoLogoFacebook} from "react-icons/io5";
import {FaBlogger} from "react-icons/fa6";
import useRequireAuth from '@/hooks/useRequireAuth';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import {useRouter} from 'next/router';

const Footer: React.FC = () => {
    const {isLoginModalVisible, setIsLoginModalVisible, requireAuth} = useRequireAuth();
    const [isRegisterModalVisible, setIsRegisterModalVisible] = React.useState(false);
    const router = useRouter();

    const handleGiftSelectionClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (router.pathname !== '/') {
            const confirmLeave = window.confirm('您即將離開此頁面，確定要前往挑選禮品的頁面嗎？');
            if (confirmLeave) {
                router.push('/#designItems');
            }
        } else {
            router.push('/#designItems');
        }
    };

    return (
        <footer className={FooterCSS.footer}>
            <div className={FooterCSS.footerContainer}>
                <div className={FooterCSS.footerLogoContainer}>
                    <Link href='/' className={FooterCSS.footerLogo}></Link>
                    <div className={FooterCSS.footerLogoContentContainer}>
                        <Link href='/' className={FooterCSS.footerLogoContent}>禮品訂製所</Link>
                        <Link href='/' className={FooterCSS.footerLogoContent}>Gift For You</Link>
                    </div>
                </div>
                <div className={FooterCSS.footerLeftContainer}>
                    <span className={FooterCSS.footerLeftContent} onClick={handleGiftSelectionClick}>挑選禮品</span>
                    <Link href='/cart' className={FooterCSS.footerLeftContent} onClick={requireAuth}>購物車</Link>
                    <Link href='/order-information' className={FooterCSS.footerLeftContent} onClick={requireAuth}>歷史訂單</Link>
                </div>
                <div className={FooterCSS.footerRightContainer}>
                    <Link href='/about-gift-for-you' className={FooterCSS.footerRightContent}>關於禮品訂製所</Link>
                    <Link href='/about-author' className={FooterCSS.footerRightContent}>關於作者</Link>
                </div>
                <div className={FooterCSS.footerContactContainer}>
                    <Link href='https://github.com/ywyang236/gift-for-you' target="_blank" className={FooterCSS.footerContact}>
                        <IoLogoGithub className={FooterCSS.footerContactLogo} />GitHub</Link>
                    <Link href='https://www.facebook.com/ywyang236/' target="_blank" className={FooterCSS.footerContact}>
                        <IoLogoFacebook className={FooterCSS.footerContactLogo} />Facebook</Link>
                    <Link href='https://ywyang236.blogspot.com/' target="_blank" className={FooterCSS.footerContact}>
                        <FaBlogger className={FooterCSS.footerContactLogo} />Blogger</Link>
                </div>
            </div>
            {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowLogin={setIsLoginModalVisible} />}
        </footer>
    );
};

export default Footer;
