// pages/payment.tsx
import React from 'react';
import Layout from '../app/layout';
import PaymentCSS from '../styles/payment.module.css';

const Payment = () => (
    <Layout>
        <div className={PaymentCSS.main}>
            <div className={PaymentCSS.container}>
                <h1>付款頁面</h1>
            </div>
        </div>
    </Layout>
);

export default Payment;
