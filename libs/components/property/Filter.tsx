import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { propertySquare } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PropertyColor, PropertyGlass, PropertySize, PropertyType } from '../../enums/property.enum';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PropertiesInquiry;// propertylar
	setSearchFilter: any;
	initialInput: PropertiesInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [propertyType, setPropertyType] = useState<PropertyType[]>(Object.values(PropertyType));
	const [propertyGlass, setPropertyGlass] = useState<PropertyGlass[]>(Object.values(PropertyGlass));
	const [propertySize, setPropertySize] = useState<PropertySize[]>(Object.values(PropertySize));
	const [propertyColor, setPropertyColor] = useState<PropertyColor[]>(Object.values(PropertyColor));

	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.typeList?.length == 0) { // agar locationList tanlansa va 0 ga teng bo'lsa push ishga tushadi
			delete searchFilter.search.typeList;
			setShowMore(false);
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.glassList?.length == 0) {
			delete searchFilter.search.glassList; 
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.sizeList?.length == 0) {
			delete searchFilter.search.sizeList;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.colorList?.length == 0) {
			delete searchFilter.search.colorList;
			router.push(`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, `/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			})}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.typeList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/     // bu bror locatsiani tanlasak ishga tushadi
	const propertyTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) { // agar tanlansa shu ishga tushadi
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('propertyTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);
	
	const propertyGlassSelectHandler = useCallback( //  useCallback oshiqcha rerender mantig'idan halos etadi
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(  // o'zgarayotgan query paramsni qiymatlarni hosil qildik
						`/property?input=${JSON.stringify({ // /jsonga o'tkaz
							...searchFilter,
							search: { ...searchFilter.search, glassList: [...(searchFilter?.search?.glassList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, glassList: [...(searchFilter?.search?.glassList || []), value] }, // locationListni mantig'ini o'zgartidik
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.glassList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								glassList: searchFilter?.search?.glassList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								glassList: searchFilter?.search?.glassList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.glassList?.length == 0) {
					alert('error');
				}

				console.log('propertyGlassSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyGlassSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertySizeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) { // agar tanlansa shu ishga tushadi
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, sizeList: [...(searchFilter?.search?.sizeList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, sizeList: [...(searchFilter?.search?.sizeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.sizeList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								sizeList: searchFilter?.search?.sizeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								sizeList: searchFilter?.search?.sizeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.sizeList?.length == 0) {
					alert('error');
				}

				console.log('propertySizeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertySizeSelectHandler:', err);
			}
		},
		[searchFilter],
	);
	const propertyColorSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) { // agar tanlansa shu ishga tushadi
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, colorList: [...(searchFilter?.search?.colorList || []), value] },
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, colorList: [...(searchFilter?.search?.colorList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.colorList?.includes(value)) {
					await router.push(
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								colorList: searchFilter?.search?.colorList?.filter((item: string) => item !== value),
							},
						})}`,
						`/property?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								colorList: searchFilter?.search?.colorList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.colorList?.length == 0) {
					alert('error');
				}

				console.log('propertyColorSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, propertyColorSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const propertyPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/property?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/property?input=${JSON.stringify(initialInput)}`,
				`/property?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PROPERTIES FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Home</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Glass kind
					</p>
					<Stack
						className={`property-location`}
						// style={{ height: showMore ? '253px' : '115px' }}
						// onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.typeList) {
								setShowMore(false);
							}
						}}
					>
						{propertyType.map((type: string) => { // locatsialar
							return (
								<Stack className={'input-box'} key={type}>
									<Checkbox
										id={type}
										className="property-checkbox"
										color="default"
										size="small"
										value={type}
										checked={(searchFilter?.search?.typeList || []).includes(type as PropertyType)}// 
										onChange={propertyTypeSelectHandler}
									/>
									<label htmlFor={type} style={{ cursor: 'pointer' }}>
										<Typography className="property-type">{type}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>SPECS</Typography>
					{propertyGlass.map((glass: string) => (
						<Stack className={'input-box'} key={glass}>
							<Checkbox
								id={glass}
								className="property-checkbox"
								color="default"
								size="small"
								value={glass}
								onChange={propertyGlassSelectHandler}
								checked={(searchFilter?.search?.glassList || []).includes(glass as PropertyGlass)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{glass}</Typography>
							</label>
						</Stack>
					))}
				</Stack>

				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Glasses Size</Typography>
					{propertySize.map((size: string) => (
						<Stack className={'input-box'} key={size}>
							<Checkbox
								id={size}
								className="property-checkbox"
								color="default"
								size="small"
								value={size}
								onChange={propertySizeSelectHandler}
								checked={(searchFilter?.search?.sizeList || []).includes(size as PropertySize)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{size}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Glasses Color</Typography>
					{propertyColor.map((color: string) => (
						<Stack className={'input-box'} key={color}>
							<Checkbox
								id={color}
								className="property-checkbox"
								color="default"
								size="small"
								value={color}
								onChange={propertyColorSelectHandler}
								checked={(searchFilter?.search?.colorList || []).includes(color as PropertyColor)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="property_type">{color}</Typography>
							</label>
						</Stack>
					))}
				</Stack>


				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									propertyPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
