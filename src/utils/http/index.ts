import type { AxiosResponse } from 'axios';
import { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import type { RequestOptions, Result } from './types';
import { ResultEnum, ContentTypeEnum, ErrorShowType } from './types';
import { checkStatus } from './checkStatus';
// import config from '/@/config';
import { VAxios } from './Axios';
import { deepMerge } from '/@/utils/authFunction';
import { getToken, token_prefix } from '/@/utils/authFunction';
import { ElMessage } from 'element-plus';

const ERROR_MESSAGE = '请求出错，请稍候重试';

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
	/**
	 * @param res
	 * @param options
	 * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
	 */
	transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions): any => {
		const { isTransformRequestResult, isReturnNativeResponse } = options;
		// 是否返回原生响应头 比如：需要获取响应头时使用该属性
		if (isReturnNativeResponse) {
			return res;
		}
		// 不进行任何处理，直接返回
		if (!isTransformRequestResult) {
			return res.data;
		}
		const { data } = res;

		if (!data) {
			throw new Error(ERROR_MESSAGE);
		}

		const { code, msg } = data;

		const errorMessage = msg || ERROR_MESSAGE;

		// 业务层报错
		const hasSuccess = Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
		if (!hasSuccess) {
			switch (options.errorShowType) {
				case ErrorShowType.SILENT:
					// do nothing
					break;
				case ErrorShowType.WARN_MESSAGE:
					ElMessage({
						message: errorMessage,
						type: 'warning',
					});
					break;
				case ErrorShowType.ERROR_MESSAGE:
					ElMessage({
						message: errorMessage,
						type: 'error',
					});
					break;
				case ErrorShowType.NOTIFICATION:
					ElMessage({
						message: errorMessage,
						type: 'error',
					});

					break;
				default:
					ElMessage({
						message: errorMessage,
						type: 'error',
					});
					break;
			}
			// TODO: 等待umi v3 支持ERRROR_OVERLAY关闭开发环境下error遮罩
			throw new Error(msg);
		}

		return data;
	},

	// 请求之前处理config
	beforeRequestHook: (config) => {
		return config;
	},

	/**
	 * @param config
	 * @description: 请求拦截器处理
	 */
	requestInterceptors: (config: any) => {
		// 是否需要设置token
		const isToken = (config.headers || {}).isToken === false;
		if (getToken() && !isToken) {
			config.headers['Authorization'] = token_prefix + getToken();
		}
		return config;
	},

	/**
	 * @param error
	 * @description: 响应拦截器错误处理
	 */
	responseInterceptorsCatch: (error: any) => {
		const { code, message = '', config } = error || {};
		if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
			ElMessage({
				message: '请求超时',
				type: 'error',
			});

			return Promise.reject(error);
		}
		if (message.includes('Network Error')) {
			ElMessage({
				message: '网络异常',
				type: 'error',
			});
			return Promise.reject(error);
		}

		if (config.requestOptions?.errorShowType !== ErrorShowType.SILENT) {
			checkStatus(error?.response);
		}

		return Promise.reject(error);
	},
};

/**
 *
 * @param opt
 */
function createAxios(opt?: Partial<CreateAxiosOptions>) {
	return new VAxios(
		deepMerge(
			{
				timeout: 20 * 1000,
				// 基础接口地址
				baseURL: '/api', //config.apiUrl
				// 接口可能会有通用的地址部分，可以统一抽取出来
				withCredentials: true,
				headers: { 'Content-Type': ContentTypeEnum.JSON },
				// 数据处理方式
				transform,
				// 配置项，下面的选项都可以在独立的接口请求中覆盖
				requestOptions: {
					// 是否返回原生响应头 比如：需要获取响应头时使用该属性
					isReturnNativeResponse: false,
					// 需要对返回数据进行处理
					isTransformRequestResult: true,
					// 消息提示类型
					errorShowType: ErrorShowType.ERROR_MESSAGE,
					// 忽略重复请求
					ignoreCancelToken: true,

					showLoading: false,
					// 是否携带token
					withToken: true,

					ignoreFamily: true,
				},
			},
			opt || {}
		)
	);
}

export const request = createAxios();
// 配置多个域名
// export const otherRequest = createAxios({
//   baseURL: "/api",
//   requestOptions: {
//     isTransformRequestResult: false,
//   },
// })
