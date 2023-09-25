import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { RequestOptions, Result, UploadFileParams } from './types';
import type { CreateAxiosOptions } from './axiosTransform';
import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './AxiosCanceler';
import { isFunction } from '/@/utils/authFunction';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum, RequestEnum } from './types';
export * from './axiosTransform';

/**
 *  请求模块
 */
export class VAxios {
	private axiosInstance: AxiosInstance;
	private readonly options: CreateAxiosOptions;

	constructor(options: CreateAxiosOptions) {
		this.options = options;
		this.axiosInstance = axios.create(options);
		this.setupInterceptors();
	}
	/**
	 * @param config
	 *  @description Create axios instance
	 */
	private createAxios(config: CreateAxiosOptions): void {
		this.axiosInstance = axios.create(config);
	}
	private getTransform() {
		const { transform } = this.options;
		return transform;
	}
	getAxios(): AxiosInstance {
		return this.axiosInstance;
	}
	/**
	 * @param config
	 * @description Reconfig axios
	 */
	configAxios(config: CreateAxiosOptions) {
		if (!this.axiosInstance) {
			return;
		}
		this.createAxios(config);
	}
	/**
	 * @description: 请求拦截配置
	 */
	private setupInterceptors() {
		const transform = this.getTransform();
		if (!transform) {
			return;
		}
		const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform;
		const axiosCanceler = new AxiosCanceler();
		this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig): any => {
			const ignoreCancel = config.headers?.['Content-type'] === ContentTypeEnum.FORM_DATA ? false : this.options.requestOptions?.ignoreCancelToken;

			!ignoreCancel && axiosCanceler.addPending(config);
			if (requestInterceptors && isFunction(requestInterceptors)) {
				config = requestInterceptors(config, this.options);
			}
			return config;
		}, undefined);

		requestInterceptorsCatch &&
			isFunction(requestInterceptorsCatch) &&
			this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

		// Response result interceptor processing
		this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
			res && axiosCanceler.removePending(res.config);
			if (responseInterceptors && isFunction(responseInterceptors)) {
				res = responseInterceptors(res);
			}
			return res;
		}, undefined);

		responseInterceptorsCatch &&
			isFunction(responseInterceptorsCatch) &&
			this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
	}

	/**
	 * @description:  File Upload
	 */
	uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
		const formData = new FormData();
		const { file, ...rest } = params;
		formData.append('file', file);
		Object.keys(rest).forEach((key) => {
			formData.append(key, rest[key]);
		});
		return this.axiosInstance.request<T>({
			...config,
			timeout: 0,
			method: 'POST',
			data: formData,
			withCredentials: false,
			headers: {
				'Content-type': ContentTypeEnum.FORM_DATA,
			},
		});
	}
	supportFormData(config: AxiosRequestConfig) {
		const headers = config.headers || this.options.headers;
		const contentType = headers?.['Content-Type'] || headers?.['content-type'];

		if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === RequestEnum.GET) {
			return config;
		}

		return {
			...config,
			data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
		};
	}
	get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'GET' }, options);
	}
	post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'POST' }, options);
	}
	put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'PUT' }, options);
	}
	delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		return this.request({ ...config, method: 'DELETE' }, options);
	}
	request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
		let conf: AxiosRequestConfig = cloneDeep(config);
		const transform = this.getTransform();

		const { requestOptions } = this.options;

		const opt: RequestOptions = { ...requestOptions, ...options };

		(conf as any).requestOptions = opt;

		const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(conf, opt);
		}

		conf = this.supportFormData(conf);

		// let hideLoading: MessageType
		// if (options?.showLoading) {
		//   hideLoading = ElMessage.loading(isString(options.showLoading) ? options.showLoading : '正在提交', 0)
		// }

		return new Promise((resolve, reject) => {
			this.axiosInstance
				.request<any, AxiosResponse<Result>>(conf)
				.then((res: AxiosResponse<Result>) => {
					//   hideLoading?.()
					if (transformRequestHook && isFunction(transformRequestHook)) {
						try {
							const ret = transformRequestHook(res, opt);
							resolve(ret);
						} catch (err) {
							reject(err || new Error('request error!'));
						}
						return;
					}
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					//   hideLoading?.()
					if (requestCatchHook && isFunction(requestCatchHook)) {
						reject(requestCatchHook(e, opt));
						return;
					}
					if (axios.isAxiosError(e)) {
						// rewrite error message from axios in here
					}
					reject(e);
				});
		});
	}
}
