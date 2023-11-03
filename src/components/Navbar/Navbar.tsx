// components/Navbar/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import NavbarCSS from './Navbar.module.css';

const Navbar: React.FC = () => (
	<nav className={NavbarCSS.container}>
		<span>
			<Link href='/'>禮品訂製所 Gift For You</Link>
		</span>
		<Link href='/design-gift'>開始設計</Link>
		<Link href='/order-information'>訂單資訊</Link>
		<Link href='/member-information'>會員資料</Link>
	</nav>
);

export default Navbar;
