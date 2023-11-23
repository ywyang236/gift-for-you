// pages/order-info.tsx
import React from 'react';
import Layout from '../app/layout';
import OrderCSS from '../styles/order.module.css';

const OrderInformation = () => (
    <Layout>
        <div className={OrderCSS.main}>
            <div className={OrderCSS.container}>
                <h1>訂單資訊</h1>
            </div>
        </div>
    </Layout>
);

export default OrderInformation;
