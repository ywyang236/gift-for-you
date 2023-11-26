// pages/index.tsx
import React from 'react';
import Layout from '../app/layout';
import IndexCSS from '../styles/index.module.css';
import Link from 'next/link';
import useRequireAuth from '@/hooks/useRequireAuth';
import LoginModal from '../components/LoginModal/LoginModal';
import RegisterModal from '../components/RegisterModal/RegisterModal';

const Home = () => {
    const {isLoginModalVisible, setIsLoginModalVisible, requireAuth} = useRequireAuth();
    const [isRegisterModalVisible, setIsRegisterModalVisible] = React.useState(false);

    return (
        <Layout>
            <div className={IndexCSS.mainTop}>
                <div className={IndexCSS.containerTop}>
                    <span className={IndexCSS.titleTop}>禮品訂製所</span>
                    <span className={IndexCSS.descriptionTop}>親手繪製您獨一無二的紀念品</span>
                </div>
            </div>
            <div className={IndexCSS.rulesSection}>
                <div className={IndexCSS.rulesContainer}>
                    <div className={IndexCSS.rulesTitle}>訂購流程</div>
                    <div className={IndexCSS.rulesContent}>
                        <div className={IndexCSS.rulesCard}>
                            <div className={IndexCSS.rulesCard_Background}>
                                <div className={IndexCSS.rulesCard_PictureBackground}>
                                    <div className={IndexCSS.rulesCard_1_Picture}></div>
                                </div>
                                <div className={IndexCSS.rulesCard_Text}>
                                    <div className={IndexCSS.rulesCard_Title}>Step 1</div>
                                    <div className={IndexCSS.rulesCard_Description}>選擇禮品</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.rulesCard}>
                            <div className={IndexCSS.rulesCard_Background}>
                                <div className={IndexCSS.rulesCard_PictureBackground}>
                                    <div className={IndexCSS.rulesCard_2_Picture}></div>
                                </div>
                                <div className={IndexCSS.rulesCard_Text}>
                                    <div className={IndexCSS.rulesCard_Title}>Step 2</div>
                                    <div className={IndexCSS.rulesCard_Description} onClick={requireAuth}>開始設計</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.rulesCard}>
                            <div className={IndexCSS.rulesCard_Background}>
                                <div className={IndexCSS.rulesCard_PictureBackground}>
                                    <div className={IndexCSS.rulesCard_3_Picture}></div>
                                </div>
                                <div className={IndexCSS.rulesCard_Text}>
                                    <div className={IndexCSS.rulesCard_Title}>Step 3</div>
                                    <div className={IndexCSS.rulesCard_Description}>下單付款</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.rulesCard}>
                            <div className={IndexCSS.rulesCard_Background}>
                                <div className={IndexCSS.rulesCard_PictureBackground}>
                                    <div className={IndexCSS.rulesCard_4_Picture}></div>
                                </div>
                                <div className={IndexCSS.rulesCard_Text}>
                                    <div className={IndexCSS.rulesCard_Title}>Step 4</div>
                                    <div className={IndexCSS.rulesCard_Description}>禮品送達</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={IndexCSS.itemsContainer}>
                    <div className={IndexCSS.itemsTitle}>訂製項目</div>
                    <div className={IndexCSS.itemsContent}>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_1_Picture}>
                                    <Link href='/start-design' className={IndexCSS.itemsCard_1_button} onClick={requireAuth}>開始設計</Link>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_2_Picture}>
                                    <div className={IndexCSS.itemsCard_2_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_3_Picture}>
                                    <div className={IndexCSS.itemsCard_3_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_4_Picture}>
                                    <div className={IndexCSS.itemsCard_4_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_5_Picture}>
                                    <div className={IndexCSS.itemsCard_5_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>特殊造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 1899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_6_Picture}>
                                    <div className={IndexCSS.itemsCard_6_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>特殊造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 1899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_7_Picture}>
                                    <div className={IndexCSS.itemsCard_7_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>

                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_8_Picture}>
                                    <div className={IndexCSS.itemsCard_8_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_9_Picture}>
                                    <div className={IndexCSS.itemsCard_9_button}>尚未開放</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>幾何造型夜燈</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoginModalVisible && <LoginModal onClose={() => setIsLoginModalVisible(false)} onShowRegister={setIsRegisterModalVisible} />}
            {isRegisterModalVisible && <RegisterModal onClose={() => setIsRegisterModalVisible(false)} onShowLogin={setIsLoginModalVisible} />}
        </Layout >
    );
}

export default Home;
