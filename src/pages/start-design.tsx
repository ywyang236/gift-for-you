// pages/design-gift.tsx
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import Layout from '../app/layout';
import DesignCSS from '../styles/design.module.css';
import {IoArrowUndo, IoArrowRedo, IoBrush, IoInformationCircleSharp, IoTrash, IoCloudUpload, IoEllipseSharp, IoHeart, IoMoon, IoSquareSharp, IoSquare, IoTriangle, IoImage, IoText} from 'react-icons/io5';
import {IoClipboard, IoColorFill, IoColorPalette, IoColorWand, IoCopy, IoCrop, IoCut, IoDuplicate, IoEyedrop, IoEyeOff, IoEye, IoLayers, IoOptions} from "react-icons/io5";
import {BsEraserFill, BsFillDiamondFill, BsFillHeptagonFill, BsFillHexagonFill, BsFillOctagonFill, BsFillPentagonFill, BsFillStarFill} from "react-icons/bs";
import {GiArrowCursor} from "react-icons/gi";
import {RiDragMove2Fill} from "react-icons/ri";
import {FaSlash} from "react-icons/fa";
import {PiFilePngFill, PiFileSvgFill} from "react-icons/pi";
import Canvas from '../components/Canvas/Canvas';
import {RootState} from '../store/types/storeTypes';
import {activateBrush, activateEraser, deactivateBrush, deactivateEraser, activateDrag, deactivateDrag} from '../store/sharedActions';
import {setBrushSize, setBrushColor} from '../store/slices/brushSlice';
import {setEraserSize} from '../store/slices/eraserSlice';
import {setSelectedPathIndex} from '../store/slices/dragSlice';
import {db} from '../lib/firebase/firebase';
import {collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {getAuth, onAuthStateChanged} from 'firebase/auth';


interface ProductInfo {
    name: string;
    accessories: string[];
    customization: string;
    price: number;
    image: string;
}

const DesignGift = () => {
    const dispatch = useDispatch();
    const brushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const eraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const currentBrushSize = useSelector((state: RootState) => state.brush.brushSize);
    const currentEraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const currentBrushColor = useSelector((state: RootState) => state.brush.brushColor);
    const dragActive = useSelector((state: RootState) => state.drag.isDragActive);
    const [lastBrushSize, setLastBrushSize] = useState<number>(currentBrushSize);
    const [lastBrushColor, setLastBrushColor] = useState<string>(currentBrushColor);
    const [paths, setPaths] = useState<Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>>([]);
    const [canvasSize, setCanvasSize] = useState<{width: number; height: number}>({width: 460, height: 430});
    const router = useRouter();
    const productId = router.query.product;
    const [backgroundImage, setBackgroundImage] = useState('');
    const [productName, setProductName] = useState('-');
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [undoStack, setUndoStack] = useState<Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>>([]);
    const [redoStack, setRedoStack] = useState<Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>>([]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);



    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/svg+xml,image/png';
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target && target.files && target.files.length > 0) {
                const file = target.files[0];
                if (file.type === "image/svg+xml" || file.type === "image/png") {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const result = e.target!.result;
                        if (typeof result === 'string') {
                            setUploadedImage(result);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('請上傳 SVG 或 PNG 檔案。');
                }
            }
        };
        input.click();
    };

    const handleUndo = () => {
        if (paths.length > 0 && undoStack.length < 10) {
            const newPaths = [...paths];
            const poppedPath = newPaths.pop();
            if (poppedPath) {
                setPaths(newPaths);
                setUndoStack([...undoStack, poppedPath]);
                setRedoStack([...redoStack, poppedPath]);
            }
        }
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            const newRedoStack = [...redoStack];
            const poppedPath = newRedoStack.pop();
            if (poppedPath) {
                setPaths([...paths, poppedPath]);
                setRedoStack(newRedoStack);
            }
        }
    };



    useEffect(() => {
        if (userId) {
            const userCollectionRef = collection(db, "users", userId, "data");
            getDocs(userCollectionRef).then((snapshot) => {
                if (snapshot.empty) {
                    const canvasDataRef = doc(userCollectionRef, "canvasData");
                    setDoc(canvasDataRef, {paths: [], createdAt: new Date()});

                    const userCartRef = doc(userCollectionRef, "user_cart");
                    setDoc(userCartRef, {items: [], createdAt: new Date()});
                }
            });
        }
    }, [userId]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!router.isReady) return;

        const productId = router.query.product;
        if (!productId) {
            console.log('產品 ID 缺失');
            return;
        }

        const fetchProductInfo = async () => {
            if (productId) {
                const querySnapshot = await getDocs(collection(db, "products"));
                let productFound = false;

                querySnapshot.forEach((doc) => {
                    if (doc.data().id === productId) {
                        productFound = true;
                        const productData = doc.data() as ProductInfo;
                        setProductName(productData.name);
                        setProductInfo(productData);
                        const imageRef = ref(getStorage(), productData.image);
                        getDownloadURL(imageRef)
                            .then((url) => setBackgroundImage(url))
                            .catch((error) => console.error("Error fetching image:", error));
                    }
                });

                if (!productFound) {
                    console.log(`找不到該產品的資訊: ${productId}`);
                }
            }
        };

        fetchProductInfo();
    }, [router.isReady, router.query.product]);

    const showProductDetails = () => {
        if (productInfo) {
            alert(`
            商品名稱：${productInfo.name}
            商品配件：${productInfo.accessories}
            訂製方式：${productInfo.customization}
            商品單價：新台幣 ${productInfo.price} 元
            `);
        } else {
            console.log('尚未獲取產品資訊');
        }
    };

    const loadCanvasFromFirebase = useCallback(async () => {
        if (!userId) {
            console.log('用戶未登入');
            return;
        }

        const userCanvasDataRef = doc(db, "users", userId, "data", "canvasData");
        const docSnap = await getDoc(userCanvasDataRef);

        if (docSnap.exists()) {
            const canvasData = docSnap.data();
            if (canvasData) {
                setPaths(canvasData.paths);
            }
        } else {
            console.log('沒有找到用戶的畫布數據');
        }
    }, [userId]);

    useEffect(() => {
        loadCanvasFromFirebase();
    }, [loadCanvasFromFirebase]);

    const handleCursorClick = () => {
        dispatch(deactivateBrush());
        dispatch(deactivateEraser());
        dispatch(deactivateDrag());
    };

    const handleToggleDrag = () => {
        if (dragActive) {
            dispatch(deactivateDrag());
        } else {
            dispatch(activateDrag());
            dispatch(deactivateEraser());
            dispatch(deactivateBrush());
        }
    };
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
        if (dragActive) {
            dispatch(deactivateDrag());
        }
    }

    const handleBrushSizeChange = (newBrushSize: number) => {
        dispatch(deactivateEraser());
        dispatch(setBrushSize(newBrushSize));
        if (dragActive) {
            dispatch(deactivateDrag());
        }
    };

    const handleBrushColorChange = (newBrushColor: string) => {
        if (eraserActive) {
            dispatch(setBrushColor(newBrushColor));
            dispatch(deactivateEraser());
            dispatch(activateBrush());
        } else {
            dispatch(setBrushColor(newBrushColor));
        }
        if (dragActive) {
            dispatch(deactivateDrag());
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

    const saveCanvasToFirebase = async () => {
        if (!userId) {
            console.log('用戶未登入');
            return;
        }

        document.body.style.cursor = 'wait';

        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        drawPathsOnCanvas(canvas);

        const image = canvas.toDataURL('image/png', 1.0);
        const imageName = `Canvas-${new Date().toLocaleDateString()}.png`;
        const storage = getStorage();
        const storageRef = ref(storage, `canvasImages/${imageName}`);
        const imgBlob = await (await fetch(image)).blob();

        try {
            await uploadBytes(storageRef, imgBlob);
            window.alert('上傳成功！');
        } catch (error) {
            window.alert('上傳失敗，請重試！');
        } finally {
            document.body.style.cursor = 'default';
        }

        if (userId) {
            const userCanvasDataRef = doc(db, "users", userId, "data", "canvasData");
            await setDoc(userCanvasDataRef, {
                paths: paths,
                createdAt: new Date(),
                imageUrl: `canvasImages/${imageName}`
            }, {merge: true});
        }
    };

    const addToCart = async () => {
        if (!userId) {
            console.log('用戶未登入');
            return;
        }

        const confirmSave = window.confirm("加入購物車後就不能再修改了，您確定要繼續嗎？");
        if (!confirmSave) return;

        const canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        drawPathsOnCanvas(canvas);

        const image = canvas.toDataURL('image/png', 1.0);
        const imageName = `Gift-${productId}-${new Date().toLocaleDateString()}.png`;

        const storage = getStorage();
        const storageRef = ref(storage, `canvasImages/${imageName}`);
        const imgBlob = await (await fetch(image)).blob();
        await uploadBytes(storageRef, imgBlob);

        const docRef = doc(db, "users", userId, "data", "canvasData");
        await setDoc(docRef, {
            paths: [],
            createdAt: new Date(),
            imageUrl: `canvasImages/${imageName}`
        }, {merge: true});

        if (!productInfo) {
            console.error("產品資訊尚未加載");
            return;
        }

        const cartItem = {
            id: Date.now().toString(),
            productId: productId,
            name: productInfo.name,
            accessories: productInfo.accessories,
            customization: productInfo.customization,
            price: productInfo.price,
            image: backgroundImage,
            canvasPath: `canvasImages/${imageName}`,
            canvasImage: image
        };

        if (userId) {
            const userCartRef = doc(db, "users", userId, "data", "user_cart");
            await updateDoc(userCartRef, {
                items: arrayUnion(cartItem)
            });
        }

        alert('已成功加入購物車');
        setPaths([]);
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
                        <div className={DesignCSS.designTitle}>{productName}</div>
                        <div className={DesignCSS.designButtonContainer}>
                            <GiArrowCursor className={DesignCSS.designButton} onClick={handleCursorClick} />
                            <IoBrush
                                className={`${DesignCSS.designButton} ${brushActive ? DesignCSS.designButtonActive : ''}`}
                                onClick={handleToggleBrush}
                            />
                            <BsEraserFill
                                className={`${DesignCSS.designButton} ${eraserActive ? DesignCSS.designButtonActive : ''}`}
                                onClick={handleToggleEraser}
                            />
                            <IoArrowUndo
                                className={DesignCSS.designButton}
                                onClick={handleUndo} />
                            <IoArrowRedo className={DesignCSS.designButton} onClick={handleRedo} />
                            <IoImage className={DesignCSS.designButton} onClick={handleImageUpload} />
                            <FaSlash className={DesignCSS.designButton} />
                            <RiDragMove2Fill
                                className={`${DesignCSS.designButton} ${dragActive ? DesignCSS.designButtonActive : ''}`}
                                onClick={handleToggleDrag}
                            />
                            <IoText className={DesignCSS.designButton} />
                            <IoInformationCircleSharp className={DesignCSS.designButton} onClick={showProductDetails} />
                            <IoTrash className={DesignCSS.designButton} onClick={clearCanvasContent} />
                            <IoCloudUpload className={DesignCSS.designButton} onClick={saveCanvasToFirebase} />
                            <PiFilePngFill className={DesignCSS.designButton} onClick={downloadCanvas} />
                            <PiFileSvgFill className={DesignCSS.designButton} onClick={handleExportSVG} />
                            <span
                                className={DesignCSS.addCartButton}
                                onClick={addToCart}
                            >加入購物車</span>
                        </div>
                    </div>
                    <div className={DesignCSS.designDown}>
                        <div className={DesignCSS.designCanvasContainer}>
                            <div className={DesignCSS.designItem} style={{backgroundImage: `url(${backgroundImage})`}}>
                                <div className={DesignCSS.designCanvas}>
                                    <div>
                                        <Canvas
                                            width={460}
                                            height={430}
                                            isBrushActive={brushActive}
                                            setBrushSize={handleBrushSizeChange}
                                            setBrushColor={handleBrushColorChange}
                                            handleExportSVG={handleExportSVG}
                                            paths={paths}
                                            setPaths={setPaths}
                                            uploadedImage={uploadedImage}
                                            isDragActive={dragActive}
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