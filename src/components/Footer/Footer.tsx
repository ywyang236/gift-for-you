// components/Footer.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import FooterCSS from './Footer.module.css';
import {IoLogoGithub, IoLogoFacebook} from "react-icons/io5";
import { FaLink } from "react-icons/fa";
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
            const confirmLeave = window.confirm('You are about to leave this page. Are you sure you want to go to the gift selection page?');
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
                        <Link href='/' className={FooterCSS.footerLogoContent}></Link>
                        <Link href='/' className={FooterCSS.footerLogoContent}>Gift For You</Link>
                    </div>
                </div>
                <div className={FooterCSS.footerLeftContainer}>
                    <span className={FooterCSS.footerLeftContent} onClick={handleGiftSelectionClick}>Select Gifts</span>
                    <Link href='/cart' className={FooterCSS.footerLeftContent} onClick={requireAuth}>Shopping Cart</Link>
                    <Link href='/order-information' className={FooterCSS.footerLeftContent} onClick={requireAuth}>Order History</Link>
                </div>
                <div className={FooterCSS.footerRightContainer}>
                    <Link href='/about-gift-for-you' className={FooterCSS.footerRightContent}>About Website</Link>
                    <Link href='/about-author' className={FooterCSS.footerRightContent}>About Author</Link>
                </div>
                <div className={FooterCSS.footerContactContainer}>
                    <Link href='https://github.com/ywyang236/gift-for-you' target="_blank" className={FooterCSS.footerContact}>
                        <IoLogoGithub className={FooterCSS.footerContactLogo} />GitHub</Link>
                    <Link href='https://www.facebook.com/ywyang236/' target="_blank" className={FooterCSS.footerContact}>
                        <IoLogoFacebook className={FooterCSS.footerContactLogo} />Facebook</Link>
                    <Link href='https://yuweiyang.io/en' target="_blank" className={FooterCSS.footerContact}>
                        <FaLink className={FooterCSS.footerContactLogo} />Personal Website</Link>
                </div>
            </div>
            {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowLogin={setIsLoginModalVisible} />}
        </footer>
    );
};

export default Footer;
