import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { NotificDto } from '../types/notification/notification';
import { NotificationUpdate } from '../types/notification/notification.update';
import { NextPage } from 'next';
import { NotificationStatus } from '../enums/notification.enum';
import { UPDATE_NOTIFICATION } from '../../apollo/user/mutation';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';

const Top: NextPage = ({ intialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);

	// notification part
	const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLElement | null>(null);
	const [notifications, setNotifications] = useState<NotificDto[]>([]);
	const notificationOpen = Boolean(notificationAnchorEl);
	const [updateData, setUpdateData] = useState<NotificationUpdate>(intialValues);
	const [unreadCount, setUnreadCount] = useState(0);

	//Apollo query
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);

	const {
		loading: notificationsLoading,
		data: notificationsData,
		error: notificationsError,
		refetch: refetchNotifications,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 100, search: { receiverId: '' } } },
		notifyOnNetworkStatusChange: true,

		onCompleted: (data) => {
			if (data?.getNotifcations?.list) {
				setNotifications(data?.getNotifcations?.list);
				const unread = data?.getNotifcations?.list.filter(
					(notification: any) => notification.notificationStatus === NotificationStatus.WAIT,
				).length;
				setUnreadCount(unread);
			}
		},
	});

	useEffect(() => {
		if (notificationsData) {
			setNotifications(notificationsData.getNotifications.list);
			const unread = notificationsData.getNotifications.list.filter(
				(notification: any) => notification.notificationStatus === NotificationStatus.WAIT,
			).length;
			setUnreadCount(unread);
		}
	}, [notificationsData]);

	useEffect(() => {
		if (notificationsData?.getNotifcations?.list) {
			setNotifications(notificationsData.getNotifcations.list);
			notificationsData.getNotifications.list.forEach((notification: { _id: any }) => {
				console.log('Notification_id:', notification._id); // check if id is exist
			});
		}
	}, [notificationsData]);

	let notifics = notificationsData?.getNotifications?.list;

	const [hasNewNotifications, setHasNewNotifications] = useState(false);

	useEffect(() => {
		if (
			notifications &&
			notifications.some((notification) => notification.notificationStatus === NotificationStatus.WAIT)
		) {
			setHasNewNotifications(true);
		} else {
			setHasNewNotifications(false);
		}
	}, [notifications]);

	useEffect(() => {
		if (!notificationOpen) {
			refetchNotifications();
		}
	}, [notificationOpen, refetchNotifications]);

	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleNotificationClick = (event: React.MouseEvent<SVGSVGElement>) => {
		setNotificationAnchorEl(event.currentTarget as unknown as HTMLElement);
	};

	const handleMenuItemClick = (notification: NotificDto) => {
		if (!notification.propertyId && !notification.articleId) {
			router.push(`/member?memberId=${notification.authorId}`);
		} else if (notification.articleId) {
			router.push(`/community/detail?id=${notification.articleId}`);
		} else if (notification.propertyId) {
			router.push(`/product/detail?id=${notification.propertyId}`);
		}

		const updateNotification: NotificationUpdate = {
			_id: notification._id,
			notificationStatus: NotificationStatus.READ,
		};
		updateNotificationHandler(updateNotification);
	};

	const handleNotificationClose = () => {
		setNotificationAnchorEl(null);
	};

	const updateNotificationHandler = async (updateData: NotificationUpdate) => {
		try {
			console.log('+updateData:', updateData);
			await updateNotification({
				variables: {
					input: updateData,
				},
			});
			await refetchNotifications;
		} catch (err: any) {
			console.log('Error on updateNotificationHandler', err.message);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	// const toggleNotifications = () => {
	// 	setShowNotifications((prev) => !prev);
	// };

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return <Stack className={'top'}></Stack>;
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
				<Stack     style={{
 								backgroundColor: '#7f8c8d',
 								width: '100%',
 								height: '30px',
 								display: 'flex',
 								alignItems: 'center',
 								justifyContent: 'center',
 							}}
 						>
 							<p style={{ margin: 0, color: '#fff' }}>10% off ORDERS over $30</p>
 						</Stack>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/logo.JPG" alt="" style={{ width: '100px' }} />
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/property'}>
								<div>{t('Products')}</div>
							</Link>
							<Link href={'/agent'}>
								<div> {t('Agents')} </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div> {t('Community')} </div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div> {t('My Page')} </div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div> {t('CS')} </div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && (
									<div style={{ position: 'relative', display: 'inline-block', color: 'white', cursor: 'pointer'}}>
										<NotificationsOutlinedIcon className={'notification-icon'} onClick={handleNotificationClick} />
										{hasNewNotifications && (
											<div
												style={{
													border:"1px solid red",
													position: 'absolute',
													top: '-10px',
													right: '-3px',
													width: '15px',
													height: '15px',
													borderRadius: '50%',
													backgroundColor: '#ef1d26',
												}}
											>
												{' '}
												{unreadCount > 0 && (
													<span
														style={{ fontSize: '12px', fontWeight: '600', display: 'flex', justifyContent: 'center' }}
													>
														{unreadCount}
													</span>
												)}
											</div>
										)}
										<Menu
											anchorEl={notificationAnchorEl}
											open={Boolean(notificationAnchorEl)}
											onClose={handleNotificationClose}
											MenuListProps={{
												'aria-labelledby': 'notification-button',
											}}
											PaperProps={{
												style: {
													padding: '20px',
													marginTop: '40px',
													minHeight: '400px',
													minWidth: '400px',
													maxHeight: '400px',
													width: '400px',
													whiteSpace: 'normal',
													wordWrap: 'break-word',
													borderRadius: '22px',
													background: 'white',
													fontSize: '16px',
												},
											}}
										>
											<strong>Notifications</strong>
											{!notificationsLoading && (!notifics || notifics.length === 0) && (
												<MenuItem style={{ margin: '100' }}>No notifications</MenuItem>
											)}

											{notificationsLoading && <MenuItem>Loading...</MenuItem>}
											{notifics &&
												notifics.map((notification: any) => {
													const isRead = notification.notificationStatus === NotificationStatus.READ;
													const notSeen = notification.notificationStatus === NotificationStatus.WAIT;

													return (
														<MenuItem
															key={notification._id}
															onClick={() => handleMenuItemClick(notification)}
															style={{
																whiteSpace: 'normal',
																wordWrap: 'break-word',
																backgroundColor: isRead ? '#d2e4f7' : '#f8c2c2',
																borderRadius: 20,
																padding: '10px',
																margin: 10,
															}}
														>
															<div style={{ display: 'flex', alignItems: 'center' }}>
																{notSeen && (
																	<div
																		style={{
																			width: '10px',
																			height: '10px',
																			borderRadius: '50%',
																			backgroundColor: '#42a5f5',
																			marginRight: '20px',
																		}}
																	/>
																)}

																<div>
																	<strong>{notification.notificationTitle}</strong>
																	<p>{notification.notificationDesc}</p>
																</div>
															</div>
														</MenuItem>
													);
												})}
										</Menu>
									</div>
								)}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={25} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>
								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="uz"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
				
			</Stack>
		);
	}
};

