// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => (
	<nav>
		<Link href='/design-gift'><a>開始設計</a></Link>
		<Link href='/order-information'><a>訂單資訊</a></Link>
		<Link href='/member-information'><a>會員資料</a></Link>
	</nav>
);

export default Navbar;
