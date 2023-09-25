/**
 * @description 错误显示类型
 */
export enum ErrorShowType {
	SILENT = 0,
	WARN_MESSAGE = 1,
	ERROR_MESSAGE = 2,
	NOTIFICATION = 4,
	REDIRECT = 9,
}

/**
 *  请求可选参数
 */
export interface RequestOptions {
	isTransformRequestResult?: boolean;
	// 是否返回原生响应头 比如：需要获取响应头时使用该属性
	isReturnNativeResponse?: boolean;
	// Error message prompt type
	errorShowType?: ErrorShowType;
	// Whether to add a timestamp
	ignoreCancelToken?: boolean;

	showLoading?: boolean | string;

	withToken?: boolean;

	ignoreFamily?: boolean;
}

/**
 * 返回结果
 */
export interface Result<T = any> {
	code: number;
	msg?: string;
	data: T;
}
/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
	// json
	JSON = 'application/json;charset=UTF-8',
	// form-data qs
	FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
	// form-data  upload
	FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
/**
 *  文件下载,上传参数
 */
export interface UploadFileParams {
	data?: Record<string, any>;
	name?: string;
	file: File | Blob;
	filename?: string;
	[key: string]: any;
}

/**
 *  请求方式
 */
export enum RequestEnum {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
}
/**
 * @description: 请求结果设置
 */
export enum ResultEnum {
	SUCCESS = 200,
	ERROR = 1,
	UNAUTHORIZED = 401,
	NOTFOUND = 404,
}
