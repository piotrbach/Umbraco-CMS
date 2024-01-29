import type { PublicAccessResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbPublicAccessModalData {
	publicAccessModel: PublicAccessResponseModel;
}

export interface UmbPublicAccessModalValue {
	action: 'create' | 'update' | 'delete';
	publicAccessModel: PublicAccessResponseModel;
}

export const UMB_PUBLIC_ACCESS_MODAL = new UmbModalToken<UmbPublicAccessModalData, UmbPublicAccessModalValue>(
	'Umb.Modal.PublicAccess',
	{
		modal: {
			type: 'sidebar',
			size: 'medium',
		},
	},
);
