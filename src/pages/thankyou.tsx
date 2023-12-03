// pages/thankyou.tsx
import React from 'react';
import Layout from '../app/layout';
import ThankCSS from '../styles/thank.module.css';

const ThankYou = () => (
    <Layout>
        <div className={ThankCSS.main}>
            <div className={ThankCSS.backgroundContainer}>
                <div className={ThankCSS.container}>
                    <div className={ThankCSS.iconContainer}>
                        <div className={ThankCSS.circle}>
                            <svg className={ThankCSS.tick} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <path className={ThankCSS.checkmark} fill="none" stroke="#448899" stroke-width="8" d="M2,20 L20,40 L50,10">
                                </path>
                            </svg>
                        </div>
                        <div className={ThankCSS.thankYou}>付款成功</div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

export default ThankYou;
