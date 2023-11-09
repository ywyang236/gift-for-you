// pages/design-gift.tsx
import React from 'react';
import Layout from '../app/layout';
import DesignCSS from '../styles/design.module.css';
import BottonCSS from '../styles/botton.module.css';
import {IoArrowUndo, IoArrowRedo, IoBrush, IoClipboard, IoColorFill, IoColorPalette, IoColorWand, IoCopy, IoCrop, IoCut, IoDuplicate, IoEyedrop, IoEyeOff, IoEye, IoImage, IoLayers, IoOptions, IoText} from 'react-icons/io5';

const DesignGift = () => (
    <Layout>
        <div className={DesignCSS.main}>
            <div className={DesignCSS.container}>
                <div className={DesignCSS.designNavbar}>
                    <div className={DesignCSS.designTitle}>幾何造型夜燈</div>
                    <div className={DesignCSS.designButtonContainer}>
                        <IoArrowUndo className={DesignCSS.designButton} />
                        <IoArrowRedo className={DesignCSS.designButton} />
                        <IoBrush className={DesignCSS.designButton} />
                        <IoClipboard className={DesignCSS.designButton} />
                        <IoColorFill className={DesignCSS.designButton} />
                        <IoColorPalette className={DesignCSS.designButton} />
                        <IoColorWand className={DesignCSS.designButton} />
                        <IoCopy className={DesignCSS.designButton} />
                        <IoCrop className={DesignCSS.designButton} />
                        <IoCut className={DesignCSS.designButton} />
                        <IoDuplicate className={DesignCSS.designButton} />
                        <IoEyedrop className={DesignCSS.designButton} />
                        <IoEyeOff className={DesignCSS.designButton} />
                        <IoEye className={DesignCSS.designButton} />
                        <IoImage className={DesignCSS.designButton} />
                        <IoLayers className={DesignCSS.designButton} />
                        <IoOptions className={DesignCSS.designButton} />
                        <IoText className={DesignCSS.designButton} />
                    </div>
                </div>
                <div className={DesignCSS.designDown}>
                    <div className={DesignCSS.designCanvas}>
                        <div className={DesignCSS.designItem}></div>
                    </div>
                    <div className={DesignCSS.designToolsContainer}>
                        <div className={DesignCSS.brushChangeConteiner}>
                            <div className={DesignCSS.brushChangeTitle}>筆刷大小</div>
                            <div className={DesignCSS.brushChangeButton}>按鈕</div>
                        </div>
                        <div className={DesignCSS.colorChangeConteiner}>
                            <div className={DesignCSS.colorChangeTitle}>顏色選擇器</div>
                            <div className={DesignCSS.colorChangeButton}>按鈕</div>
                        </div>
                        <div className={DesignCSS.textChangeConteiner}>
                            <div className={DesignCSS.textChangeTitle}>文字外觀</div>
                            <div className={DesignCSS.textChangeButton}>字體</div>
                            <div className={DesignCSS.textChangeButton}>大小</div>
                            <div className={DesignCSS.textChangeButton}>顏色</div>
                            <div className={DesignCSS.textChangeButton}>粗細</div>
                        </div>
                        <div className={DesignCSS.patternChangeContainer}>
                            <div className={DesignCSS.patternChangeTitle}>幾何圖形</div>
                            <div className={DesignCSS.patternChangeButton}>按鈕</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

export default DesignGift;
