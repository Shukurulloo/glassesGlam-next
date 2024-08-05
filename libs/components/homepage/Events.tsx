import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	date: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'Summer Spectacular Sale 🕶️',
		date: 'August 15 - August 30',
		description:
			'Get ready for our Summer Spectacular Sale! Enjoy up to 50% off on selected eyeglasses and sunglasses. Plus, get a free lens upgrade on all orders over $100. Don’t miss out on this chance to refresh your eyewear collection!',
		imageSrc: '/img/events/Summer.jpeg',
	},
	{
		eventTitle: 'Virtual Try-On Week 📱',
		date: 'September 5 - September 12',
		description:
			'Experience our Virtual Try-On feature like never before. Test out new styles from the comfort of your home and enjoy a 10% discount on your first order. Join us online and find your perfect pair of glasses!',
		imageSrc: '/img/events/virtual.jpg',
	},
	{
		eventTitle: 'Back-to-School Special🎓',
		date: 'September 15 - September 30',
		description:
			'Students and parents, get ready for the school year with our Back-to-School Special! Receive a 20% discount on all children’s and student eyewear. Plus, free shipping on all orders placed during the event.',
		imageSrc: '/img/events/school.JPG',
	},
	{
		eventTitle: 'Annual Clearance Sale 🏷️',
		date: 'December 1 - December 20',
		description:
			'Our biggest sale of the year is here! Save up to 70% on last season’s styles and clearance items. Stock up on your favorite glasses and sunglasses before the year ends!',
		imageSrc: '/img/events/sale.jpg',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.date}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>Events waiting your attention!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
					<span>Follow Us on social media and subscribe to our newsletter for the latest updates and exclusive invites to upcoming events.</span>

				</Stack>
			</Stack>
		);
	}
};

export default Events;
