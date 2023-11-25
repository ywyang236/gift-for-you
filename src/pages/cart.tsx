// pages/cart.tsx
import React from 'react';
import Layout from '../app/layout';
import CartCSS from '../styles/cart.module.css';
import {IoClose} from "react-icons/io5";

const Cart = () => (
    <Layout>
        <div className={CartCSS.main}>
            <div className={CartCSS.container}>
                <div className={CartCSS.leftContainer}>
                    <div className={CartCSS.itemContainer}>
                        <IoClose className={CartCSS.itemRemove}>商品刪除</IoClose>
                        <div className={CartCSS.itemImageContainer}>
                            <div className={CartCSS.itemImage}></div>
                        </div>
                        <div className={CartCSS.itemLeftContainer}>
                            <div className={CartCSS.itemTitleContainer}>
                                <span className={CartCSS.itemTitle}>產品名稱：</span>
                                <span className={CartCSS.itemTitleText}>幾何造型夜燈</span>
                            </div>
                            <div className={CartCSS.itemAccessoriesContainer}>
                                <span className={CartCSS.itemAccessoriesTitle}>產品配件：</span>
                                <span className={CartCSS.itemAccessoriesText}>客製化燈板、燈座</span>
                            </div>
                            <div className={CartCSS.itemCustomizationContainer}>
                                <span className={CartCSS.itemCustomizationTitle}>訂製方式：</span>
                                <span className={CartCSS.itemCustomizationText}>雷射雕刻</span>
                            </div>
                            <div className={CartCSS.itemPriceContainer}>
                                <span className={CartCSS.itemPriceTitle}>商品單價：</span>
                                <span className={CartCSS.itemPrice}>新台幣 899 元</span>
                            </div>
                            <div className={CartCSS.itemQuantityContainer}>
                                <span className={CartCSS.itemQuantityTitle}>訂購數量：</span>
                                <input className={CartCSS.itemQuantityInput}></input>
                                <span className={CartCSS.itemQuantityUnit}> 組</span>
                            </div>
                        </div>
                        <div className={CartCSS.itemSubtotalContainer}>$4495</div>
                    </div>
                    <div className={CartCSS.itemLine}></div>
                </div>
                <div className={CartCSS.rightContainer}>
                    <div className={CartCSS.priceTitle}>訂單合計</div>
                    <div className={CartCSS.priceAmountContainer}>
                        <span className={CartCSS.priceAmountTitle}>商品金額：</span>
                        <span className={CartCSS.priceAmount}>新台幣 4495 元</span>
                    </div>
                    <div className={CartCSS.itemLine}></div>
                    <div className={CartCSS.priceDiscountContainer}>
                        <span className={CartCSS.priceDiscountTitle}>優惠折扣：</span>
                        <span className={CartCSS.priceDiscount}>新台幣 0 元</span>
                    </div>
                    <div className={CartCSS.itemLine}></div>
                    <div className={CartCSS.priceShippingFeeContainer}>
                        <span className={CartCSS.priceShippingFeeTitle}>商品運費：</span>
                        <span className={CartCSS.priceShippingFee}>新台幣 0 元</span>
                    </div>
                    <div className={CartCSS.itemLine}></div>
                    <div className={CartCSS.priceAmountContainer}>
                        <span className={CartCSS.priceAmountTitle}>訂單合計：</span>
                        <span className={CartCSS.priceAmount}>新台幣 4560 元</span>
                    </div>
                    <div className={CartCSS.checkoutButton}>結帳付款</div>
                </div>
            </div>
        </div>
    </Layout >
);

export default Cart;