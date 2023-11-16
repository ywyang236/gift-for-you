// pages/design-gift.tsx
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toggleBrush, setBrushSize, setBrushColor, activateBrush, deactivateBrush} from '../store/actions/brushActions';
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
    const currentBrushSize = useSelector((state: RootState) => state.brush.brushSize);

    const handleScrollToBrushColor = () => {
        const brushColorElement = document.querySelector('#colorChangeTitle');

        if (brushColorElement) {
            brushColorElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    const handleToggleBrush = () => {
        if (brushActive) {
            dispatch(deactivateBrush());
        } else {
            dispatch(activateBrush());
        }
    };

    const handleBrushSizeChange = (newBrushSize: number) => {
        dispatch(setBrushSize(newBrushSize));
        if (!brushActive) {
            dispatch(activateBrush());
        }
    };

    const handleBrushColorChange = (newBrushColor: string) => {
        dispatch(setBrushColor(newBrushColor));
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
                                className={`${DesignCSS.designButton} ${brushActive ? DesignCSS.designButtonActive : ''}`}
                                onClick={handleToggleBrush}
                            />
                            <BsEraserFill
                                className={DesignCSS.designButton}
                            />
                            <IoColorPalette
                                className={DesignCSS.designButton}
                                onClick={handleScrollToBrushColor}
                            />
                            <IoClipboard className={DesignCSS.designButton} />
                            <IoColorFill className={DesignCSS.designButton} />
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
                                            setBrushSize={() => { }}
                                            setBrushColor={() => { }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={DesignCSS.designToolsContainer}>
                            <div className={DesignCSS.brushContainer}>
                                <div className={DesignCSS.brushChangeTitle}>筆刷大小</div>
                                <div className={DesignCSS.brushChangeContainer}>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 6) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(6)}>
                                        <div className={DesignCSS.brushChange6px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 8) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(8)}>
                                        <div className={DesignCSS.brushChange8px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 10) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(10)}>
                                        <div className={DesignCSS.brushChange10px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 12) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(12)}>
                                        <div className={DesignCSS.brushChange12px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 14) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(14)}>
                                        <div className={DesignCSS.brushChange14px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 16) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(16)}>
                                        <div className={DesignCSS.brushChange16px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.brushChangeBackground} ${(brushActive && currentBrushSize === 18) ? DesignCSS.brushChangeBackgroundActive : ''}`}
                                        onClick={() => handleBrushSizeChange(18)}>
                                        <div className={DesignCSS.brushChange18px}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={DesignCSS.colorConteiner}>
                                <div
                                    className={DesignCSS.colorChangeTitle}
                                    id='colorChangeTitle'
                                >筆刷顏色</div>
                                <div className={DesignCSS.colorChangePicker}>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Black} onClick={() => handleBrushColorChange('#000000')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.White} onClick={() => handleBrushColorChange('#FFFFFF')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Red} onClick={() => handleBrushColorChange('#ff0000')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Orange} onClick={() => handleBrushColorChange('#ffa500')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Yellow} onClick={() => handleBrushColorChange('#ffff00')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Green} onClick={() => handleBrushColorChange('#008000')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Blue} onClick={() => handleBrushColorChange('#0000ff')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Purple} onClick={() => handleBrushColorChange('#800080')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Brown} onClick={() => handleBrushColorChange('#a52a2a')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Gray} onClick={() => handleBrushColorChange('#808080')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.Pink} onClick={() => handleBrushColorChange('#ffc0cb')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.LightBlue} onClick={() => handleBrushColorChange('#add8e6')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.LightGreen} onClick={() => handleBrushColorChange('#90ee90')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.LightYellow} onClick={() => handleBrushColorChange('#ffffe0')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.LightPink} onClick={() => handleBrushColorChange('#ffb6c1')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.LightGray} onClick={() => handleBrushColorChange('#d3d3d3')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.GreenBlue} onClick={() => handleBrushColorChange('#14adff')}></div>
                                    <div className={DesignCSS.colorChangePickerButton} id={DesignCSS.WarmYellow} onClick={() => handleBrushColorChange('#ffcc00')}></div>
                                </div>
                            </div>
                            <div className={DesignCSS.eraserContainer}>
                                <div className={DesignCSS.eraserChangeTitle}>橡皮擦大小</div>
                                <div className={DesignCSS.eraserChangeContainer}>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange6px}></div>
                                    </div>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange8px}></div>
                                    </div>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange10px}></div>
                                    </div>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange12px}></div>
                                    </div>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange14px}></div>
                                    </div>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange16px}></div>
                                    </div>
                                    <div className={DesignCSS.eraserChangeBackground}>
                                        <div className={DesignCSS.eraserChange18px}></div>
                                    </div>
                                </div>
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
        </Layout >
    );
};

export default DesignGift;
