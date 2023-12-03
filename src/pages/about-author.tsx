// pages/about-author.tsx
import React from 'react';
import Layout from '../app/layout';
import AboutAuthorCSS from '../styles/author.module.css';

const AboutAuthor = () => (
    <Layout>
        <div className={AboutAuthorCSS.main}>
            <div className={AboutAuthorCSS.backgroundContainer}>
                <div className={AboutAuthorCSS.container}>
                    <h1>關於作者</h1>
                </div>
            </div>
        </div>
    </Layout>
);

export default AboutAuthor;
