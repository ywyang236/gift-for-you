// components/LoginModal/LoginModal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import LoginModalCSS from './LoginModal.module.css';
import {IoClose} from "react-icons/io5";

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({onClose}) => {

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
                        <label htmlFor="email" className={LoginModalCSS.emailTitle}>會員信箱：</label>
                        <input type="email" id="email" className={LoginModalCSS.emailInput} />
                    </div>
                    <div className={LoginModalCSS.passwordContainer}>
                        <label htmlFor="password" className={LoginModalCSS.passwordTitle}>會員密碼：</label>
                        <input type="password" id="password" className={LoginModalCSS.passwordInput} />
                    </div>
                    <div className={LoginModalCSS.rememberContainer}>
                        <input type="checkbox" id="remember" className={LoginModalCSS.rememberInput} />
                        <label htmlFor="remember" className={LoginModalCSS.rememberTitle}>記住帳號密碼</label>
                    </div>
                    <button type="submit" className={LoginModalCSS.loginButton}>登入帳戶</button>
                    <div className={LoginModalCSS.registerContainer}>
                        <span className={LoginModalCSS.registerTitle}>還沒有帳戶？</span>
                        <span className={LoginModalCSS.registerLink}>點此註冊</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LoginModal;
