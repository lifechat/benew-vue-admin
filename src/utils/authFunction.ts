import { useUserInfo } from '/@/stores/userInfo';
import { judementSameArr } from '/@/utils/arrayOperation';
import Cookies from 'js-cookie';

const TokenKey: string = 'Authorization';
// token前缀
export const token_prefix = 'Bearer ';

/**
 *  获取token
 */
export function getToken() {
	return Cookies.get(TokenKey);
}
/**
 * 设置token
 * @param token
 */
export function setToken(token: string) {
	return Cookies.set(TokenKey, token);
}
/**
 * 移除token
 */
export function removeToken() {
	return Cookies.remove(TokenKey);
}

/**
 * 单个权限验证
 * @param value 权限值
 * @returns 有权限，返回 `true`，反之则反
 */
export function auth(value: string): boolean {
	const stores = useUserInfo();
	return stores.userInfos.authBtnList.some((v: string) => v === value);
}

/**
 * 多个权限验证，满足一个则为 true
 * @param value 权限值
 * @returns 有权限，返回 `true`，反之则反
 */
export function auths(value: Array<string>): boolean {
	let flag = false;
	const stores = useUserInfo();
	stores.userInfos.authBtnList.map((val: string) => {
		value.map((v: string) => {
			if (val === v) flag = true;
		});
	});
	return flag;
}

/**
 * 多个权限验证，全部满足则为 true
 * @param value 权限值
 * @returns 有权限，返回 `true`，反之则反
 */
export function authAll(value: Array<string>): boolean {
	const stores = useUserInfo();
	return judementSameArr(value, stores.userInfos.authBtnList);
}
