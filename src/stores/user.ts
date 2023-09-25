import { handleRquestLogin, handlelogOut, handleGetUserInfo } from '/@/api/login';
import { LoginForm, UserState } from '/@/types/pinia';
import { getToken, removeToken, setToken } from '/@/utils/authFunction';
import { defineStore } from 'pinia';
import defAva from '/@/assets/defaultAvatar.jpg';

export const useUserStore = defineStore('useUserStore', {
	state: (): UserState => ({
		token: getToken(),
		id: null,
		avatar: '',
		roles: [],
		permissions: [],
	}),
	actions: {
		login(loginForm: LoginForm) {
			return new Promise((resolve, reject) => {
				handleRquestLogin(loginForm)
					.then((data) => {
						setToken(data.data);
						this.token = data.data;
						resolve(data);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		LogOut() {
			return new Promise((resolve, reject) => {
				handlelogOut()
					.then(() => {
						this.$reset();
						removeToken();
						resolve(null);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		// 获取用户信息
		getAdminUserInfo() {
			return new Promise((resolve, reject) => {
				handleGetUserInfo()
					.then(({ data }) => {
						const userInfo = data;
						this.id = userInfo.id;
						this.avatar = userInfo.avatar === '' || userInfo.avatar === null ? defAva : userInfo.avatar;
						this.roles = userInfo.roleList;
						this.permissions = userInfo.permissionList;
						resolve(data);
					})
					.catch((error: any) => {
						reject(error);
					});
			});
		},
	},
});
