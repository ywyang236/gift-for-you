// pages/cart.tsx
import React from 'react';
import Layout from '../app/layout';
import CartCSS from '../styles/cart.module.css';

const Cart = () => (
    <Layout>
        <div className={CartCSS.main}>
            <div className={CartCSS.container}>
                <h1>購物車</h1>
            </div>
        </div>
    </Layout>
);

export default Cart;