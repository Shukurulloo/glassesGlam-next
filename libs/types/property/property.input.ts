import {  PropertyColor, PropertyGlass, PropertySize, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';

export interface PropertyInput {
	propertyType: PropertyType;
	propertyGlass: PropertyGlass;
	propertySize:PropertySize;
    propertyColor:PropertyColor
	propertyAddress: string;
	propertyTitle: string;
	propertyPrice: number;
	propertyImages: string[];
	propertyDesc?: string;
	memberId?: string;

}

interface PISearch {
	memberId?: string;
	typeList?: PropertyType[];
	glassList?: PropertyGlass[];
	sizeList?: PropertySize[];
	colorList?: PropertyColor[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface PropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	propertyStatus?: PropertyStatus;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	// propertyGlassList: any;
	propertyStatus?: PropertyStatus;
	typeList?: PropertyType[];
	glassList?: PropertyGlass[];
	sizeList?: PropertySize[];
	colorList?: PropertyColor[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}




// import { registerEnumType } from '@nestjs/graphql';

// export enum PropertyType {
// 	MEN = 'MEN',
// 	WOMEN = 'WOMEN',
// 	UNISEX = 'UNISEX',
// 	KIDS = 'KIDS',
// }
// registerEnumType(PropertyType, {
// 	name: 'PropertyType',
// });

// export enum PropertyStatus {
// 	ACTIVE = 'ACTIVE',
// 	SOLD = 'SOLD',
// 	DELETE = 'DELETE',
// }
// registerEnumType(PropertyStatus, {
// 	name: 'PropertyStatus',
// });

// export enum PropertyGlass {
// 	SUN_GLASSES = 'SUNGLASSES',
// 	READING_GLASSES = 'READING_GLASSES',
// 	POLARIZED_GLASSES = 'POLARIZED_GLASSES',
// 	SPORTS_GLASSES = 'SPORTS_GLASSES',
// 	FASHION_GLASSES = 'FASHION_GLASSES',
// }
// registerEnumType(PropertyGlass, {
// 	name: 'PropertyGlass',
// });

// export enum PropertySize {
// 	SMALL = 'SMALL',
// 	MEDIUM = 'MEDIUM',
// 	LARGE = 'LARGE',
// 	EXTRA_LARGE = 'EXTRA_LARGE',
// }
// registerEnumType(PropertySize, {
// 	name: 'PropertySize',
// });

// export enum PropertyColor {
// 	BLACK = 'BLACK',
// 	WHITE = 'WHITE',
// 	BROWN = 'BROWN', //JIGARRANG
// 	BLUE = 'BLUE',
// 	RED = 'RED',
// 	GREEN = 'GREEN',
// 	YELLOW = 'YELLOW',
// 	GRAY = 'GRAY',
// 	SILVER = 'SILVER',
// 	GOLD = 'GOLD',
// }
// registerEnumType(PropertyColor, {
// 	name: 'PropertyColor',
// });

