// src/pages/__tests__/index.test.tsx
import React from 'react';
import {Provider} from 'react-redux';
import {render, screen} from '@testing-library/react';
import configureStore from 'redux-mock-store';
import '@testing-library/jest-dom';
import Home from '../index';
import AuthStateProvider from '../../hooks/useAuthState';
// import {expect} from '@jest/globals';

jest.mock('@/lib/firebase/firebase', () => ({
    auth: {
        onAuthStateChanged: jest.fn(() => jest.fn())
    },
    db: jest.fn(),
    storage: jest.fn(),
}));

const mockStore = configureStore();
const store = mockStore({
    user: {isLoggedIn: false}
});

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: ''
}))

test('renders Home component', () => {
    render(
        <Provider store={store}>
            <AuthStateProvider />
            <Home />
        </Provider>
    );
    const elements = screen.getAllByText('Gift For You');
    expect(elements.length).toBeGreaterThan(0);
    // expect(screen.getByText('Hand-draw your unique souvenir.')).toBeInTheDocument();
});
