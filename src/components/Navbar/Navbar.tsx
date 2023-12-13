// components/Navbar/Navbar.tsx
"use client";
import React, {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import NavbarCSS from './Navbar.module.css';
import {IoMenu} from "react-icons/io5";
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import {auth, signOut} from '../../lib/firebase/firebase';
import {useSelector, useDispatch} from 'react-redux';
import {logOut} from '../../store/slices/userSlice';
import {RootState} from '@/store/types/storeTypes';
import useRequireAuth from '@/hooks/useRequireAuth';


const Navbar: React.FC = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const {isLoginModalVisible, setIsLoginModalVisible, requireAuth} = useRequireAuth();
    const router = useRouter();
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

    const handleDesignLinkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (router.pathname !== '/') {
            const confirmLeave = window.confirm('You are about to leave this page, are you sure you want to go to the gift selection page?');
            if (confirmLeave) {
                router.push('/#designItems');
            }
        } else {
            router.push('/#designItems');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert('You have successfully logged out.');
            dispatch(logOut());
            window.location.href = '/';
        } catch (error) {
            alert('An error occurred, please try again later.');
        }
    };

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


    const handleLoginModal = () => {
        setIsLoginModalVisible(true);
    }

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
                    <Link href='/' className={NavbarCSS.leftContainer}>Gift For You</Link>
                </div>
                <IoMenu className={NavbarCSS.menuButton} onClick={toggleMenu} />
                <div className={`${NavbarCSS.rightContainer} ${menuVisible ? NavbarCSS.activeMenu : ''}`}>
                    <span className={NavbarCSS.rightContainerText} onClick={handleDesignLinkClick}>Select Gifts</span>
                    {isLoggedIn && (
                        <>
                            <Link href='/cart' className={NavbarCSS.rightContainerText}>Shopping Cart</Link>
                            <Link href='/order-information' className={NavbarCSS.rightContainerText}>Order History</Link>
                            <span className={NavbarCSS.login} onClick={handleSignOut}>Log Out</span>
                        </>
                    )}
                    {!isLoggedIn && (
                        <>
                            <span className={NavbarCSS.login} onClick={handleLoginModal}>Log In</span>
                            {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
                            <span className={NavbarCSS.register} onClick={handleRegisterModal}>Register</span>
                            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowLogin={setIsLoginModalVisible} />}
                        </>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
