// pages/payment.tsx
import React, {useEffect, useState} from 'react';
import Layout from '../app/layout';
import PaymentCSS from '../styles/payment.module.css';
import {db} from '../lib/firebase/firebase';
import {doc, getDoc} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

interface PaymentInfo {
    items: Array<{
        name: string;
        accessories: string;
        customization: string;
        price: number;
        quantity: number;
        amount: number;
        subtotal: number;
        itemImage: string;
        userCanvas: string;
    }>;
    totalAmount: number;
    discount: number;
    shippingFee: number;
}

const Payment = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchPaymentInfo(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPaymentInfo = async (uid: string) => {
        try {
            const userPaymentRef = doc(db, "users", uid, "data", "user_payment");
            const docSnap = await getDoc(userPaymentRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as PaymentInfo;
                setPaymentInfo(data);
            } else {
                console.log('沒有找到使用者的付款資訊');
            }
        } catch (error) {
            console.error('讀取付款資訊時出錯:', error);
        }
    };

    return (
        <Layout>
            <div className={PaymentCSS.main}>
                <div className={PaymentCSS.container}>
                    <div className={PaymentCSS.cartContainer}>
                        <div className={PaymentCSS.cartTitle}>購買細節</div>
                        <div className={PaymentCSS.cartContent}>
                            {paymentInfo && paymentInfo.items.map((item, index) => (
                                <div className={PaymentCSS.cartContentItem} key={index}>
                                    <div className={PaymentCSS.cartContentLeft}>
                                        {item.itemImage && <div className={PaymentCSS.cartContentBackground} style={{backgroundImage: `url(${item.itemImage})`}}></div>}
                                        {item.userCanvas && <div className={PaymentCSS.cartContentCanvas} style={{backgroundImage: `url(${item.userCanvas})`}}></div>}
                                    </div>
                                    <div className={PaymentCSS.cartContentRight}>
                                        <div className={PaymentCSS.cartContentText}>商品名稱：{item.name}</div>
                                        <div className={PaymentCSS.cartContentText}>商品配件：{item.accessories}</div>
                                        <div className={PaymentCSS.cartContentText}>訂製方式：{item.customization}</div>
                                        <div className={PaymentCSS.cartContentText}>商品單價：{item.price}</div>
                                        <div className={PaymentCSS.cartContentText}>訂購數量：{item.quantity}</div>
                                        <div className={PaymentCSS.cartContentText}>商品金額：{item.subtotal}</div>
                                    </div>
                                </div>
                            ))}
                            {paymentInfo && (
                                <>
                                    <div className={PaymentCSS.cartContentFinal}>
                                        <div className={PaymentCSS.cartContentFinalContainer}>總付款金額：
                                            <div className={PaymentCSS.cartContentTotal}>新台幣 {paymentInfo.totalAmount} 元</div>
                                        </div>
                                    </div>
                                </>
                            )}
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
}

export default Payment;
