// pages/cart.tsx
import React, {useState, useEffect} from 'react';
import Layout from '../app/layout';
import CartCSS from '../styles/cart.module.css';
import {IoClose} from "react-icons/io5";
import {db} from '../lib/firebase/firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {getStorage, ref, getDownloadURL} from "firebase/storage";
import {collection, query, where, getDocs} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import Image from 'next/image';

interface CartItem {
    canvasImage: string;
    name: string;
    image: string;
    accessories: string;
    customization: string;
    price: number;
    quantity: number;
}

const Cart = () => {
    const [imageUrl, setImageUrl] = useState('');
    const shippingFee = 65;
    const [totalAmount, setTotalAmount] = useState(shippingFee);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    const handleRemoveItem = async (itemIndex: number) => {
        const itemToRemove = cartItems[itemIndex];
        const updatedItems = cartItems.filter((_, idx) => idx !== itemIndex);

        try {
            if (userId) {
                const userCartRef = doc(db, "users", userId, "data", "user_cart");
                await updateDoc(userCartRef, {
                    items: updatedItems
                });
                setCartItems(updatedItems);
                console.log('項目成功刪除');
            };
        } catch (error) {
            console.error('刪除項目時出錯:', error);
        }
    }

    useEffect(() => {
        const itemsTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setTotalAmount(itemsTotal + shippingFee - discount);
    }, [cartItems, discount, shippingFee]);

    const handleItemQuantityChange = async (index: number, newQuantity: number) => {
        const updatedItems = cartItems.map((item, idx) => {
            if (idx === index) {
                return {...item, quantity: newQuantity < 1 ? 1 : newQuantity};
            }
            return item;
        });
        setCartItems(updatedItems);

        if (userId) {
            const userCartRef = doc(db, "users", userId, "data", "user_cart");
            await updateDoc(userCartRef, {
                items: updatedItems
            });
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) {
            console.log('用戶未登入');
            return;
        }

        const fetchCartItems = async () => {
            try {
                const userCartRef = doc(db, "users", userId, "data", "user_cart");
                const docSnap = await getDoc(userCartRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.items && Array.isArray(data.items)) {
                        const validatedItems = data.items.map(item => ({
                            ...item,
                            quantity: item.quantity > 0 ? item.quantity : 1
                        }));
                        setCartItems(validatedItems);
                        console.log('讀取的購物車項目:', validatedItems);
                    }
                } else {
                    console.log('沒有找到使用者的購物車內容');
                }
            } catch (error) {
                console.error('讀取購物車數據時出錯:', error);
            }
        };
        fetchCartItems();
    }, [userId]);

    useEffect(() => {
        if (discountCode === 'gift') {
            setDiscount(65);
        } else {
            setDiscount(0);
        }
    }, [discountCode]);

    const handleDiscountCodeChange = (event: {target: {value: any;};}) => {
        setDiscountCode(event.target.value);
    };

    const handleQuantityChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        handleItemQuantityChange(index, newQuantity < 1 ? 1 : newQuantity);
    };

    const handleCheckout = () => {
        window.location.href = '/payment';
    }

    return (
        <Layout>
            <div className={CartCSS.main}>
                <div className={CartCSS.mainBackground}>
                    <div className={CartCSS.container}>
                        <div className={CartCSS.leftContainer}>
                            {cartItems.map((item, index) => (
                                <>
                                    <div key={index} className={CartCSS.itemContainer}>
                                        <IoClose className={CartCSS.itemRemove} onClick={() => handleRemoveItem(index)}></IoClose>
                                        <div className={CartCSS.itemImageContainer}>
                                            {item.image && <div className={CartCSS.itemImageBackground} style={{backgroundImage: `url(${item.image})`}}></div>}
                                            {item.canvasImage && <div className={CartCSS.itemImage} style={{backgroundImage: `url(${item.canvasImage})`}}></div>}
                                        </div>
                                        <div className={CartCSS.itemLeftContainer}>
                                            <div className={CartCSS.itemTitleContainer}>
                                                <span className={CartCSS.itemTitle}>商品名稱：</span>
                                                <span className={CartCSS.itemTitleText}>{item.name}</span>
                                            </div>
                                            <div className={CartCSS.itemAccessoriesContainer}>
                                                <span className={CartCSS.itemAccessoriesTitle}>商品配件：</span>
                                                <span className={CartCSS.itemAccessoriesText}>{item.accessories}</span>
                                            </div>
                                            <div className={CartCSS.itemCustomizationContainer}>
                                                <span className={CartCSS.itemCustomizationTitle}>訂製方式：</span>
                                                <span className={CartCSS.itemCustomizationText}>{item.customization}</span>
                                            </div>
                                            <div className={CartCSS.itemPriceContainer}>
                                                <span className={CartCSS.itemPriceTitle}>商品單價：</span>
                                                <span className={CartCSS.itemPriceText}>新台幣 {item.price} 元</span>
                                            </div>
                                            <div className={CartCSS.itemQuantityContainer}>
                                                <span className={CartCSS.itemQuantityTitle}>訂購數量：</span>
                                                <input
                                                    type="number"
                                                    className={CartCSS.itemQuantityInput}
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(index, e)}
                                                ></input>
                                                <span className={CartCSS.itemQuantityText}>組</span>
                                            </div>
                                        </div>
                                        <div className={CartCSS.itemSubtotalContainer}>$ {item.price * item.quantity}</div>
                                    </div>
                                    <div className={CartCSS.itemLine}></div>
                                </>
                            ))}
                        </div>
                        <div className={CartCSS.rightContainer}>
                            <div className={CartCSS.priceTitle}>訂單合計</div>
                            <div className={CartCSS.priceAmountContainer}>
                                <span className={CartCSS.priceAmountTitle}>商品金額：</span>
                                <span className={CartCSS.priceAmount}>新台幣 {totalAmount} 元</span>
                            </div>
                            <div className={CartCSS.itemLine}></div>
                            <div className={CartCSS.priceDiscountContainer}>
                                <span className={CartCSS.priceDiscountTitle}>優惠折扣：</span>
                                <span className={CartCSS.priceDiscount}>新台幣 {discount} 元</span>

                            </div>
                            <div className={CartCSS.discountCodeContainer}>
                                <span className={CartCSS.discountCodeTitle}> 折扣碼：</span>
                                <input
                                    type="text"
                                    placeholder="輸入 gift 免運費"
                                    value={discountCode}
                                    onChange={handleDiscountCodeChange}
                                    className={CartCSS.discountCodeInput}
                                />
                            </div>
                            <div className={CartCSS.itemLine}></div>
                            <div className={CartCSS.priceShippingFeeContainer}>
                                <span className={CartCSS.priceShippingFeeTitle}>商品運費：</span>
                                <span className={CartCSS.priceShippingFee}>新台幣 {shippingFee} 元</span>
                            </div>
                            <div className={CartCSS.itemLine}></div>
                            <div className={CartCSS.priceAmountContainer}>
                                <span className={CartCSS.priceAmountTitle}>訂單合計：</span>
                                <span className={CartCSS.priceAmount}>新台幣 {totalAmount} 元</span>
                            </div>
                            <div
                                className={CartCSS.checkoutButton}
                                onClick={handleCheckout}
                            >結帳付款</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default Cart;