export default withRouter(Top);

// import React, { useCallback, useEffect, useRef } from 'react';
// import { useState } from 'react';
// import { useRouter, withRouter } from 'next/router';
// import { useTranslation } from 'next-i18next';
// import { getJwtToken, logOut, updateUserInfo } from '../auth';
// import { Stack, Box } from '@mui/material';
// import MenuItem from '@mui/material/MenuItem';
// import Button from '@mui/material/Button';
// import { alpha, styled } from '@mui/material/styles';
// import Menu, { MenuProps } from '@mui/material/Menu';
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
// import { CaretDown } from 'phosphor-react';
// import useDeviceDetect from '../hooks/useDeviceDetect';
// import Link from 'next/link';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// import { useReactiveVar } from '@apollo/client';
// import { userVar } from '../../apollo/store';
// import { Logout } from '@mui/icons-material';
// import { REACT_APP_API_URL } from '../config';

// const Top = () => {
// 	const device = useDeviceDetect();
// 	const user = useReactiveVar(userVar);
// 	const { t, i18n } = useTranslation('common'); // t harfi lug'atga kiritilgan so'zlarni chaqiradi
// 	const router = useRouter();
// 	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
// 	const [lang, setLang] = useState<string | null>('en');
// 	const drop = Boolean(anchorEl2);
// 	const [colorChange, setColorChange] = useState(false);
// 	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
// 	let open = Boolean(anchorEl);
// 	const [bgColor, setBgColor] = useState<boolean>(false);
// 	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
// 	const logoutOpen = Boolean(logoutAnchor);

