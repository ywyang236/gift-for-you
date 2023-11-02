// pages/index.tsx
import React from 'react';
import Link from 'next/link';

const Home = () => {
    return (
        <div>
            <h1>禮品訂製所 Gift For You</h1>
            <nav>
                <Link href="/design-gift"><a>設計禮品</a></Link>
                <Link href="/order-info"><a>訂單資訊</a></Link>
                <Link href="/member-info"><a>會員資料</a></Link>
            </nav>
        </div>
    );
};

export default Home;
