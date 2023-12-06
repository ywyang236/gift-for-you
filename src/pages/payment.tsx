// pages/payment.tsx
import React, {useEffect, useState} from 'react';
import Layout from '../app/layout';
import PaymentCSS from '../styles/payment.module.css';
import {db} from '../lib/firebase/firebase';
import {doc, getDoc} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import Script from 'next/script';

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

interface Window {
    TPDirect: any;
}

interface TappayStatus {
    canGetPrime: boolean;
}

interface TappayResult {
    status: number;
    msg: string;
    card: {
        prime: string;
    };
}


const Payment = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [orderName, setOrderName] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
    const [orderPhone, setOrderPhone] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');

    useEffect(() => {
        const isCheckoutInitiated = localStorage.getItem('isCheckoutInitiated');
        if (!isCheckoutInitiated) {
            window.location.href = '/';
        } else {
            localStorage.removeItem('isCheckoutInitiated');
        }

    }, []);

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

    useEffect(() => {
        const appId = 137136;
        const appKey = 'app_YlFT6NTU0WxvmwPuCXBCWlWDOFTCWaLSNO5coGRFCLu4I6Dbd4pQlVtNAVqe';

        const setupTPDirect = () => {
            if (window.TPDirect) {
                window.TPDirect.setupSDK(appId, appKey, 'sandbox');

                let fields = {
                    number: {
                        element: '#card-number',
                        placeholder: '**** **** **** ****'
                    },
                    expirationDate: {
                        element: document.getElementById('card-expiration-date'),
                        placeholder: 'MM / YY'
                    },
                    ccv: {
                        element: '#card-ccv',
                        placeholder: '後三碼'
                    }
                };
                window.TPDirect.card.setup({
                    fields: fields,
                    styles: {
                        'input': {
                            'color': 'gray'
                        },
                        ':focus': {
                            'color': 'black'
                        },
                        '.valid': {
                            'color': 'green'
                        },
                        '.invalid': {
                            'color': 'red'
                        },
                        '@media screen and (max-width: 400px)': {
                            'input': {
                                'color': 'orange'
                            }
                        }
                    },
                    isMaskCreditCardNumber: true,
                    maskCreditCardNumberRange: {
                        beginIndex: 6,
                        endIndex: 11
                    }
                });

            } else {
                setTimeout(setupTPDirect, 500);
            }
        };

        setupTPDirect();
    }, []);

    const handleSubmit = async (event: {preventDefault: () => void;}) => {
        event.preventDefault();

        if (typeof window !== "undefined" && window.TPDirect) {
            const tappayStatus: TappayStatus = window.TPDirect.card.getTappayFieldsStatus() as TappayStatus;

            if (!orderName) {
                alert('請輸入訂購人姓名。');
                return;
            }
            if (!orderEmail) {
                alert('請輸入訂購人電子信箱。');
                return;
            }
            if (!orderPhone) {
                alert('請輸入訂購人手機號碼。');
                return;
            }
            if (!receiverName) {
                alert('請輸入收件人姓名。');
                return;
            }
            if (!receiverAddress) {
                alert('請輸入收件地址。');
                return;
            }
            if (!receiverPhone) {
                alert('請輸入收件人手機號碼。');
                return;
            }

            if (!tappayStatus.canGetPrime) {
                alert('信用卡資訊填寫錯誤');
                return;
            }

            const orderData = {
                name: orderName,
                email: orderEmail,
                phone: orderPhone,
                createdAt: new Date().toLocaleString(),
                orderId: Math.floor(Math.random() * 1000000000),
                items: paymentInfo?.items,
                receiverName: receiverName,
                receiverAddress: receiverAddress,
                receiverPhone: receiverPhone,
            };

            window.TPDirect.card.getPrime(async (result: TappayResult) => {
                if (result.status !== 0) {
                    console.error('取得 prime 錯誤:', result.msg);
                    return;
                }
                const prime = result.card.prime;
                console.log('prime:', prime);

                try {
                    const response = await fetch('/api/payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            prime,
                            amount: paymentInfo?.totalAmount,
                            userId,
                            orderData,
                        }),
                    });

                    const responseData = await response.json();

                    if (responseData.data.payment.status === 0) {
                        window.location.href = '/thankyou';
                    } else {
                        alert(responseData.data.payment.message);
                    }

                } catch (error) {
                    console.error('付款請求失敗:', error);
                }
            });
        }
    };

    return (
        <Layout>
            <Script
                src="https://js.tappaysdk.com/sdk/tpdirect/v5.17.0"
                strategy="afterInteractive"
            />
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
                                        <div className={PaymentCSS.cartContentFinalContainer}>付款金額：
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
                                <input
                                    className={PaymentCSS.orderNameInput}
                                    type="text"
                                    value={orderName}
                                    onChange={(e) => setOrderName(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.orderEmail}>電子信箱：
                                <input
                                    className={PaymentCSS.orderEmailInput}
                                    type="text"
                                    value={orderEmail}
                                    onChange={(e) => setOrderEmail(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.orderPhone}>手機號碼：
                                <input
                                    className={PaymentCSS.orderPhoneInput}
                                    type="text"
                                    value={orderPhone}
                                    onChange={(e) => setOrderPhone(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.orderNote}>備註：一般訂製約為 5 - 8 個工作天。急件費用另計。</div>
                        </div>
                    </div>
                    <div className={PaymentCSS.recipientContainer}>
                        <div className={PaymentCSS.recipientTitle}>收件人資訊</div>
                        <div className={PaymentCSS.recipientContent}>
                            <div className={PaymentCSS.recipientName}>收件人：
                                <input
                                    className={PaymentCSS.recipientNameInput}
                                    type="text"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.recipientAddress}>收件地址：
                                <input
                                    className={PaymentCSS.recipientAddressInput}
                                    type="text"
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.recipientPhone}>手機號碼：
                                <input
                                    className={PaymentCSS.recipientPhoneInput}
                                    type="text"
                                    value={receiverPhone}
                                    onChange={(e) => setReceiverPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={PaymentCSS.cardContainer}>
                        <div className={PaymentCSS.cardTitle}>信用卡資訊</div>
                        <div className={PaymentCSS.cardContent}>
                            <div className={PaymentCSS.cardNumber}>信用卡卡號：
                                <div className={PaymentCSS.tpfield} id="card-number"></div>
                            </div>
                            <div className={PaymentCSS.cardExpiry}>有效日期：
                                <div className={PaymentCSS.tpfield} id="card-expiration-date"></div>
                            </div>
                            <div className={PaymentCSS.cardCCV}>安全碼：
                                <div className={PaymentCSS.tpfield} id="card-ccv"></div>
                            </div>
                            <div className={PaymentCSS.checkoutButton} onClick={handleSubmit}>確認付款</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Payment;
