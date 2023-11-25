// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import FooterCSS from './Footer.module.css';
import {IoLogoGithub, IoLogoFacebook} from "react-icons/io5";
import {FaBlogger} from "react-icons/fa6";

const Footer: React.FC = () => (
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
                <Link href='/start-design' className={FooterCSS.footerLeftContent}>開始設計</Link>
                <Link href='/order-information' className={FooterCSS.footerLeftContent}>歷史訂單</Link>
                <Link href='/cart' className={FooterCSS.footerLeftContent}>會員資料</Link>
            </div>
            <div className={FooterCSS.footerRightContainer}>
                <div className={FooterCSS.footerRightContent}>關於禮品訂製所</div>
                <div className={FooterCSS.footerRightContent}>關於作者</div>
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
    </footer>
);

export default Footer;
