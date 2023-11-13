// pages/design-gift.tsx
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toggleBrush, setLineWidth} from '../store/actions/brushActions';
import {RootState} from '../store/types/storeTypes';
import Layout from '../app/layout';
import DesignCSS from '../styles/design.module.css';
import ButtonCSS from '../styles/button.module.css';
import {IoArrowUndo, IoArrowRedo, IoBrush, IoClipboard, IoColorFill, IoColorPalette, IoColorWand, IoCopy, IoCrop, IoCut, IoDuplicate, IoEyedrop, IoEyeOff, IoEye, IoImage, IoLayers, IoOptions, IoText} from 'react-icons/io5';
import {IoEllipseSharp, IoHeart, IoMoon, IoSquareSharp, IoSquare, IoTriangle} from "react-icons/io5";
import {BsEraserFill, BsFillDiamondFill, BsFillHeptagonFill, BsFillHexagonFill, BsFillOctagonFill, BsFillPentagonFill, BsFillStarFill} from "react-icons/bs";
import Canvas from '../components/Canvas/Canvas';

const DesignGift = () => {
    const dispatch = useDispatch();
    const brushActive = useSelector((state: RootState) => state.brush.isBrushActive);

    const handleToggleBrush = () => {
        dispatch(toggleBrush());
    };

    const handleLineWidthChange = (newLineWidth: number) => {
        dispatch(setLineWidth(newLineWidth));
    };

    return (
        <Layout>
            <div className={DesignCSS.main}>
                <div className={DesignCSS.container}>
                    <div className={DesignCSS.designNavbar}>
                        <div className={DesignCSS.designTitle}>幾何造型夜燈</div>
                        <div className={DesignCSS.designButtonContainer}>
                            <IoArrowUndo className={DesignCSS.designButton} />
                            <IoArrowRedo className={DesignCSS.designButton} />
                            <IoBrush
                                className={DesignCSS.designButton}
                                onClick={handleToggleBrush}
                            />
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
                            <BsEraserFill className={DesignCSS.designButton} />
                            <span className={DesignCSS.addCartButton}>加入購物車</span>
                            <span className={DesignCSS.quiteButton}>放棄設計</span>
                        </div>
                    </div>
                    <div className={DesignCSS.designDown}>
                        <div className={DesignCSS.designCanvasContainer}>
                            <div className={DesignCSS.designItem}>
                                <div className={DesignCSS.designCanvas}>
                                    <div>
                                        <Canvas
                                            width={460}
                                            height={420}
                                            isBrushActive={brushActive}
                                            setLineWidth={handleLineWidthChange}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={DesignCSS.designToolsContainer}>
                            <div className={DesignCSS.brushContainer}>
                                <div className={DesignCSS.brushChangeTitle}>筆刷大小</div>
                                <div className={DesignCSS.brushChangeContainer}>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(6)}>
                                        <div className={DesignCSS.brushChange6px}></div>
                                    </div>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(8)}>
                                        <div className={DesignCSS.brushChange8px}></div>
                                    </div>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(10)}>
                                        <div className={DesignCSS.brushChange10px}></div>
                                    </div>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(12)}>
                                        <div className={DesignCSS.brushChange12px}></div>
                                    </div>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(14)}>
                                        <div className={DesignCSS.brushChange14px}></div>
                                    </div>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(16)}>
                                        <div className={DesignCSS.brushChange16px}></div>
                                    </div>
                                    <div className={DesignCSS.brushChangeBackground} onClick={() => handleLineWidthChange(18)}>
                                        <div className={DesignCSS.brushChange18px}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={DesignCSS.colorConteiner}>
                                <div className={DesignCSS.colorChangeTitle}>顏色選擇器</div>
                                <div className={DesignCSS.colorChangePicker}></div>
                            </div>
                            <div className={DesignCSS.textChangeConteiner}>
                                <div className={DesignCSS.textChangeTitle}>文字外觀</div>
                                <div className={DesignCSS.textChangeFontBackground}>
                                    <div className={DesignCSS.textChangeFrontButton}>字體下拉式選單</div>
                                </div>
                                <div className={DesignCSS.sizeColorBoldContainer}>
                                    <div className={DesignCSS.textChangeSizeBackground}>
                                        <div className={DesignCSS.textChangeSizeButton}>大小</div>
                                    </div>
                                    <div className={DesignCSS.textChangeColorBackground}>
                                        <div className={DesignCSS.textChangeButton}>顏色</div>
                                    </div>
                                    <div className={DesignCSS.textChangeBoldBackground}>
                                        <div className={DesignCSS.textChangeButton}>粗細</div>
                                    </div>
                                </div>
                            </div>
                            <div className={DesignCSS.patternChangeContainer}>
                                <div className={DesignCSS.patternChangeTitle}>幾何圖形</div>
                                <div className={DesignCSS.patternChangeBackground}>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <IoSquareSharp className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <IoSquare className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <IoEllipseSharp className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <IoTriangle className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <BsFillDiamondFill className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <BsFillPentagonFill className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <BsFillHexagonFill className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <BsFillHeptagonFill className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <BsFillOctagonFill className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <IoMoon className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <IoHeart className={DesignCSS.patternButton} />
                                    </div>
                                    <div className={DesignCSS.patternButtonBackground}>
                                        <BsFillStarFill className={DesignCSS.patternButton} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DesignGift;
