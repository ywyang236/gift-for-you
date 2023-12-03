// global.d.ts
interface Window {
    TPDirect?: {
        setupSDK: Function;
        card: {
            getTappayFieldsStatus(): unknown;
            setup: Function;
            getPrime: Function;
        };
    };
}
