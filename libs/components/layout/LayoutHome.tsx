import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Button, Link, Stack } from '@mui/material';
import FiberContainer from '../common/FiberContainer';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>GlassesGlam</title>
						<meta name={'title'} content={`GlassesGlam`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>GlassesGlam</title>
						<meta name={'title'} content={`GlassesGlam`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							{/* <FiberContainer /> */}
							<Stack className={'header'}>
								<div style={{width:"100%", display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"center"}}>
									<div className="main-title">See the World Through Style</div>
									<div className="tagline">
										Welcome to <span className="brand-name">GlassesGlam</span> - the perfect place to find your new
										favorite glasses every day.
									</div>
									<div className="description">Discover your style with our wide range of affordable glasses.</div>
									<Link href={'/property'}>
										<button className="button">SHOP NOW</button>
									</Link>
								</div>

								<Stack className={'container'}>
									<HeaderFilter />
								</Stack>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
