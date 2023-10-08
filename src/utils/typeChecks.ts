// 检测数据类型
const { toString } = Object.prototype;

/**
 * @param val
 * @param type
 */
export function is(val: unknown, type: string) {
	return toString.call(val) === `[object ${type}]`;
}

/**
 *
 * @param val
 */
export function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined';
}

/**
 *
 * @param val
 */
export function isUnDef<T = unknown>(val?: T): val is T {
	return !isDef(val);
}

/**
 *
 * @param val
 */
export function isObject(val: any): val is Record<any, any> {
	return val !== null && is(val, 'Object');
}

/**
 *
 * @param val
 */
export function isEmpty<T = unknown>(val: T): val is T {
	if (isArray(val) || isString(val)) {
		return val.length === 0;
	}

	if (val instanceof Map || val instanceof Set) {
		return val.size === 0;
	}

	if (isObject(val)) {
		return Object.keys(val).length === 0;
	}

	return false;
}

/**
 *
 * @param val
 */
export function isFunction(val: unknown): boolean {
	return typeof val === 'function';
}

/**
 *
 * @param val
 */
export function isString(val: unknown): val is string {
	return is(val, 'String');
}

/**
 *
 * @param val
 */
export function isArray(val: any): val is any[] {
	return val && Array.isArray(val);
}

/**
 *
 * @param val
 */
export function isDate(val: unknown): val is Date {
	return is(val, 'Date');
}

/**
 *
 * @param source
 * @param target
 */
export function deepMerge<T = any>(source: any = {}, target: any = {}): T {
	let key: string;

	// eslint-disable-next-line no-restricted-syntax
	for (key in target) {
		if (Object.prototype.hasOwnProperty.call(target, key)) {
			source[key] = isObject(source[key]) ? deepMerge(source[key], target[key]) : (source[key] = target[key]);
		}
	}
	return source;
}