// 	/** LIFECYCLES **/
// 	useEffect(() => {
// 		if (localStorage.getItem('locale') === null) {
// 			localStorage.setItem('locale', 'en');
// 			setLang('en');
// 		} else {
// 			setLang(localStorage.getItem('locale'));
// 		}
// 	}, [router]);

// 	useEffect(() => {
// 		switch (router.pathname) {
// 			case '/property/detail':
// 				setBgColor(true);
// 				break;
// 			default:
// 				break;
// 		}
// 	}, [router]);

// 	useEffect(() => {
// 		const jwt = getJwtToken();
// 		if (jwt) updateUserInfo(jwt);
// 	}, []);

// 	/** HANDLERS **/
// 	const langClick = (e: any) => {
// 		setAnchorEl2(e.currentTarget);
// 	};

// 	const langClose = () => {
// 		setAnchorEl2(null);
// 	};

// 	const langChoice = useCallback(
// 		async (e: any) => {
// 			setLang(e.target.id);
// 			localStorage.setItem('locale', e.target.id);
// 			setAnchorEl2(null);
// 			await router.push(router.asPath, router.asPath, { locale: e.target.id });
// 		},
// 		[router],
// 	);

// 	const changeNavbarColor = () => {
// 		if (window.scrollY >= 50) {
// 			setColorChange(true);
// 		} else {
// 			setColorChange(false);
// 		}
// 	};

// 	const handleClose = () => {
// 		setAnchorEl(null);
// 	};

// 	const handleHover = (event: any) => {
// 		if (anchorEl !== event.currentTarget) {
// 			setAnchorEl(event.currentTarget);
// 		} else {
// 			setAnchorEl(null);
// 		}
// 	};

// 	const StyledMenu = styled((props: MenuProps) => (
// 		<Menu
// 			elevation={0}
// 			anchorOrigin={{
// 				vertical: 'bottom',
// 				horizontal: 'right',
// 			}}
// 			transformOrigin={{
// 				vertical: 'top',
// 				horizontal: 'right',
// 			}}
// 			{...props}
// 		/>
// 	))(({ theme }) => ({
// 		'& .MuiPaper-root': {
// 			top: '109px',
// 			borderRadius: 6,
// 			marginTop: theme.spacing(1),
// 			minWidth: 160,
// 			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
// 			boxShadow:
// 				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
// 			'& .MuiMenu-list': {
// 				padding: '4px 0',
// 			},
// 			'& .MuiMenuItem-root': {
// 				'& .MuiSvgIcon-root': {
// 					fontSize: 18,
// 					color: theme.palette.text.secondary,
// 					marginRight: theme.spacing(1.5),
// 				},
// 				'&:active': {
// 					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
// 				},
// 			},
// 		},
// 	}));

// 	if (typeof window !== 'undefined') {
// 		window.addEventListener('scroll', changeNavbarColor);
// 	}

// 	if (device == 'mobile') {
// 		return (
// 			<Stack className={'top'}>
// 				<Link href={'/'}>
// 					<div>{t('Home')}</div>
// 				</Link>
// 				<Link href={'/property'}>
// 					<div>{t('Products')}</div>
// 				</Link>
// 				<Link href={'/agent'}>
// 					<div> {t('Agents')} </div>
// 				</Link>
// 				<Link href={'/community?articleCategory=FREE'}>
// 					<div> {t('Community')} </div>
// 				</Link>
// 				<Link href={'/cs'}>
// 					<div> {t('CS')} </div>
// 				</Link>
// 			</Stack>
// 		);
// 	} else {
// 		return (
// 			<Stack className={'navbar'}>
// 				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
// 				<Stack     style={{
// 								backgroundColor: '#7f8c8d',
// 								width: '100%',
// 								height: '30px',
// 								display: 'flex',
// 								alignItems: 'center',
// 								justifyContent: 'center',
// 							}}
// 						>
// 							<p style={{ margin: 0, color: '#fff' }}>10% off ORDERS over $30</p>
// 						</Stack>
// 					<Stack className={'container'}>

