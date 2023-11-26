// hooks/useAuthState.tsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {auth} from '@/lib/firebase/firebase';
import {logIn, logOut} from '@/store/slices/userSlice';

const AuthStateProvider = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                dispatch(logIn());
            } else {
                dispatch(logOut());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return null;
};

export default AuthStateProvider;

