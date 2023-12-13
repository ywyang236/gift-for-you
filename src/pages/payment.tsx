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
    const [orderName, setOrderName] = useState('Mario');
    const [orderEmail, setOrderEmail] = useState('mario@gmail.com');
    const [orderPhone, setOrderPhone] = useState('0912345678');
    const [receiverName, setReceiverName] = useState('Luigi');
    const [receiverAddress, setReceiverAddress] = useState('Zhongshan North Road, Section 2, Zhongshan District, Taipei City.');
    const [receiverPhone, setReceiverPhone] = useState('0912345678');
    const [isLoading, setIsLoading] = useState(false);

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
                console.log("User's payment information not found.");
            }
        } catch (error) {
            console.error('Error reading payment information:', error);
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
                        placeholder: 'CCV'
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
        setIsLoading(true);

        if (typeof window !== "undefined" && window.TPDirect) {
            const tappayStatus: TappayStatus = window.TPDirect.card.getTappayFieldsStatus() as TappayStatus;

            if (!orderName) {
                alert("Please enter the orderer's name.");
                return;
            }
            if (!orderEmail) {
                alert("Please enter the orderer's email address.");
                return;
            }
            if (!orderPhone) {
                alert("Please enter the orderer's mobile number.");
                return;
            }
            if (!receiverName) {
                alert("Please enter the recipient's name.");
                return;
            }
            if (!receiverAddress) {
                alert("Please enter the delivery address.");
                return;
            }
            if (!receiverPhone) {
                alert("Please enter the recipient's mobile number.");
                return;
            }

            if (!tappayStatus.canGetPrime) {
                alert('Credit card information is incorrect.');
                return;
            }

            const orderData = {
                name: orderName,
                email: orderEmail,
                phone: orderPhone,
                createdAt: new Date().toLocaleString('en-US', {hour12: true}),
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
        setIsLoading(false);
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
                        <div className={PaymentCSS.cartTitle}>Purchase Details</div>
                        <div className={PaymentCSS.cartContent}>
                            {paymentInfo && paymentInfo.items.map((item, index) => (
                                <div className={PaymentCSS.cartContentItem} key={index}>
                                    <div className={PaymentCSS.cartContentLeft}>
                                        {item.itemImage && <div className={PaymentCSS.cartContentBackground} style={{backgroundImage: `url(${item.itemImage})`}}></div>}
                                        {item.userCanvas && <div className={PaymentCSS.cartContentCanvas} style={{backgroundImage: `url(${item.userCanvas})`}}></div>}
                                    </div>
                                    <div className={PaymentCSS.cartContentRight}>
                                        <div className={PaymentCSS.cartContentText}>Product Name: {item.name}</div>
                                        <div className={PaymentCSS.cartContentText}>Product Accessories: {item.accessories}</div>
                                        <div className={PaymentCSS.cartContentText}>Customization: {item.customization}</div>
                                        <div className={PaymentCSS.cartContentText}>Unit Price: NT$ {item.price}</div>
                                        <div className={PaymentCSS.cartContentText}>
                                            Order Quantity: {item.quantity} {item.quantity % 2 === 0 ? 'sets' : 'set'}
                                        </div>
                                        <div className={PaymentCSS.cartContentText}>Product Amount: NT$ {item.subtotal}</div>
                                    </div>
                                </div>
                            ))}
                            {paymentInfo && (
                                <>
                                    <div className={PaymentCSS.cartContentFinal}>
                                        <div className={PaymentCSS.cartContentFinalContainer}>Payment Amount:
                                            <div className={PaymentCSS.cartContentTotal}>NT$ {paymentInfo.totalAmount}</div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={PaymentCSS.orderContainer}>
                        <div className={PaymentCSS.orderTitle}>Orderer Information</div>
                        <div className={PaymentCSS.orderContent}>
                            <div className={PaymentCSS.orderName}>Orderer:
                                <input
                                    className={PaymentCSS.orderNameInput}
                                    type="text"
                                    value={orderName}
                                    onChange={(e) => setOrderName(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.orderEmail}>Email:
                                <input
                                    className={PaymentCSS.orderEmailInput}
                                    type="text"
                                    value={orderEmail}
                                    onChange={(e) => setOrderEmail(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.orderPhone}>Mobile:
                                <input
                                    className={PaymentCSS.orderPhoneInput}
                                    type="text"
                                    value={orderPhone}
                                    onChange={(e) => setOrderPhone(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.orderNote}>Note: Normal customization takes about 5 - 8 working days. Urgent orders are subject to additional charges.</div>
                        </div>
                    </div>
                    <div className={PaymentCSS.recipientContainer}>
                        <div className={PaymentCSS.recipientTitle}>Recipient Information</div>
                        <div className={PaymentCSS.recipientContent}>
                            <div className={PaymentCSS.recipientName}>Recipient:
                                <input
                                    className={PaymentCSS.recipientNameInput}
                                    type="text"
                                    value={receiverName}
                                    onChange={(e) => setReceiverName(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.recipientAddress}>Address:
                                <input
                                    className={PaymentCSS.recipientAddressInput}
                                    type="text"
                                    value={receiverAddress}
                                    onChange={(e) => setReceiverAddress(e.target.value)}
                                />
                            </div>
                            <div className={PaymentCSS.recipientPhone}>Mobile:
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
                        <div className={PaymentCSS.cardTitle}>Credit Card Information</div>
                        <div className={PaymentCSS.cardContent}>
                            <div className={PaymentCSS.cardNumber}>Credit Card Number:：
                                <div className={PaymentCSS.tpfield} id="card-number"></div>
                            </div>
                            <div className={PaymentCSS.cardExpiry}>Expiry Date:
                                <div className={PaymentCSS.tpfield} id="card-expiration-date"></div>
                            </div>
                            <div className={PaymentCSS.cardCCV}>Security Code:
                                <div className={PaymentCSS.tpfield} id="card-ccv"></div>
                            </div>
                            <div className={PaymentCSS.checkoutButton} onClick={handleSubmit}>Confirm Payment</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Payment;
