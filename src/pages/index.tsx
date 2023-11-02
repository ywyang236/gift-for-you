// pages/index.tsx
import React from 'react';
import Link from 'next/link';

const Home = () => {
    return (
        <div>
            <h1>禮品訂製所 Gift For You</h1>
            <nav>
                <Link href="/design-gift">設計禮品</Link>
                <Link href="/order-info">訂單資訊</Link>
                <Link href="/member-info">會員資料</Link>
            </nav>
        </div>
    );
};

export default Home;
