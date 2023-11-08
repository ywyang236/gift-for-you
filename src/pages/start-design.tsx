// pages/design-gift.tsx
import React from 'react';
import Layout from '../app/layout';
import DesignCSS from '../styles/design.module.css';


const DesignGift = () => (
    <Layout>
        <div className={DesignCSS.main}>
            <div className={DesignCSS.container}>
                <div className={DesignCSS.designNavbar}>
                    <div className={DesignCSS.designTitle}>幾何造型夜燈</div>
                    <div className={DesignCSS.designButton}></div>
                </div>
                <div className={DesignCSS.designDown}>
                    <div className={DesignCSS.designCanvas}>
                        <div className={DesignCSS.designItem}></div>
                    </div>
                    <div className={DesignCSS.designTools}></div>
                </div>
            </div>
        </div>
    </Layout>
);

export default DesignGift;
