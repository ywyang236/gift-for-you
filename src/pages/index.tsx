// pages/index.tsx
import React from 'react';
import Layout from '../app/layout';
import IndexCSS from '../styles/index.module.css';

const Home = () => (
    <Layout>
        <div className={IndexCSS.main}>
            <div className={IndexCSS.container}>
                <span className={IndexCSS.title}>禮品訂製所</span>
                <span className={IndexCSS.description}>親手繪製您獨一無二的紀念品</span>

            </div>
        </div>
    </Layout >
);

export default Home;