// 						<Box component={'div'} className={'logo-box'}>
// 							<Link href={'/'} >
// 								<img src="/img/logo/logo.JPG" alt="" style={{width:"100px"}}  />
// 							</Link>
// 						</Box>
// 						<Box component={'div'} className={'router-box'}>
// 							<Link href={'/'}>
// 								<div>{t('Home')}</div>
// 							</Link>
// 							<Link href={'/property'}>
// 								<div>{t('Products')}</div>
// 							</Link>
// 							<Link href={'/agent'}>
// 								<div> {t('Agents')} </div>
// 							</Link>
// 							<Link href={'/community?articleCategory=FREE'}>
// 								<div> {t('Community')} </div>
// 							</Link>
// 							{user?._id && (
// 								<Link href={'/mypage'}>
// 									<div> {t('My Page')} </div>
// 								</Link>
// 							)}
// 							<Link href={'/cs'}>
// 								<div> {t('CS')} </div>
// 							</Link>
// 						</Box>
// 						<Box component={'div'} className={'user-box'}>
// 							{user?._id ? (
// 								<>
// 									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
// 										<img
// 											src={
// 												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
// 											}
// 											alt=""
// 										/>
// 									</div>

// 									<Menu
// 										id="basic-menu"
// 										anchorEl={logoutAnchor}
// 										open={logoutOpen}
// 										onClose={() => {
// 											setLogoutAnchor(null);
// 										}}
// 										sx={{ mt: '5px' }}
// 									>
// 										<MenuItem onClick={() => logOut()}>
// 											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
// 											Logout
// 										</MenuItem>
// 									</Menu>
// 								</>
// 							) : (
// 								<Link href={'/account/join'}>
// 									<div className={'join-box'} >
// 										<AccountCircleOutlinedIcon />
// 										<span style={{color:"black"}}>
// 											{t('Login')} / {t('Signup')}
// 										</span>
// 									</div>
// 								</Link>
// 							)}

// 							<div className={'lan-box'}>
// 								{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
// 								<Button
// 									disableRipple
// 									className="btn-lang"
// 									onClick={langClick}
// 									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
// 								>
// 									<Box component={'div'} className={'flag'}>
// 										{lang !== null ? (
// 											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
// 										) : (
// 											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
// 										)}
// 									</Box>
// 								</Button>

// 								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
// 									<MenuItem disableRipple onClick={langChoice} id="en">
// 										<img
// 											className="img-flag"
// 											src={'/img/flag/langen.png'}
// 											onClick={langChoice}
// 											id="en"
// 											alt={'usaFlag'}
// 										/>
// 										{t('English')}
// 									</MenuItem>
// 									<MenuItem disableRipple onClick={langChoice} id="kr">
// 										<img
// 											className="img-flag"
// 											src={'/img/flag/langkr.png'}
// 											onClick={langChoice}
// 											id="uz"
// 											alt={'koreanFlag'}
// 										/>
// 										{t('Korean')}
// 									</MenuItem>
// 									<MenuItem disableRipple onClick={langChoice} id="ru">
// 										<img
// 											className="img-flag"
// 											src={'/img/flag/langru.png'}
// 											onClick={langChoice}
// 											id="ru"
// 											alt={'russiaFlag'}
// 										/>
// 										{t('Russian')}
// 									</MenuItem>
// 								</StyledMenu>
// 							</div>
// 						</Box>
// 					</Stack>
// 				</Stack>
// 			</Stack>
// 		);
// 	}
// };

// export default withRouter(Top);
