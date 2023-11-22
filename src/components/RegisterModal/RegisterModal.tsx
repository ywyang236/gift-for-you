// src/components/RegisterModal/RegisterModal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import RegisterModalCSS from './RegisterModal.module.css';
import {IoClose} from "react-icons/io5";

interface RegisterModalProps {
    onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({onClose}) => {

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
                        <input type="text" id="name" className={RegisterModalCSS.nameInput} />
                    </div>
                    <div className={RegisterModalCSS.emailContainer}>
                        <label htmlFor="email" className={RegisterModalCSS.emailTitle}>會員信箱：</label>
                        <input type="email" id="email" className={RegisterModalCSS.emailInput} />
                    </div>
                    <div className={RegisterModalCSS.passwordContainer}>
                        <label htmlFor="password" className={RegisterModalCSS.passwordTitle}>會員密碼：</label>
                        <input type="password" id="password" className={RegisterModalCSS.passwordInput} />
                    </div>
                    <button type="submit" className={RegisterModalCSS.registerButton}>註冊新帳戶</button>
                    <div className={RegisterModalCSS.loginContainer}>
                        <span className={RegisterModalCSS.loginTitle}>已有帳戶了？</span>
                        <span className={RegisterModalCSS.loginLink}>點此登入</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RegisterModal;
