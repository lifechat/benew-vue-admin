import { request } from '/@/utils/http';

/**
 * 以下为模拟接口地址，gitee 的不通，就换自己的真实接口地址
 *
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 后端控制菜单模拟json，路径在 https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getAdminMenu 获取后端动态路由菜单(admin)
 * @method getTestMenu 获取后端动态路由菜单(test)
 */

/**
 * 获取登录用户菜单
 * @returns 登录用户菜单
 */
export const handleGetUserMenu = () => {
	return request.get({
		url: '/admin/user/getUserMenu',
	});
};
/**
 * 获取菜单树
 * @returns 菜单树
 */
export const getMenuTree = () => {
	return request.get({
		url: '/admin/menu/getMenuTree',
	});
};
/**
 * 查看菜单列表
 * @param params 查询条件
 * @returns 菜单列表
 */
export const getMenuList = (params?: any) => {
	return request.get({
		url: '/admin/menu/list',
		params,
	});
};
/**
 * 添加菜单
 * @param data 菜单
 */
export const addMenu = (data: any) => {
	return request.post({
		url: '/admin/menu/add',
		data,
	});
};
/**
 * 编辑菜单
 * @param menuId 菜单id
 * @returns 菜单
 */
export const editMenu = (menuId: number) => {
	return request.get({
		url: `/admin/menu/edit/${menuId}`,
	});
};
/**
 * 删除菜单
 * @param menuId 菜单id
 */
export const deleteMenu = (menuId: number) => {
	return request.delete({
		url: `/admin/menu/delete/${menuId}`,
	});
};
