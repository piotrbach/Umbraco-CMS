import { UmbMockDBBase } from '../mock-db-base.js';
import type { FileSystemResponseModelBaseModel } from '@umbraco-cms/backoffice/backend-api';

export abstract class UmbFileSystemMockDbBase<
	MockItemType extends FileSystemResponseModelBaseModel,
> extends UmbMockDBBase<MockItemType> {
	constructor(data: Array<MockItemType>) {
		super(data);
	}

	create(item: MockItemType) {
		this.data.push(item);
	}

	read(path: string) {
		return this.data.find((item) => item.path === path);
	}

	update(existingPath: string, updatedItem: MockItemType) {
		const itemIndex = this.data.findIndex((item) => item.path === existingPath);
		this.data[itemIndex] = updatedItem;
	}

	delete(path: string) {
		this.data = this.data.filter((item) => item.path !== path);
	}
}
