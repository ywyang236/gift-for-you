// pages/payment.tsx
import React from 'react';
import Layout from '../app/layout';
import PaymentCSS from '../styles/payment.module.css';

const Payment = () => (
    <Layout>
        <div className={PaymentCSS.main}>
            <div className={PaymentCSS.container}>
                <div className={PaymentCSS.cartContainer}>
                    <div className={PaymentCSS.cartTitle}>購買細節</div>
                    <div className={PaymentCSS.cartContent}>
                        <div className={PaymentCSS.cartContentLeft}>
                            <div className={PaymentCSS.cartContentBackground}></div>
                            <div className={PaymentCSS.cartContentCanvas}></div>
                        </div>
                        <div className={PaymentCSS.cartContentRight}>
                            <div className={PaymentCSS.cartContentText}>商品名稱：</div>
                            <div className={PaymentCSS.cartContentText}>商品配件：</div>
                            <div className={PaymentCSS.cartContentText}>訂製方式：</div>
                            <div className={PaymentCSS.cartContentText}>訂購數量：</div>
                            <div className={PaymentCSS.cartContentText}>訂單金額：</div>
                        </div>
                    </div>
                </div>
                <div className={PaymentCSS.orderContainer}>
                    <div className={PaymentCSS.orderTitle}>訂購人資訊</div>
                    <div className={PaymentCSS.orderContent}>
                        <div className={PaymentCSS.orderName}>訂購人：
                            <input className={PaymentCSS.orderNameInput} type="text" />
                        </div>
                        <div className={PaymentCSS.orderEmail}>電子信箱：
                            <input className={PaymentCSS.orderEmailInput} type="text" />
                        </div>
                        <div className={PaymentCSS.orderPhone}>手機號碼：
                            <input className={PaymentCSS.orderPhoneInput} type="text" />
                        </div>
                        <div className={PaymentCSS.orderNote}>備註：一般訂製約為 5 - 8 個工作天。急件費用另計。</div>
                    </div>
                </div>
                <div className={PaymentCSS.recipientContainer}>
                    <div className={PaymentCSS.recipientTitle}>收件人資訊</div>
                    <div className={PaymentCSS.recipientContent}>
                        <div className={PaymentCSS.recipientName}>收件人：
                            <input className={PaymentCSS.recipientNameInput} type="text" />
                        </div>
                        <div className={PaymentCSS.recipientAddress}>收件地址：
                            <input className={PaymentCSS.recipientAddressInput} type="text" />
                        </div>
                        <div className={PaymentCSS.recipientPhone}>手機號碼：
                            <input className={PaymentCSS.recipientPhoneInput} type="text" />
                        </div>
                    </div>
                </div>
                <div className={PaymentCSS.cardContainer}>
                    <div className={PaymentCSS.cardTitle}>信用卡資訊</div>
                    <div className={PaymentCSS.cardContent}>
                        <div className={PaymentCSS.cardName}>持卡人姓名：
                            <input className={PaymentCSS.cardNameInput} type="text" />
                        </div>
                        <div className={PaymentCSS.cardNumber}>信用卡卡號：
                            <input className={PaymentCSS.cardNumberInput} type="text" />
                        </div>
                        <div className={PaymentCSS.cardExpiry}>有效日期：
                            <input className={PaymentCSS.cardExpiryInput} type="text" />
                        </div>
                        <div className={PaymentCSS.cardCVV}>安全碼：
                            <input className={PaymentCSS.cardCVVInput} type="text" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

export default Payment;
