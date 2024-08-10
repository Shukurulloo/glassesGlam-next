import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/property':
					title = 'Discover Your Perfect Glasses';
					desc = 'Browse our exclusive collection to find the glasses that perfectly match your unique style and needs!';
					bgImage = '/img/banner/back-rebbit.jpeg';
					break;
				case '/agent':
					title = 'Meet Our Agents';
					desc = 'Discover and connect with our dedicated agents, each committed to helping you find the perfect property. Let our expertise guide your journey home.';
					bgImage = '/img/banner/agent-back.jpg';
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Explore Our Expert  Agent / Available for Assistance';
					bgImage = '/img/banner/background-agent.jpg';
					break;
				case '/mypage':
					title = 'My Page';
					desc = 'Tailor your experience and manage your account effortlessly.';
					bgImage = '/img/banner/background10.jpg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Explore our vibrant community where connections are made, and neighbors become friends. Join us in building a thriving, supportive environment for everyone.';
					bgImage = '/img/banner/background09.jpg';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Dive into our vibrant communities and explore what each neighborhood has to offer!';
					bgImage = '/img/banner/background10.jpg';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We’re excited to have you back! Let’s continue where we left off.';
					bgImage = '/img/banner/background10.jpg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Join us or sign in to continue your journey with ease.';
					bgImage = '/img/banner/background10.jpg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Access your personalized dashboard and stay connected with the latest updates.';
					bgImage = '/img/banner/background10.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

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
						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								width:"100%",
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack >

							</Stack>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>
						{/* chatting */}
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

export default withLayoutBasic;
