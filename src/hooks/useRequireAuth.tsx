// hooks/useRequireAuth.ts
import {useSelector} from 'react-redux';
import {RootState} from '@/store/types/storeTypes';
import {useState} from 'react';

const useRequireAuth = () => {
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

    const requireAuth = (event: React.MouseEvent) => {
        if (!isLoggedIn) {
            event.preventDefault();
            setIsLoginModalVisible(true);
        }
    };

    return {
        isLoginModalVisible,
        setIsLoginModalVisible,
        requireAuth,
    };
};

export default useRequireAuth;
