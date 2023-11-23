// pages/member-information.tsx
import React from 'react';
import Layout from '../app/layout';
import MemberCSS from '../styles/member.module.css';

const MemberInformation = () => (
    <Layout>
        <div className={MemberCSS.main}>
            <div className={MemberCSS.container}>
                <h1>會員資料</h1>
            </div>
        </div>
    </Layout>
);

export default MemberInformation;
