/* eslint-disable react/no-unescaped-entities */
// pages/order-info.tsx
import React, {useState, useEffect} from 'react';
import Layout from '../app/layout';
import OrderCSS from '../styles/order.module.css';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {db} from '../lib/firebase/firebase';
import {doc, getDoc} from 'firebase/firestore';
import {IoClose} from "react-icons/io5";

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
                console.log('No user order information found.');
            }
        } catch (error) {
            console.error('Error while reading order information:', error);
        }
    };


    const toggleContainer = (index: number) => {
        setSelectedOrderIndex(index);
        setShowContainer(!showContainer);
    };

    const closeModal = () => {
        setShowContainer(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: {key: string;}) => {
            if (e.key === 'Escape') {
                setShowContainer(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <Layout>
            <div className={OrderCSS.main}>
                <div className={OrderCSS.backgroundContainer}>
                    {orders.map((order, index) => (
                        <div key={index} className={OrderCSS.orderContainerInformationOutside} onClick={() => toggleContainer(index)}>
                            <div className={OrderCSS.orderNumber}>Order Number: {order.orderId}</div>
                            <div className={OrderCSS.orderDate}>Order Date: {order.createdAt}</div>
                            <div className={OrderCSS.orderAmount}>Payment Amount: NT$ {order.amount}</div>
                            <div className={OrderCSS.orderStatus}>Payment Status: {order.status}</div>
                        </div>
                    ))}
                    {showContainer && selectedOrderIndex !== null && (
                        <div className={OrderCSS.modalOverlay} onClick={closeModal}>
                            <div className={`${OrderCSS.orderContainerInformationInside}`} onClick={e => e.stopPropagation()}>
                                <IoClose onClick={closeModal} className={OrderCSS.closeButton} />
                                <div className={OrderCSS.orderInformation}>
                                    <div className={OrderCSS.orderName}>Orderer: {orders[selectedOrderIndex].name}</div>
                                    <div className={OrderCSS.orderEmail}>Email: {orders[selectedOrderIndex].email}</div>
                                    <div className={OrderCSS.orderPhone}>Orderer's Mobile: {orders[selectedOrderIndex].phone}</div>
                                    <div className={OrderCSS.orderReceiver}>Recipient: {orders[selectedOrderIndex].receiverName}</div>
                                    <div className={OrderCSS.orderReceiverAddress}>Address: {orders[selectedOrderIndex].receiverAddress}</div>
                                    <div className={OrderCSS.orderReceiverPhone}>Recipient's Mobile: {orders[selectedOrderIndex].receiverPhone}</div>
                                </div>
                                <div className={OrderCSS.orderItemInformation}>
                                    {orders[selectedOrderIndex].items.map((item, idx) => (
                                        <div key={idx} className={OrderCSS.orderItemContainer}>
                                            <div className={OrderCSS.cartContentLeft}>
                                                <div className={OrderCSS.cartContentBackground} style={{backgroundImage: `url(${item.itemImage})`}}></div>
                                                <div className={OrderCSS.cartContentCanvas} style={{backgroundImage: `url(${item.userCanvas})`}}></div>
                                            </div>
                                            <div className={OrderCSS.cartContentRight}>
                                                <div className={OrderCSS.cartContentText}>Product Name: {item.itemName}</div>
                                                <div className={OrderCSS.cartContentText}>Accessories:{item.itemAccessories}</div>
                                                <div className={OrderCSS.cartContentText}>Customization: {item.itemCustomization}</div>
                                                <div className={OrderCSS.cartContentText}>Unit Price: NT$ {item.itemPrice}</div>
                                                <div className={OrderCSS.cartContentText}>
                                                    Quantity Ordered: {item.itemQuantity} {item.itemQuantity % 2 === 0 ? 'sets' : 'set'}
                                                </div>
                                                <div className={OrderCSS.cartContentText}>Total Price: NT$ {item.itemSubtotal}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout >
    );
};

export default OrderInformation;
