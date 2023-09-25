import { request } from '/@/utils/http';

interface Ilogin {
	username: string;
	password: string;
}
/**
 * 用户登录
 * @param data 登录信息
 * @returns Token
 */
export const handleRquestLogin = (data: Ilogin) => {
	return request.post({
		url: '/login',
		data,
	});
};
/**
 * 获取登录用户信息
 * @returns 登录用户信息
 */
export const handleGetUserInfo = () => {
	return request.get({
		url: '/admin/user/getUserInfo',
	});
};
// 用户退出
export const handlelogOut = () => {
	return request.get({
		url: '/logout',
	});
};

// 获取用户路由权限
export const handleGetRoutes = () => {
	return request.get({
		url: '/admin/user/getUserMenu',
	});
};
