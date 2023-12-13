/* eslint-disable react/no-unescaped-entities */
// pages/index.tsx
import React from 'react';
import Layout from '../app/layout';
import IndexCSS from '../styles/index.module.css';
import Link from 'next/link';
import useRequireAuth from '@/hooks/useRequireAuth';
import LoginModal from '../components/LoginModal/LoginModal';
import RegisterModal from '../components/RegisterModal/RegisterModal';
import {db} from '../lib/firebase/firebase';
import {doc, getDoc} from 'firebase/firestore';

const Home = () => {
    const {isLoginModalVisible, setIsLoginModalVisible, requireAuth} = useRequireAuth();
    const [isRegisterModalVisible, setIsRegisterModalVisible] = React.useState(false);

    const products = [
        {id: '001', firebaseId: 'q5hXfGpWqPiEnbrzbhbC', name: "Night Lights", accessories: ["Customized Lamp Panel", "Lamp Base"], customization: "Laser Engraving, ", price: 899, image: 'gs://gift-for-you-2023.appspot.com/itemImage/design_001.png'},
    ];

    const fetchProductInfo = async (firebaseId: string) => {
        const docRef = doc(db, 'products', firebaseId);
        const docSnap = await getDoc(docRef);
    };

    return (
        <Layout>
            <div className={IndexCSS.mainTop}>
                <div className={IndexCSS.containerTop}>
                    <span className={IndexCSS.titleTop}>Gift For You</span>
                    <span className={IndexCSS.descriptionTop}>Hand-draw your unique keepsake.</span>
                </div>
            </div>
            <div className={IndexCSS.rulesSection}>
                <div className={IndexCSS.rulesContainer}>
                    <div className={IndexCSS.rulesTitle}>Ordering Process</div>
                    <div className={IndexCSS.rulesContent}>
                        <div className={IndexCSS.rulesCard}>
                            <div className={IndexCSS.rulesCard_Background}>
                                <div className={IndexCSS.rulesCard_PictureBackground}>
                                    <div className={IndexCSS.rulesCard_1_Picture}></div>
                                </div>
                                <div className={IndexCSS.rulesCard_Text}>
                                    <div className={IndexCSS.rulesCard_Title}>Step 1</div>
                                    <div className={IndexCSS.rulesCard_Description}>Select</div>
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
                                    <div className={IndexCSS.rulesCard_Description}>Design</div>
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
                                    <div className={IndexCSS.rulesCard_Description}>Order</div>
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
                                    <div className={IndexCSS.rulesCard_Description}>Receive</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={IndexCSS.itemsContainer}>
                    <div id="designItems" className={IndexCSS.itemsTitle}>Customization Items</div>
                    <div className={IndexCSS.itemsContent}>
                        {products.map(product => (
                            <div key={product.id} className={IndexCSS.itemsCard}>
                                <div className={IndexCSS.itemsCard_Background}>
                                    <div className={IndexCSS.itemsCard_1_Picture}>
                                        <Link href={`/start-design?product=${product.id}`} className={IndexCSS.itemsCard_1_button} onClick={(e) => {requireAuth(e); fetchProductInfo(product.firebaseId);}}>Start</Link>
                                    </div>
                                    <div className={IndexCSS.itemsText}>
                                        <div className={IndexCSS.itemsCard_Title}>{product.name}</div>
                                        <div className={IndexCSS.itemsCard_Price}>${product.price}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_2_Picture}>
                                    <div className={IndexCSS.itemsCard_2_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Night Lights</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_3_Picture}>
                                    <div className={IndexCSS.itemsCard_3_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Night Lights</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 899</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_4_Picture}>
                                    <div className={IndexCSS.itemsCard_4_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Night Lights</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 1299</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_5_Picture}>
                                    <div className={IndexCSS.itemsCard_5_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Night Lights</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 1599</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_6_Picture}>
                                    <div className={IndexCSS.itemsCard_6_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Night Lights</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 2499</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_7_Picture}>
                                    <div className={IndexCSS.itemsCard_7_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Night Lights</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 499</div>
                                </div>
                            </div>

                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_8_Picture}>
                                    <div className={IndexCSS.itemsCard_8_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Greeting Cards</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 39</div>
                                </div>
                            </div>
                        </div>
                        <div className={IndexCSS.itemsCard}>
                            <div className={IndexCSS.itemsCard_Background}>
                                <div className={IndexCSS.itemsCard_9_Picture}>
                                    <div className={IndexCSS.itemsCard_9_button}>Not Yet</div>
                                </div>
                                <div className={IndexCSS.itemsText}>
                                    <div className={IndexCSS.itemsCard_Title}>Greeting Cards</div>
                                    <div className={IndexCSS.itemsCard_Price}>$ 49</div>
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
