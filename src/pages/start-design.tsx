// pages/design-gift.tsx
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Layout from '../app/layout';
import DesignCSS from '../styles/design.module.css';
import {IoArrowUndo, IoArrowRedo, IoBrush, IoClipboard, IoColorFill, IoColorPalette, IoColorWand, IoCopy, IoCrop, IoCut, IoDuplicate, IoEyedrop, IoEyeOff, IoEye, IoImage, IoLayers, IoOptions, IoText} from 'react-icons/io5';
import {IoEllipseSharp, IoHeart, IoMoon, IoSquareSharp, IoSquare, IoTriangle} from "react-icons/io5";
import {BsEraserFill, BsFillDiamondFill, BsFillHeptagonFill, BsFillHexagonFill, BsFillOctagonFill, BsFillPentagonFill, BsFillStarFill} from "react-icons/bs";
import Canvas from '../components/Canvas/Canvas';
import {setBrushSize, setBrushColor} from '../store/slices/brushSlice';
import {RootState} from '../store/types/storeTypes';
import {setEraserSize} from '../store/slices/eraserSlice';
import {activateBrush, activateEraser, deactivateBrush, deactivateEraser} from '../store/sharedActions';
import {db} from '../lib/firebase/firebase';
import {collection, addDoc, getDocs, doc, setDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytes} from "firebase/storage";
import Link from 'next/link';

