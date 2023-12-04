// pages/order-info.tsx
import React, {useState, useEffect} from 'react';
import Layout from '../app/layout';
import OrderCSS from '../styles/order.module.css';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {db} from '../lib/firebase/firebase';
import {doc, getDoc} from 'firebase/firestore';

interface Order {
    createdAt: string;
    orderId: string;
    amount: number;
    status: string;
    name: string;
    email: string;
    phone: string;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    items: Item[];
}

interface Item {
    itemImage: string;
    userCanvas: string;
    itemName: string;
    itemPrice: number;
    itemQuantity: number;
    itemSubtotal: number;
    itemAccessories: string[];
    itemCustomization: string[];
}

const OrderInformation = () => {
    const [showContainer, setShowContainer] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchOrders(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchOrders = async (uid: string) => {
        try {
            const userOrdersRef = doc(db, "users", uid, "data", "user_checkout");
            const docSnap = await getDoc(userOrdersRef);

            if (docSnap.exists() && docSnap.data().payments && docSnap.data().payments.length > 0) {
                const paymentsArray = docSnap.data().payments;
                const ordersWithOrderId = paymentsArray.map((payments: {orderData: any, paymentDetails: any, paymentStatus: any}) => ({
                    ...payments.orderData,
                    amount: payments.paymentDetails.amount,
                    status: payments.paymentStatus,
                    name: payments.orderData.name,
                    email: payments.orderData.email,
                    phone: payments.orderData.phone,
                    reciverName: payments.orderData.receiverName,
                    receiverAddress: payments.orderData.receiverAddress,
                    receiverPhone: payments.orderData.receiverPhone,
                    items: payments.orderData.items.map((item: any) => ({
                        itemImage: item.itemImage,
                        userCanvas: item.userCanvas,
                        itemName: item.name,
                        itemPrice: item.price,
                        itemQuantity: item.quantity,
                        itemSubtotal: item.subtotal,
                        itemAccessories: item.accessories,
                        itemCustomization: item.customization,
                    })),
                }));

                setOrders(ordersWithOrderId);
            } else {
                console.log('沒有找到用戶的訂單信息');
            }
        } catch (error) {
            console.error('讀取訂單信息時出錯:', error);
        }
    };


    const toggleContainer = (index: number) => {
        setSelectedOrderIndex(index);
        setShowContainer(!showContainer);
    };

    return (
        <Layout>
            <div className={OrderCSS.main}>
                <div className={OrderCSS.backgroundContainer}>
                    {orders.map((order, index) => (
                        <div key={index} className={OrderCSS.orderContainer} onClick={() => toggleContainer(index)}>
                            <div className={OrderCSS.orderNumber}>訂單編號：{order.orderId}</div>
                            <div className={OrderCSS.orderDate}>訂購日期：{order.createdAt}</div>
                            <div className={OrderCSS.orderAmount}>付款金額：{order.amount}</div>
                            <div className={OrderCSS.orderStatus}>付款狀態：{order.status}</div>
                        </div>
                    ))}
                    {showContainer && selectedOrderIndex !== null && (
                        <div className={`${OrderCSS.ordarContainer} ${OrderCSS['slide-enter-active']}`}>
                            <div className={OrderCSS.orderInformation}>
                                <div className={OrderCSS.orderName}>訂購人：{orders[selectedOrderIndex].name}</div>
                                <div className={OrderCSS.orderEmail}>電子信箱：{orders[selectedOrderIndex].email}</div>
                                <div className={OrderCSS.orderPhone}>訂購人手機號碼：{orders[selectedOrderIndex].phone}</div>
                                <div className={OrderCSS.orderReceiver}>收件人：{orders[selectedOrderIndex].receiverName}</div>
                                <div className={OrderCSS.orderReceiverAddress}>收件地址：{orders[selectedOrderIndex].receiverAddress}</div>
                                <div className={OrderCSS.orderReceiverPhone}>收件者手機號碼：{orders[selectedOrderIndex].receiverPhone}</div>
                            </div>
                            <div className={OrderCSS.orderItemInformation}>
                                {orders[selectedOrderIndex].items.map((item, idx) => (
                                    <div key={idx} className={OrderCSS.orderItemContainer}>
                                        <div className={OrderCSS.cartContentLeft}>
                                            <div className={OrderCSS.cartContentBackground} style={{backgroundImage: `url(${item.itemImage})`}}></div>
                                            <div className={OrderCSS.cartContentCanvas} style={{backgroundImage: `url(${item.userCanvas})`}}></div>
                                        </div>
                                        <div className={OrderCSS.cartContentRight}>
                                            <div className={OrderCSS.cartContentText}>商品名稱：{item.itemName}</div>
                                            <div className={OrderCSS.cartContentText}>商品配件：{item.itemAccessories}</div>
                                            <div className={OrderCSS.cartContentText}>訂製方式：{item.itemCustomization}</div>
                                            <div className={OrderCSS.cartContentText}>商品單價：{item.itemPrice}</div>
                                            <div className={OrderCSS.cartContentText}>訂購數量：{item.itemQuantity}</div>
                                            <div className={OrderCSS.cartContentText}>商品金額：{item.itemSubtotal}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout >
    );
};

export default OrderInformation;
