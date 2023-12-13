// pages/cart.tsx
import React, {useState, useEffect} from 'react';
import Layout from '../app/layout';
import CartCSS from '../styles/cart.module.css';
import {IoClose} from "react-icons/io5";
import {db} from '../lib/firebase/firebase';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

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
    const shippingFee = 65;
    const [totalAmount, setTotalAmount] = useState(shippingFee);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [finalShippingFee, setFinalShippingFee] = useState(shippingFee);
    const [itemsTotalAmount, setItemsTotalAmount] = useState(0);

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
            };
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    useEffect(() => {
        const itemsTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setItemsTotalAmount(itemsTotal);

        let newFinalShippingFee = cartItems.length === 0 ? 0 : shippingFee;
        let discountAmount = 0;

        if (discountCode === 'gift') {
            discountAmount = 65;
            newFinalShippingFee = 0;
        }

        setDiscount(discountAmount);
        setFinalShippingFee(newFinalShippingFee);
        setTotalAmount(discountCode === 'gift' ? itemsTotal : itemsTotal + newFinalShippingFee);
    }, [cartItems, discountCode, shippingFee]);


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
            console.log('User not logged in');
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
                    }
                } else {
                    console.log('User cart content not found');
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };
        fetchCartItems();
    }, [userId]);

    const handleDiscountCodeChange = (event: {target: {value: any;};}) => {
        setDiscountCode(event.target.value);
    };

    const handleQuantityChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value);
        handleItemQuantityChange(index, newQuantity < 1 ? 1 : newQuantity);
    };

    const handleCheckout = async () => {
        if (!userId) {
            console.log('User not logged in');
            return;
        }

        try {
            const finalShippingFee = discountCode === 'gift' ? 0 : shippingFee;

            const paymentInfo = {
                items: cartItems.map(item => ({
                    itemImage: item.image,
                    userCanvas: item.canvasImage,
                    name: item.name,
                    accessories: item.accessories,
                    customization: item.customization,
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity
                })),
                totalAmount: totalAmount,
                discount: discount,
                shippingFee: finalShippingFee
            };

            const userPaymentRef = doc(db, "users", userId, "data", "user_payment");
            await setDoc(userPaymentRef, paymentInfo);

            localStorage.setItem('isCheckoutInitiated', 'true');

            window.location.href = '/payment';
        } catch (error) {
            console.error('儲存付款資訊時出錯:', error);
        }
    }

    function determineSetOrSets(quantity: number) {
        return quantity === 1 ? 'set' : 'sets';
    }

    return (
        <Layout>
            <div className={CartCSS.main}>
                <div className={CartCSS.mainBackground}>
                    <div className={CartCSS.container}>
                        <div className={CartCSS.leftContainer}>
                            {cartItems.length === 0 ? (
                                <div className={CartCSS.emptyCartMessage}>No items in the cart.</div>
                            ) : (
                                cartItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <div key={index} className={CartCSS.itemContainer}>
                                            <IoClose className={CartCSS.itemRemove} onClick={() => handleRemoveItem(index)}></IoClose>
                                            <div className={CartCSS.itemImageContainer}>
                                                {item.image && <div className={CartCSS.itemImageBackground} style={{backgroundImage: `url(${item.image})`}}></div>}
                                                {item.canvasImage && <div className={CartCSS.itemImage} style={{backgroundImage: `url(${item.canvasImage})`}}></div>}
                                            </div>
                                            <div className={CartCSS.itemLeftContainer}>
                                                <div className={CartCSS.itemTitleContainer}>
                                                    <span className={CartCSS.itemTitle}>Product Name:</span>
                                                    <span className={CartCSS.itemTitleText}>{item.name}</span>
                                                </div>
                                                <div className={CartCSS.itemAccessoriesContainer}>
                                                    <span className={CartCSS.itemAccessoriesTitle}>Accessories:</span>
                                                    <span className={CartCSS.itemAccessoriesText}>{item.accessories}</span>
                                                </div>
                                                <div className={CartCSS.itemCustomizationContainer}>
                                                    <span className={CartCSS.itemCustomizationTitle}>Customization:</span>
                                                    <span className={CartCSS.itemCustomizationText}>{item.customization}</span>
                                                </div>
                                                <div className={CartCSS.itemPriceContainer}>
                                                    <span className={CartCSS.itemPriceTitle}>Unit Price:</span>
                                                    <span className={CartCSS.itemPriceText}>NT$ {item.price}</span>
                                                </div>
                                                <div className={CartCSS.itemQuantityContainer}>
                                                    <span className={CartCSS.itemQuantityTitle}>Order Quantity: </span>
                                                    <input
                                                        type="number"
                                                        className={CartCSS.itemQuantityInput}
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e)}
                                                    ></input>
                                                    <span className={CartCSS.itemQuantityText}>{determineSetOrSets(item.quantity)}</span>
                                                </div>
                                            </div>
                                            <div className={CartCSS.itemSubtotalContainer}>$ {item.price * item.quantity}</div>
                                        </div>
                                        <div className={CartCSS.itemLine}></div>
                                    </React.Fragment>
                                ))
                            )}
                        </div>
                        <div className={CartCSS.rightContainer}>
                            <div className={CartCSS.priceTitle}>Order Total</div>
                            <div className={CartCSS.priceAmountContainer}>
                                <span className={CartCSS.priceAmountTitle}>Product Amount:</span>
                                <span className={CartCSS.priceAmount}>NT$ {itemsTotalAmount}</span>
                            </div>
                            <div className={CartCSS.itemLine}></div>
                            <div className={CartCSS.priceDiscountContainer}>
                                <span className={CartCSS.priceDiscountTitle}>Discount Code:</span>
                                <input
                                    type="text"
                                    placeholder='Enter "gift" for free shipping.'
                                    value={discountCode}
                                    onChange={handleDiscountCodeChange}
                                    className={CartCSS.discountCodeInput}
                                    disabled={cartItems.length === 0}
                                />
                            </div>
                            <div className={CartCSS.itemLine}></div>
                            <div className={CartCSS.priceShippingFeeContainer}>
                                <span className={CartCSS.priceShippingFeeTitle}>Shipping Fee: </span>
                                <span className={CartCSS.priceShippingFee}>NT$ {finalShippingFee}</span>
                            </div>
                            <div className={CartCSS.itemLine}></div>
                            <div className={CartCSS.priceAmountContainer}>
                                <span className={CartCSS.priceAmountTitle}>Order Total: </span>
                                <span className={CartCSS.priceAmount}>NT$ {totalAmount}</span>
                            </div>
                            <div
                                className={`${CartCSS.checkoutButton} ${cartItems.length === 0 ? CartCSS.disabledButton : ''}`}
                                onClick={cartItems.length === 0 ? undefined : handleCheckout}
                            >Confirm Order</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default Cart;