import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';

const Advertisement = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'video-frame'}>
				<video
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				>
					<source src="/video/ads.mp4" type="video/mp4" />
				</video>
			</Stack>
		);
	} else {
		return (
			<Stack className="video-frame">
				<Stack className="video-text-wrap" >
				<Stack className="video-wrap">
					<video autoPlay muted loop playsInline preload="auto" className="video-ads">
						<source src="/video/ads.mp4" type="video/mp4" />
					</video>
				</Stack>
				<Stack className="text-wrap">
					{/* <h2>We offer our high quality glasses for you</h2> */}
					<h2>Best Fit Machine</h2>
					<p>
						At GlassesGlam, we've made finding your next pair of glasses so much easier. Simply use the measurements of
						your current glasses to find new ones of a similar fit.
					</p>
					{/* <p>
						Explore our wide range of glasses and find the perfect pair that suits your style and needs. From sun
						glasses to optical glasses, we have everything you need to see and look your best.
					</p> */}
				</Stack>
				</Stack>

				<Stack className="video-text-wrap" >
				<Stack className="text-wrap">
					{/* <h2>We offer our high quality glasses for you</h2> */}
					<h2>We offer premium glasses just for you</h2>
					<p>
					Explore our wide range of glasses and find the perfect pair that suits your style and needs. From sun
					glasses to optical glasses, we have everything you need to see and look your best.
					</p>
					{/* <p>
						Explore our wide range of glasses and find the perfect pair that suits your style and needs. From sun
						glasses to optical glasses, we have everything you need to see and look your best.
					</p> */}
				</Stack>
				<Stack className="video-wrap">
					<video autoPlay muted loop playsInline preload="auto" className="video-ads">
						<source src="/video/ads2.mp4" type="video/mp4" />
					</video>
				</Stack>
				</Stack>
		
			</Stack>
		);
	}
};

export default Advertisement;