const DesignGift = () => {
    const dispatch = useDispatch();
    const brushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const eraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const currentBrushSize = useSelector((state: RootState) => state.brush.brushSize);
    const currentEraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const currentBrushColor = useSelector((state: RootState) => state.brush.brushColor);
    const [lastBrushSize, setLastBrushSize] = useState<number>(currentBrushSize);
    const [lastBrushColor, setLastBrushColor] = useState<string>(currentBrushColor);
    const [paths, setPaths] = useState<Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>>([]);
    const [canvasSize, setCanvasSize] = useState<{width: number; height: number}>({width: 460, height: 420});

    const saveCanvasToFirebase = async () => {
        try {
            await addDoc(collection(db, "canvasData"), {
                paths: paths,
                createdAt: new Date()
            });
        } catch (error) {
        }
    };

    const loadCanvasFromFirebase = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "canvasData"));
            querySnapshot.forEach((doc) => {
                setPaths(doc.data().paths);
            });
        } catch (error) {
        }
    };

    useEffect(() => {
        loadCanvasFromFirebase();
    }, []);

    const handleToggleBrush = () => {
        if (eraserActive) {
            dispatch(setBrushSize(lastBrushSize));
        }
        dispatch(deactivateEraser());
        dispatch(activateBrush());
    };

    const handleToggleEraser = () => {
        if (brushActive) {
            setLastBrushSize(currentBrushSize);
            setLastBrushColor(currentBrushColor);
        }
        dispatch(deactivateBrush());
        dispatch(activateEraser());
    }

    const handleEraserSizeChange = (newEraserSize: number) => {
        dispatch(deactivateBrush());
        dispatch(setEraserSize(newEraserSize));
    }

    const handleBrushSizeChange = (newBrushSize: number) => {
        dispatch(deactivateEraser());
        dispatch(setBrushSize(newBrushSize));
    };

    const handleBrushColorChange = (newBrushColor: string) => {
        if (eraserActive) {
            dispatch(setBrushColor(newBrushColor));
            dispatch(deactivateEraser());
            dispatch(activateBrush());
        } else {
            dispatch(setBrushColor(newBrushColor));
        }
        dispatch(setBrushColor(newBrushColor));
    };

    const clearCanvasContent = () => {
        setPaths([]);
    };

    const drawPathsOnCanvas = (canvas: any) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        paths.forEach(path => {
            ctx.beginPath();
            path.points.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.strokeStyle = path.brushColor;
            ctx.lineWidth = path.brushSize;
            ctx.stroke();
        });
    };

    const downloadCanvas = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        drawPathsOnCanvas(canvas);

        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `Gift-For-You-${new Date().toLocaleDateString()}.png`;
        link.href = image;
        link.click();
    };

    const saveDataToFirebase = async () => {
        const confirmSave = window.confirm("加入購物車後就不能再修改了，您確定要繼續嗎？");
        if (!confirmSave) return;

        const userId = 'some_unique_user_id';
        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        drawPathsOnCanvas(canvas);

        const image = canvas.toDataURL('image/png', 1.0);
        const imageName = `Gift-For-You-${new Date().toLocaleDateString()}.png`;

        const storage = getStorage();
        const storageRef = ref(storage, `canvasImages/${imageName}`);
        const imgBlob = await (await fetch(image)).blob();
        await uploadBytes(storageRef, imgBlob);

        const docRef = doc(db, "canvasData", userId);
        await setDoc(docRef, {
            paths: paths,
            createdAt: new Date(),
            imageUrl: `canvasImages/${imageName}`
        }, {merge: true});

        alert('已成功加入購物車');
        window.location.href = '/cart';
    };


    const pathToSVG = (path: {points: any[]; brushColor: any; brushSize: any;}) => {
        let svgPath = path.points.reduce((acc, point, index) => {
            acc += `${index === 0 ? 'M' : 'L'}${point.x},${point.y} `;
            return acc;
        }, '');
        svgPath = `<path d="${svgPath}" stroke="${path.brushColor}" stroke-width="${path.brushSize}" fill="none"/>`;
        return svgPath;
    };

    const exportToSVG = () => {
        const svgPaths = paths.map(pathToSVG).join('');
        const svgElement = `<svg width="${canvasSize.width}" height="${canvasSize.height}" viewBox="0 0 ${canvasSize.width} ${canvasSize.height}" xmlns="http://www.w3.org/2000/svg">${svgPaths}</svg>`;
        return svgElement;
    };

    const handleExportSVG = () => {
        const svgData = exportToSVG();
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'drawing.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <Layout>
            <div className={DesignCSS.main}>
                <div className={DesignCSS.container}>
                    <div className={DesignCSS.designNavbar}>
                        <div className={DesignCSS.designTitle}>幾何造型夜燈</div>
                        <div className={DesignCSS.designButtonContainer}>
                            <IoBrush
                                className={`${DesignCSS.designButton} ${brushActive ? DesignCSS.designButtonActive : ''}`}
                                onClick={handleToggleBrush}
                            />
                            <BsEraserFill
                                className={`${DesignCSS.designButton} ${eraserActive ? DesignCSS.designButtonActive : ''}`}
                                onClick={handleToggleEraser}
                            />
                            <IoArrowUndo className={DesignCSS.designButton} />
                            <IoArrowRedo className={DesignCSS.designButton} />
                            <IoImage className={DesignCSS.designButton} />
                            <IoText className={DesignCSS.designButton} />
                            <span
                                className={DesignCSS.quiteButton}
                                onClick={saveCanvasToFirebase}
                            >儲存畫布</span>
                            <span
                                className={DesignCSS.quiteButton}
                                onClick={clearCanvasContent}
                            >清除畫布</span>
                            <span
                                className={DesignCSS.quiteButton}
                                onClick={downloadCanvas}
                            >下載PNG</span>
                            <span
                                className={DesignCSS.quiteButton}
                                onClick={handleExportSVG}
                            >下載SVG</span>
                            <span
                                className={DesignCSS.quiteButton}
                                onClick={saveDataToFirebase}
                            >Firebase</span>
                            <span
                                className={DesignCSS.addCartButton}
                            >加入購物車</span>
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
                                            setBrushSize={handleBrushSizeChange}
                                            setBrushColor={handleBrushColorChange}
                                            handleExportSVG={handleExportSVG}
                                            paths={paths}
                                            setPaths={setPaths}
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
                                <div className={DesignCSS.colorChangeTitle}>筆刷顏色</div>
                                <div className={DesignCSS.colorChangePicker}>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#000000' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Black}
                                        onClick={() => handleBrushColorChange('#000000')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#FFFFFF' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.White}
                                        onClick={() => handleBrushColorChange('#FFFFFF')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ff0000' ? DesignCSS.colorChangePickerButtonActive : ''} `}
                                        id={DesignCSS.Red}
                                        onClick={() => handleBrushColorChange('#ff0000')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ffa500' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Orange
                                        } onClick={() => handleBrushColorChange('#ffa500')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ffff00' ? DesignCSS.colorChangePickerButtonActive : ''} `}
                                        id={DesignCSS.Yellow}
                                        onClick={() => handleBrushColorChange('#ffff00')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#008000' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Green}
                                        onClick={() => handleBrushColorChange('#008000')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#0000ff' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Blue}
                                        onClick={() => handleBrushColorChange('#0000ff')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#4b0082' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Purple
                                        } onClick={() => handleBrushColorChange('#800080')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#a52a2a' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Brown}
                                        onClick={() => handleBrushColorChange('#a52a2a')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#808080' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Gray}
                                        onClick={() => handleBrushColorChange('#808080')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ff00ff' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.Pink}
                                        onClick={() => handleBrushColorChange('#ffc0cb')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#add8e6' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.LightBlue}
                                        onClick={() => handleBrushColorChange('#add8e6')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#90ee90' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.LightGreen}
                                        onClick={() => handleBrushColorChange('#90ee90')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ffffe0' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.LightYellow}
                                        onClick={() => handleBrushColorChange('#ffffe0')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ffb6c1' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.LightPink}
                                        onClick={() => handleBrushColorChange('#ffb6c1')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#d3d3d3' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.LightGray}
                                        onClick={() => handleBrushColorChange('#d3d3d3')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#f0f8ff' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.GreenBlue}
                                        onClick={() => handleBrushColorChange('#14adff')}></div>
                                    <div
                                        className={`${DesignCSS.colorChangePickerButton} ${brushActive && currentBrushColor === '#ffcc00' ? DesignCSS.colorChangePickerButtonActive : ''}`}
                                        id={DesignCSS.WarmYellow}
                                        onClick={() => handleBrushColorChange('#ffcc00')}></div>
                                </div>
                            </div>
                            <div className={DesignCSS.eraserContainer}>
                                <div className={DesignCSS.eraserChangeTitle}>橡皮擦大小</div>
                                <div className={DesignCSS.eraserChangeContainer}>

                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 6) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(6)}>
                                        <div className={DesignCSS.eraserChange6px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 8) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(8)}>
                                        <div className={DesignCSS.eraserChange8px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 10) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(10)}>
                                        <div className={DesignCSS.eraserChange10px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 12) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(12)}>
                                        <div className={DesignCSS.eraserChange12px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 14) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(14)}>
                                        <div className={DesignCSS.eraserChange14px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 16) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(16)}>
                                        <div className={DesignCSS.eraserChange16px}></div>
                                    </div>
                                    <div
                                        className={`${DesignCSS.eraserChangeBackground} ${(eraserActive && currentEraserSize === 18) ? DesignCSS.eraserChangeBackgroundActive : ''}`}
                                        onClick={() => handleEraserSizeChange(18)}>
                                        <div className={DesignCSS.eraserChange18px}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={DesignCSS.textChangeConteiner}>
                                <div className={DesignCSS.textChangeTitle}>文字外觀</div>
                                <div className={DesignCSS.textChangeFontBackground}>
                                    <div className={DesignCSS.textChangeFrontButton}>Helvetica</div>
                                </div>
                                <div className={DesignCSS.sizeColorBoldContainer}>
                                    <div className={DesignCSS.textChangeSizeBackground}>
                                        <div className={DesignCSS.textChangeSizeButton}>16</div>
                                    </div>
                                    <div className={DesignCSS.textChangeColorBackground}>
                                        <div className={DesignCSS.textChangeColorButton}>顏色</div>
                                    </div>
                                    <div className={DesignCSS.textChangeBoldBackground}>
                                        <div className={DesignCSS.textChangeBoldButton}>粗體</div>
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
