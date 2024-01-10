### Gift For You

"Gift For You" is a website for customizing gift items. It offers a canvas for users to design product patterns online and enables them to instantly preview the design results on the products."

Website：https://gift-for-you-2023.vercel.app/

![Gift For You Home Page](public/images/README/README.jpeg)


### Technology Stack

- **React**：`useEffect`, `useState`, `useCallback`
- **Custom Hooks**：`useAuthState`, `useRequireAuth`
- **Redux**：`useSelector`, `useDispatch`
- **Redux Toolkit**：`createSlice`, `createAction`
- **Next.js**：App Router
- **TypeScript**
- **ESLint**
- **Jest**：Integration Tests
- **Self-Built WYSIWYG Canvas Editor**
- **Firebase**：Cloud Firestore, Storage, Authentication
- **Vercel**
<!-- 補圖-->

### RWD：300 px ~ 2000 px
![Gift For You RWD](public/images/README/homepage-RWD.gif)


### Complete Process
<!-- 待補 GIF 動畫圖-->

### Canvas Editor
#### (１) Brush
![Brush](public/images/README/brush.gif)

#### (２) Eraser
![Eraser](public/images/README/eraser.gif)

#### (３) Undo & Redo
![Undo & Redo](public/images/README/undo-and-redo.gif)

#### (４) Drag
![Drag](public/images/README/drag.gif)

#### (５) React Hotkeys Hook
![React Hotkeys Hook](public/images/README/hotkeys.jpeg)

| Name             | Function                    | Keyboard Shortcuts                |
|------------------|-----------------------------|-----------------------------------|
| Cursor           | Switch to cursor mode       | `v`                               |
| Brush            | Switch to brush tool        | `b`                               |
| Eraser           | Switch to eraser tool       | `e`                               |
| Undo             | Undo the last action        | `meta+z`, `ctrl+z`                |
| Redo             | Redo the last undone action | `meta+shift+z`, `ctrl+shift+z`    |
| Drag             | Switch to drag tool         | `d`                               |
| Product Details  | Display product details     | `i`                               |
| Clear Canvas     | Clear the canvas content    | `meta+delete`, `ctrl+delete`      |
| Save Canvas      | Save to Firebase            | `s`                               |
| Add to Cart      | Add canvas to shopping cart | `Enter`                           |


### Supplementary Features

#### (１) Member System (Login & Logout)
![Member System](public/images/README/login-and-logout.gif)

#### (２) Shopping Cart
![Shopping Cart](public/images/README/cart.gif)

#### (３) Third-Party Payment (Tappay)
![Payment](public/images/README/payment.gif)

#### (３) Order History
![Order History](public/images/README/order-history.gif)

### Component Strusture
![Component Strusture](public/images/README/components.jpeg)

### Custom Hooks

#### (１) useAuthState
The useAuthState hook is designed for managing user authentication states in a React application. It leverages Firebase's authentication service to listen for changes in the user's authentication status.

#### (２) useRequireAuth
The useRequireAuth hook is utilized to manage access control in React components, particularly when certain user interactions require the user to be authenticated (logged in).


### Canvas Structure Diagram

![Canvas Structure Diagram](public/images/README/brush-and-canvas.gif)

### Redux Toolkit
  
![Redux Toolkit](public/images/README/toolkit.gif)

### Jest
#### (１) Integration Tests
![Integration Tests](public/images/README/jest-integration-tests.png)


