// pages/index.tsx
import React from 'react';
import Layout from '../app/layout';
import IndexCSS from '../styles/index.module.css';

const Home = () => (
    <Layout>
        <div className={IndexCSS.mainTop}>
            <div className={IndexCSS.containerTop}>
                <span className={IndexCSS.titleTop}>禮品訂製所</span>
                <span className={IndexCSS.descriptionTop}>親手繪製您獨一無二的紀念品</span>
            </div>
        </div>
        <div className={IndexCSS.mainDown}>
            <div className={IndexCSS.containerDown}>
                <div className={IndexCSS.rulesContainer}>
                    <div className={IndexCSS.rulesTitle}>訂購流程</div>
                    <div className={IndexCSS.rulesContent}>
                        <div className={IndexCSS.rulesCard_1}>
                            <div className={IndexCSS.rulesCard_1_Background}></div>
                            <div className={IndexCSS.rulesCard_1_Picture}></div>
                            <div className={IndexCSS.rulesCard_1_Title}>Step 1</div>
                            <div className={IndexCSS.rulesCard_1_Description}>選擇禮品</div>
                        </div>
                        <div className={IndexCSS.rulesCard2}>
                            <div className={IndexCSS.rulesCard_2_Background}></div>
                            <div className={IndexCSS.rulesCard_2_Picture}></div>
                            <div className={IndexCSS.rulesCard_2_Title}>Step 2</div>
                            <div className={IndexCSS.rulesCard_2_Description}>開始設計</div>
                        </div>
                        <div className={IndexCSS.rulesCard3}>
                            <div className={IndexCSS.rulesCard_3_Background}></div>
                            <div className={IndexCSS.rulesCard_3_Picture}></div>
                            <div className={IndexCSS.rulesCard_3_Title}>Step 3</div>
                            <div className={IndexCSS.rulesCard_3_Description}>下單付款</div>
                        </div>
                        <div className={IndexCSS.rulesCard4}>
                            <div className={IndexCSS.rulesCard_4_Background}></div>
                            <div className={IndexCSS.rulesCard_4_Picture}></div>
                            <div className={IndexCSS.rulesCard_4_Title}>Step 4</div>
                            <div className={IndexCSS.rulesCard_4_Description}>禮品送達</div>
                        </div>
                    </div>
                </div>
                <div className={IndexCSS.itemsContainer}>
                    <div className={IndexCSS.itemsTitle}>訂製項目</div>
                    <div className={IndexCSS.itemsContent}>
                        <div className={IndexCSS.itemsCard1}>
                            <div className={IndexCSS.itemsCard_1_Background}></div>
                            <div className={IndexCSS.itemsCard_1_Picture}></div>
                            <div className={IndexCSS.itemsCard_1_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_1_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_2}>
                            <div className={IndexCSS.itemsCard_2_Background}></div>
                            <div className={IndexCSS.itemsCard_2_Picture}></div>
                            <div className={IndexCSS.itemsCard_2_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_2_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_3}>
                            <div className={IndexCSS.itemsCard_3_Background}></div>
                            <div className={IndexCSS.itemsCard_3_Picture}></div>
                            <div className={IndexCSS.itemsCard_3_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_3_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_4}>
                            <div className={IndexCSS.itemsCard_4_Background}></div>
                            <div className={IndexCSS.itemsCard_4_Picture}></div>
                            <div className={IndexCSS.itemsCard_4_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_4_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_5}>
                            <div className={IndexCSS.itemsCard_5_Background}></div>
                            <div className={IndexCSS.itemsCard_5_Picture}></div>
                            <div className={IndexCSS.itemsCard_5_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_5_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_6}>
                            <div className={IndexCSS.itemsCard_6_Background}></div>
                            <div className={IndexCSS.itemsCard_6_Picture}></div>
                            <div className={IndexCSS.itemsCard_6_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_6_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_7}>
                            <div className={IndexCSS.itemsCard_7_Background}></div>
                            <div className={IndexCSS.itemsCard_7_Picture}></div>
                            <div className={IndexCSS.itemsCard_7_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_7_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_8}>
                            <div className={IndexCSS.itemsCard_8_Background}></div>
                            <div className={IndexCSS.itemsCard_8_Picture}></div>
                            <div className={IndexCSS.itemsCard_8_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_8_Price}>$ 899</div>
                        </div>
                        <div className={IndexCSS.itemsCard_9}>
                            <div className={IndexCSS.itemsCard_9_Background}></div>
                            <div className={IndexCSS.itemsCard_9_Picture}></div>
                            <div className={IndexCSS.itemsCard_9_Title}>幾何造型夜燈</div>
                            <div className={IndexCSS.itemsCard_9_Price}>$ 899</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout >
);

export default Home;
