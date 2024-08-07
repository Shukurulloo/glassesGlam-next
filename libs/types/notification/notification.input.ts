import { Direction } from '../../enums/common.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotificationInput {
	notificationType: NotificationType;

	notificationStatus: NotificationStatus;

	notificationGroup: NotificationGroup;

	notificationTitle: string;

	notificationDesc: string;

	authorId: string;

	receiverId: string;

	propertyId?: string;

	articleId?: string;
}

interface NISearch {
	receiverId: string;
}

export interface NotificationsInquiry {
	page: number;
	limit: number;
	direction?: Direction;
	search: NISearch;
}