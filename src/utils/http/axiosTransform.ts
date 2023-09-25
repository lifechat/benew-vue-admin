import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, Result } from './types';

export interface CreateAxiosOptions extends AxiosRequestConfig {
	authenticationScheme?: string;
	transform?: AxiosTransform;
	requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
	/**
	 * @description: 请求之前进行一些参数处理
	 */
	beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
	/**
	 * @description: 请求成功的处理
	 */
	transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;
	/**
	 * @description: 请求失败处理
	 */
	requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;
	/**
	 * @description: 请求之前的拦截器
	 */
	requestInterceptors?: (config: AxiosRequestConfig, options: CreateAxiosOptions) => AxiosRequestConfig;

	/**
	 * @description: 请求之后的拦截器
	 */
	responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

	/**
	 * @description: 请求之前的拦截器错误处理
	 */
	requestInterceptorsCatch?: (error: Error) => void;
	/**
	 * @description: 请求之后的拦截器错误处理
	 */
	responseInterceptorsCatch?: (error: Error) => void;
}
