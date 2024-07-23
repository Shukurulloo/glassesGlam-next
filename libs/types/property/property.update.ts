import { PropertyColor, PropertyGlass, PropertySize, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyGlass?: PropertyGlass;
	propertySize?: PropertySize;
	propertyColor?: PropertyColor;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	soldAt?: Date;
	deletedAt?: Date;
}
