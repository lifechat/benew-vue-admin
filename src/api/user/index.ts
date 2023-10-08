import { request } from '/@/utils/http';

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const getUserInfo = () => {
	return request.get({
		url: '/admin/user/getUserInfo',
	});
};
/**
 * 查看用户列表
 * @param params 查询条件
 * @returns 用户列表
 */
export const getUserList = (params: any) => {
	return request.get({
		url: '/admin/user/list',
		params,
	});
};

/**
 * 查看用户角色选项
 * @returns 用户角色选项
 */
export const getUserRoleList = () => {
	return request.get({
		url: '/admin/user/role',
	});
};

/**
 * 修改用户
 * @param data 用户信息
 */
export const updateUser = (data: any) => {
	return request.put({
		url: '/admin/user/update',
		data,
	});
};

/**
 * 修改用户状态
 * @param data 用户状态
 */
export const updateUserStatus = (data: any) => {
	return request.put({
		url: '/admin/user/changeStatus',
		data,
	});
};

/**
 * 查看在线用户列表
 * @param params 查询条件
 * @returns 在线用户列表
 */
export const getOnlineList = (params: any) => {
	return request.get({
		url: '/admin/online/list',
		params,
	});
};

/**
 * 下线用户
 * @param token 在线token
 */
export function kickOutUser(token: string) {
	return request.get({
		url: `/admin/online/kick/${token}`,
	});
}

/**
 * 修改管理员密码
 * @param data 密码
 */
export function updateAdminPassword(data: any) {
	return request.put({
		url: '/admin/password',
		data,
	});
}
