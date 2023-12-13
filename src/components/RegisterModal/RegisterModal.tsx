// src/components/RegisterModal/RegisterModal.tsx
"use client";
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import RegisterModalCSS from './RegisterModal.module.css';
import {IoClose} from "react-icons/io5";
import {auth, createUserWithEmailAndPassword} from "../../lib/firebase/firebase";

interface RegisterModalProps {
    onClose: () => void;
    onShowLogin: (visible: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({onClose, onShowLogin}) => {
    const [message, setMessage] = useState<string | null>(null);

    const handleSignUp = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage('Registration successful.');
        } catch (error) {
            setMessage(`An error occurred, please try again later.`);
        }
    };

    const handleSignUpClick = () => {
        const emailInput = document.getElementById('signupEmail') as HTMLInputElement;
        const passwordInput = document.getElementById('signupPassword') as HTMLInputElement;

        if (emailInput && passwordInput) {
            if (emailInput.value && passwordInput.value) {
                handleSignUp(emailInput.value, passwordInput.value);
            } else {
                setMessage('Please complete all fields.');
            }
        }
    };

    return ReactDOM.createPortal(
        <div className={RegisterModalCSS.darkBackground} onClick={onClose}>
            <div className={RegisterModalCSS.mainContainer} onClick={event => event.stopPropagation()}>
                <div className={RegisterModalCSS.leftContainer}>
                    <div className={RegisterModalCSS.logoImage}></div>
                    <div className={RegisterModalCSS.webTitle}></div>
                    <div className={RegisterModalCSS.webTitle}>Gift For You</div>
                </div>
                <div className={RegisterModalCSS.rightContainer}>
                    <IoClose className={RegisterModalCSS.closeButton} onClick={onClose} />
                    <div className={RegisterModalCSS.registerTitle}>Register Account</div>
                    <div className={RegisterModalCSS.emailContainer}>
                        <label htmlFor="text" className={RegisterModalCSS.nameTitle}>Name:</label>
                        <input type="text" placeholder="Name" id="signupname" className={RegisterModalCSS.nameInput} />
                    </div>
                    <div className={RegisterModalCSS.emailContainer}>
                        <label htmlFor="email" className={RegisterModalCSS.emailTitle}>Email:</label>
                        <input type="email" placeholder="Email" id="signupEmail" className={RegisterModalCSS.emailInput} />
                    </div>
                    <div className={RegisterModalCSS.passwordContainer}>
                        <label htmlFor="password" className={RegisterModalCSS.passwordTitle}>Password:</label>
                        <input type="password" placeholder="Password" id="signupPassword" className={RegisterModalCSS.passwordInput} />
                    </div>
                    <button type="submit" className={RegisterModalCSS.registerButton} onClick={handleSignUpClick}>Register New Account</button>
                    <div className={RegisterModalCSS.loginContainer}>
                        <span className={RegisterModalCSS.loginTitle}>Already have an account?</span>
                        <span className={RegisterModalCSS.loginLink} onClick={() => {
                            onClose();
                            onShowLogin(true);
                        }}>Click here to log in</span>
                    </div>
                    {message && <div className={RegisterModalCSS.registerMessageContainer}>{message}</div>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RegisterModal;
