/* eslint-disable react/no-unescaped-entities */
// pages/about-gift-for-you.tsx
import React from 'react';
import Layout from '../app/layout';
import WebsiteCSS from '../styles/website.module.css';

const AboutWebsite = () => (
    <Layout>
        <div className={WebsiteCSS.main}>
            <div className={WebsiteCSS.backgroundContainer}>
                <div className={WebsiteCSS.container}>
                    <h1 className={WebsiteCSS.title}>About Gift For You</h1>
                    <div className={WebsiteCSS.containerInner}>
                        <div className={WebsiteCSS.containerLeft}></div>
                        <div className={WebsiteCSS.containerRight} >
                            <p className={WebsiteCSS.text}>
                                "Gift For You" is a drawing e-commerce website that I independently developed over six weeks, without following any specific guidelines. It's also a distinctive project that everyone at WeHelp Bootcamp is required to complete individually. "The plan about the personal project is to have no plan," I told myself, although I did outline a few directions. The core of the project is "continuously working and delving deeper." In my notebook, I jotted down several "must-do tasks" and crossed out a few plans that couldn't keep up with the changes, adding some "unplanned alterations" along the way.
                            </p>
                            <p className={WebsiteCSS.text}>
                                The personal project is mine alone, unique in every way. Only I know what has happened and only I can determine the future direction of the project. Honestly, I never expected my project to encompass so many technical key terms. Much of the content evolved from one or two sentences exchanged with teachers, classmates, and teaching assistants. Because I was willing to venture further into the unknown, the final outcome far exceeded my initial expectations.                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

export default AboutWebsite;
