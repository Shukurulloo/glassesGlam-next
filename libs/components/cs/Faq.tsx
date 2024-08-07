import React, { SyntheticEvent, useEffect, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { GET_FAQS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { NextPage } from 'next';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

interface FaqsListProps {
	initialInput?: {
		page?: number;
		limit?: number;
		faqType?: string;
	};
}

const FaqsList: NextPage<FaqsListProps> = ({ initialInput, ...props }) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [type, setType] = useState<string>('PRODUCTS');
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const [currentPage, setCurrentPage] = useState<number>(1);

	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);

	const [faqs, setFaqs] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getFaqsLoading,
		data: getFaqsData,
		error: getFaqsError,
		refetch: getFaqsRefetch,
	} = useQuery(GET_FAQS, {
		fetchPolicy: 'network-only', // by default cache-first
		variables: { input: { ...initialInput, faqType: type.toUpperCase() } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getFaqs?.list || []);
			setTotal(data?.getFaqs?.metaCounter[0]?.total || 0);
		},
	});

	if (getFaqsError) {
		router.push('_error');
	}

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router, searchFilter]);

	useEffect(() => {
		getFaqsRefetch(initialInput); // Refetch the data when `type` changes
	}, [type]);

	/** HANDLERS **/
	const changeCategoryHandler = (type: string) => {
		// @ts-ignore
		setType(type);
		setSearchFilter({ ...searchFilter, faqType: type.toUpperCase() });
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};
	console.log(initialInput, 'INITIAL INPUT');

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={type === 'PRODUCTS' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('PRODUCTS');
						}}
					>
						Products
					</div>
					<div
						className={type === 'PAYMENT' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('PAYMENT');
						}}
					>
						Payment
					</div>
					<div
						className={type === 'BUYERS' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('BUYERS');
						}}
					>
						Foy Buyers
					</div>
					<div
						className={type === 'DEALERS' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('DEALERS');
						}}
					>
						Dealers
					</div>
					<div
						className={type === 'MEMBERSHIP' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('MEMBERSHIP');
						}}
					>
						Membership
					</div>
					<div
						className={type === 'COMMUNITY' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('COMMUNITY');
						}}
					>
						Community
					</div>
					<div
						className={type === 'OTHER' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('OTHER');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{faqs.map((ele: any) => (
						<Accordion expanded={expanded === ele?._id} onChange={handleChange(ele?._id)} key={ele?._id}>
							<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
								<Typography className="badge" variant={'h4'}>
									Q
								</Typography>
								<Typography> {ele?.faqQuestion}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className={'answer flex-box'}>
									<Typography className="badge" variant={'h4'} color={'primary'}>
										A
									</Typography>
									<Typography> {ele?.faqAnswer}</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			</Stack>
		);
	}
};

FaqsList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		faqType: 'PRODUCTS',
	},
};

export default FaqsList;