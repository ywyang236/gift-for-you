/* eslint-disable react/no-unescaped-entities */
// components/LoginModal/LoginModal.tsx
"use client";
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import LoginModalCSS from './LoginModal.module.css';
import {IoClose} from "react-icons/io5";
import {signInWithPopup, auth, GoogleAuthProvider, signInWithEmailAndPassword} from '@/lib/firebase/firebase';
import {useDispatch} from 'react-redux';
import {logIn} from '@/store/slices/userSlice';

interface LoginModalProps {
    onClose: () => void;
    onShowRegister: (visible: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({onClose, onShowRegister}) => {
    const dispatch = useDispatch();

    const defaultEmail = 'guest@gift.com';
    const defaultPassword = 'password123';

    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState(defaultPassword);
    const [message, setMessage] = useState<string | null>(null);

    const handleRegularSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            dispatch(logIn());
            setMessage('Login successful.');
            onClose();
        } catch (error) {
            setMessage(`Login failed, please check if the account and password are correct.`);
        }
    };

    return ReactDOM.createPortal(
        <div className={LoginModalCSS.darkBackground} onClick={onClose}>
            <div className={LoginModalCSS.mainContainer} onClick={event => event.stopPropagation()}>
                <div className={LoginModalCSS.leftContainer}>
                    <div className={LoginModalCSS.logoImage}></div>
                    <div className={LoginModalCSS.webTitle}></div>
                    <div className={LoginModalCSS.webTitle}>Gift For You</div>
                </div>
                <div className={LoginModalCSS.rightContainer}>
                    <IoClose className={LoginModalCSS.closeButton} onClick={onClose} />
                    <div className={LoginModalCSS.loginTitle}>Log In Account</div>
                    <div className={LoginModalCSS.emailContainer}>
                        <label htmlFor="email" className={LoginModalCSS.emailTitle}>Email:</label>
                        <input type="email" placeholder="Email" value={email} className={LoginModalCSS.emailInput}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={LoginModalCSS.passwordContainer}>
                        <label htmlFor="password" className={LoginModalCSS.passwordTitle}>Password:</label>
                        <input type="password" placeholder="Password" value={password} className={LoginModalCSS.passwordInput}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className={LoginModalCSS.loginButton} onClick={handleRegularSignIn}>Login</button>
                    <div className={LoginModalCSS.registerContainer}>
                        <span className={LoginModalCSS.registerTitle}>Don't have an account?</span>
                        <span className={LoginModalCSS.registerLink} onClick={() => {
                            onClose();
                            onShowRegister(true);
                        }}>Click here to register</span>
                    </div>
                    {message && <div className={LoginModalCSS.loginMessageContainer}>{message}</div>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LoginModal;
