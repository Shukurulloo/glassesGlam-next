import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import TrendPropertyCard from './TrendPropertyCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const  TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);  // hooktan foydalanamz

	const { // useQuery fazalarni olib beradi 
		loading: getPropertiesLoading, // loading bo'lish jarayoni
		data: getPropertiesData,  // data asosiy // bu kesh shuyerga saqlaymz
		error: getPropertiesError, // data kirib kelgunga qadar error hosil bo'lsa
		refetch: getPropertiesRefetch, // backentdan qayta malumot olish uchun  refetch mantigi, eng oxirgi
	} = useQuery(GET_PROPERTIES, {  // 1-arg comanda(query) 2- option(variant)
		fetchPolicy: 'cache-and-network', // eng muhumi...  cache + => network
		variables: { input: initialInput }, // chaqirishmz kerak bo'lgan mantiqlar initialInputdan olamz
		notifyOnNetworkStatusChange: true, // bydefolt false // qayta data o'zgarganda serverdan kelgan datani yangilash un
		onCompleted: (data: T) => { // backentdan datani qabul qilganda amalga oshadigon mantiq
			setTrendProperties(data?.getProperties?.list); // spesifik datani chaqirish yani faqat listni keshtan ajratib oldik
		},
	});

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => { // auth bo'lgan user va like bosiladigon property id
		try {
			if (!id) return; // tanlangan id mavjudligini tekshramz
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED); // auth

			// executed likeTargetProperty Mutation
			await likeTargetProperty({ 
				variables: { input: id }, // aynan qaysi propertyga like bosilganini id si
			});

			// executed getPropertiesRefetch: backentdan oxirgi datani olamz, likelar sonini o'zgartramz
			await getPropertiesRefetch({ input: initialInput }); // inputni initialInput qiymatida olamz

			await sweetTopSmallSuccessAlert('success', 800);  //elart chiqish vaqti
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendProperties) console.log('trendProperties:', trendProperties);
	if (!trendProperties) return null; // tekshiramz agar mantiq bo'lmasa null qaytaradi

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Properties</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendProperties.map((property: Property) => {
									return (
										<SwiperSlide key={property._id} className={'trend-property-slide'}>
											<TrendPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trend Properties</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendProperties.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-property-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendProperties.map((property: Property) => {
									return (
										<SwiperSlide key={property._id} className={'trend-property-slide'}>
											<TrendPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProperties.defaultProps = { // defaultProps yuqorida ishlatish uchun
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
