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
            setMessage('註冊成功');
        } catch (error) {
            console.error('Error signing up:', error);
            setMessage(`註冊失敗: ${(error as Error).message}`);
        }
    };

    const handleSignUpClick = () => {
        const emailInput = document.getElementById('signupEmail') as HTMLInputElement;
        const passwordInput = document.getElementById('signupPassword') as HTMLInputElement;

        if (emailInput && passwordInput) {
            if (emailInput.value && passwordInput.value) {
                handleSignUp(emailInput.value, passwordInput.value);
            } else {
                setMessage('請填寫完整訊息');
            }
        }
    };

    return ReactDOM.createPortal(
        <div className={RegisterModalCSS.darkBackground} onClick={onClose}>
            <div className={RegisterModalCSS.mainContainer} onClick={event => event.stopPropagation()}>
                <div className={RegisterModalCSS.leftContainer}>
                    <div className={RegisterModalCSS.logoImage}></div>
                    <div className={RegisterModalCSS.webTitle}>禮品訂製所</div>
                    <div className={RegisterModalCSS.webTitle}>Gift For You</div>
                </div>
                <div className={RegisterModalCSS.rightContainer}>
                    <IoClose className={RegisterModalCSS.closeButton} onClick={onClose} />
                    <div className={RegisterModalCSS.registerTitle}>註冊會員帳號</div>
                    <div className={RegisterModalCSS.emailContainer}>
                        <label htmlFor="text" className={RegisterModalCSS.nameTitle}>會員姓名：</label>
                        <input type="text" placeholder="Name" id="signupname" className={RegisterModalCSS.nameInput} />
                    </div>
                    <div className={RegisterModalCSS.emailContainer}>
                        <label htmlFor="email" className={RegisterModalCSS.emailTitle}>會員帳號：</label>
                        <input type="email" placeholder="Email" id="signupEmail" className={RegisterModalCSS.emailInput} />
                    </div>
                    <div className={RegisterModalCSS.passwordContainer}>
                        <label htmlFor="password" className={RegisterModalCSS.passwordTitle}>會員密碼：</label>
                        <input type="password" placeholder="Password" id="signupPassword" className={RegisterModalCSS.passwordInput} />
                    </div>
                    <button type="submit" className={RegisterModalCSS.registerButton} onClick={handleSignUpClick}>註冊新帳戶</button>
                    <div className={RegisterModalCSS.loginContainer}>
                        <span className={RegisterModalCSS.loginTitle}>已有帳戶了？</span>
                        <span className={RegisterModalCSS.loginLink} onClick={() => {
                            onClose();
                            onShowLogin(true);
                        }}>點此登入</span>
                    </div>
                    {message && <div className={RegisterModalCSS.registerMessageContainer}>{message}</div>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RegisterModal;
