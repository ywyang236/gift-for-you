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

    const defaultEmail = 'test@example.com';
    const defaultPassword = 'password123';

    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState(defaultPassword);
    const [message, setMessage] = useState<string | null>(null);

    const handleRegularSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            dispatch(logIn());
            setMessage('登入成功');
            onClose();
        } catch (error) {
            setMessage(`登入失敗，請檢查帳號密碼是否正確`);
        }
    };

    return ReactDOM.createPortal(
        <div className={LoginModalCSS.darkBackground} onClick={onClose}>
            <div className={LoginModalCSS.mainContainer} onClick={event => event.stopPropagation()}>
                <div className={LoginModalCSS.leftContainer}>
                    <div className={LoginModalCSS.logoImage}></div>
                    <div className={LoginModalCSS.webTitle}>禮品訂製所</div>
                    <div className={LoginModalCSS.webTitle}>Gift For You</div>
                </div>
                <div className={LoginModalCSS.rightContainer}>
                    <IoClose className={LoginModalCSS.closeButton} onClick={onClose} />
                    <div className={LoginModalCSS.loginTitle}>登入會員帳號</div>
                    <div className={LoginModalCSS.emailContainer}>
                        <label htmlFor="email" className={LoginModalCSS.emailTitle}>會員帳號：</label>
                        <input type="email" placeholder="Email" value={email} className={LoginModalCSS.emailInput}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={LoginModalCSS.passwordContainer}>
                        <label htmlFor="password" className={LoginModalCSS.passwordTitle}>會員密碼：</label>
                        <input type="password" placeholder="Password" value={password} className={LoginModalCSS.passwordInput}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={LoginModalCSS.rememberContainer}>
                        <input type="checkbox" id="remember" className={LoginModalCSS.rememberInput} checked={true} />
                        <label htmlFor="remember" className={LoginModalCSS.rememberTitle}>記住帳號密碼</label>
                    </div>
                    <button type="submit" className={LoginModalCSS.loginButton} onClick={handleRegularSignIn}>登入帳戶</button>
                    <div className={LoginModalCSS.registerContainer}>
                        <span className={LoginModalCSS.registerTitle}>還沒有帳戶？</span>
                        <span className={LoginModalCSS.registerLink} onClick={() => {
                            onClose();
                            onShowRegister(true);
                        }}>點此註冊</span>
                    </div>
                    {message && <div className={LoginModalCSS.loginMessageContainer}>{message}</div>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LoginModal;
