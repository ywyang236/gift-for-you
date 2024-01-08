/* eslint-disable react/no-unescaped-entities */
// pages/about-author.tsx
import React from 'react';
import Layout from '../app/layout';
import AboutAuthorCSS from '../styles/author.module.css';

const AboutAuthor = () => (
    <Layout>
        <div className={AboutAuthorCSS.main}>
            <div className={AboutAuthorCSS.backgroundContainer}>
                <div className={AboutAuthorCSS.container}>
                    <h1 className={AboutAuthorCSS.title}>About Author</h1>
                    <div className={AboutAuthorCSS.containerInner}>
                        <div className={AboutAuthorCSS.containerLeft}></div>
                        <div className={AboutAuthorCSS.containerRight} >
                            <p className={AboutAuthorCSS.text}>
                                My name is Yu-Wei Yang (楊于葳), a Trainee of the fourth cohort at WeHelp Bootcamp, where I embarked on a six-month journey of web development training from July to December 2023. Before joining WeHelp, I had only just grasped the basics of JavaScript and had never worked with Python. As I joined the Bootcamp, I began to massively immerse myself in unfamiliar languages and technologies, tailoring my learning to my own pace and completing the weekly assignments.
                            </p>
                            <p className={AboutAuthorCSS.text}>
                                During this period, I dedicated seven weeks to independently develop a full-stack e-commerce site called 'Taipei Day Trip' strictly following the specification documents. Additionally, 'Gift For You' is a drawing e-commerce site that I developed independently over six weeks, without following any guidelines. These projects were significant milestones in my journey, demonstrating my ability to learn rapidly and apply new skills in practical, project-based environments.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout >
);

export default AboutAuthor;
