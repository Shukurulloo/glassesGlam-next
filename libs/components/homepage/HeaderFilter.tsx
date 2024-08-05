import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { PropertyColor, PropertyGlass, PropertySize, PropertyType } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface HeaderFilterProps {
	initialInput: PropertiesInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const typeRef: any = useRef();
	const glassRef: any = useRef();
	const sizeRef: any = useRef();
	const colorRef: any = useRef();
	const router = useRouter();
	const [openType, setOpenType] = useState(false);
	const [openGlass, setOpenGlass] = useState(false);
	const [openSize, setOpenSize] = useState(false);
	const [openColor, setOpenColor] = useState(false);
	const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [propertyGlass, setPropertyGlass] = useState<PropertyGlass[]>(Object.values(PropertyGlass));
	const [propertySize, setPropertySize] = useState<PropertySize[]>(Object.values(PropertySize));
	const [propertyColor, setPropertyColor] = useState<PropertyColor[]>(Object.values(PropertyColor));
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!glassRef?.current?.contains(event.target)) {
				setOpenGlass(false);
			}

			if (!sizeRef?.current?.contains(event.target)) {
				setOpenSize(false);
			}

			if (!colorRef?.current?.contains(event.target)) {
				setOpenColor(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenGlass(false);
		setOpenSize(false);
		setOpenColor(false);
	};

	const glassStateChangeHandler = () => {
		setOpenGlass((prev) => !prev);
		setOpenType(false);
		setOpenSize(false);
		setOpenColor(false);
	};

	const sizeStateChangeHandler = () => {
		setOpenSize((prev) => !prev);
		setOpenGlass(false);
		setOpenType(false);
		setOpenColor(false);
	};

	const colorStateChangeHandler = () => {
		setOpenColor((prev) => !prev);
		setOpenSize(false);
		setOpenGlass(false);
		setOpenType(false);
	};

	const disableAllStateHandler = () => {
		setOpenColor(false);
		setOpenSize(false);
		setOpenGlass(false);
		setOpenType(false);
	};

	const propertyTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				glassStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyGlassSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						glassList: [value],
					},
				});
				sizeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertySizeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						sizeList: [value],
					},
				});
				colorStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, propertySizeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyColorSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						colorList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, propertySizeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.glassList?.length == 0) {
				delete searchFilter.search.glassList;
			}

			if (searchFilter?.search?.sizeList?.length == 0) {
				delete searchFilter.search.sizeList;
			}

			if (searchFilter?.search?.colorList?.length == 0) {
				delete searchFilter.search.colorList;
			}

			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						{/* <div className={'bottom'}>
							<Box className={'search-btn'} onClick={pushSearchHandler}>
								<img src="/img/icons/search.svg" alt="" />
							</Box>
						</div> */}

						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Gender')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box component={'div'} className={`box ${openGlass ? 'on' : ''}`} onClick={glassStateChangeHandler}>
							<span>{searchFilter?.search?.glassList ? searchFilter?.search?.glassList[0] : t('Specs')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openSize ? 'on' : ''}`} onClick={sizeStateChangeHandler}>
							<span>{searchFilter?.search?.sizeList ? `${searchFilter?.search?.sizeList[0]} ` : t('Size')}</span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openColor ? 'on' : ''}`} onClick={colorStateChangeHandler}>
							<span>{searchFilter?.search?.colorList ? `${searchFilter?.search?.colorList[0]} ` : t('Color')}</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					{/* <Stack className={'search-box-other'}>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack> */}
					{/*MENU */}
					<div className={`filter-location ${openType ? 'on' : ''}`} ref={typeRef}>
						{propertyType.map((type: string) => {
							return (
								<div onClick={() => propertyTypeSelectHandler(type)} key={type}>
									<img src={`img/banner/cities/${type}.JPG`} alt="" />
									<span>{type}</span>
								</div>
							);
						})}
					</div>
					<div className={`filter-location ${openGlass ? 'on' : ''}`} ref={glassRef}>
						{propertyGlass.map((glass: string) => {
							return (
								<div
									// style={{ backgroundImage: `url(s/img/banner/type/${glass.toLowerCase()}.JPG)` }}
									onClick={() => propertyGlassSelectHandler(glass)}
									key={glass}
								>
									<img src={`img/banner/types/${glass}.JPG`} alt="" />
									<span>{glass}</span>
								</div>
							);
						})}
					</div>
					<div className={`filter-location ${openSize ? 'on' : ''}`} ref={sizeRef}>
						{propertySize.map((size: string) => {
							return (
								<div
									// style={{ backgroundImage: `url(/img/banner/types/${size.toLowerCase()}.webp)` }}
									onClick={() => propertySizeSelectHandler(size)}
									key={size}
								>
									<span>{size}</span>
								</div>
							);
						})}
					</div>
					<div className={`filter-location ${openColor ? 'on' : ''}`} ref={colorRef}>
						{propertyColor.map((color: string) => {
							return (
								<div
									// style={{ backgroundImage: `url(/img/banner/types/${color.toLowerCase()}.webp)` }}
									onClick={() => propertyColorSelectHandler(color)}
									key={color}
								>
									<img src={`img/banner/colors/${color}.JPG`} alt="" />
									<span>{color}</span>
								</div>
							);
						})}
					</div>
					<div className={'top'}>
						{/* <span>Find your home</span> */}
						<div className={'search-input-box'}>
							{/* <img src="/img/icons/search.svg" alt="" /> */}
							<input
								value={searchFilter?.search?.text ?? ''}
								type="text"
								placeholder={'Search glasses'}
								onChange={(e: any) => {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: e.target.value },
									});
								}}
							/>
						</div>
						
					</div>
					<Stack className={'search-box-other'}>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>
					
				</Stack>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderFilter;
