// pages/about-gift-for-you.tsx
import React from 'react';
import Layout from '../app/layout';
import WebsiteCSS from '../styles/website.module.css';

const AboutWebsite = () => (
    <Layout>
        <div className={WebsiteCSS.main}>
            <div className={WebsiteCSS.container}>
                <h1>關於禮品訂製所</h1>
            </div>
        </div>
    </Layout>
);

export default AboutWebsite;
