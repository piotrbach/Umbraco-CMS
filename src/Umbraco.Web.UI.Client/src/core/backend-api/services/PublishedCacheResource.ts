/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PublishedCacheResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postUmbracoManagementApiV1PublishedCacheCollect(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/published-cache/collect',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postUmbracoManagementApiV1PublishedCacheRebuild(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/published-cache/rebuild',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postUmbracoManagementApiV1PublishedCacheReload(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/management/api/v1/published-cache/reload',
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static getUmbracoManagementApiV1PublishedCacheStatus(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/management/api/v1/published-cache/status',
        });
    }

}
