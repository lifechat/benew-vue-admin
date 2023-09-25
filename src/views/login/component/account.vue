<template>
	<el-form size="large" :model="state.ruleForm" :rules="rules" status-icon ref="ruleFormRef" class="login-content-form">
		<el-form-item class="login-animation1" prop="userName">
			<el-input text :placeholder="$t('message.account.accountPlaceholder1')" v-model.trim="state.ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.account.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" round v-waves @click="onSignIn(ruleFormRef)" :loading="state.loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginAccount">
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { NextLoading } from '/@/utils/loading';
import { useUserInfo } from '/@/stores/userInfo';

// 定义变量内容
const { t } = useI18n();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const router = useRouter();
const state = reactive({
	isShowPassword: false,
	ruleForm: {
		userName: '',
		password: '',
	},
	loading: {
		signIn: false,
	},
});
const storesUser = useUserInfo();
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	userName: [
		{
			required: true,
			message: '请输入您的用户名',
			min: 4,
			max: 18,
			trigger: 'blur',
		},
	],
	password: [
		{
			required: true,
			message: '密码为6~18位字母、数字和符号',
			min: 6,
			max: 18,
			trigger: 'blur',
		},
	],
});
// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date());
});
// 登录
const onSignIn = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			state.loading.signIn = true;
			const params = {
				username: state.ruleForm.userName,
				password: state.ruleForm.password,
			};
			storesUser
				.login(params)
				.then(async () => {
					Cookies.set('userName', state.ruleForm.userName);
					if (!themeConfig.value.isRequestRoutes) {
						// 前端控制路由，2、请注意执行顺序
						const isNoPower = await initFrontEndControlRoutes();
						signInSuccess(isNoPower);
						// console.log('前端校验路由');
					} else {
						// console.log('后端校验路由');

						// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
						// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
						const isNoPower = await initBackEndControlRoutes();
						// console.log(isNoPower);
						// 执行完 initBackEndControlRoutes，再执行 signInSuccess
						signInSuccess(isNoPower);
					}
				})
				.catch((error: any) => {
					const { data } = error.response;
					const { message } = data;
					ElMessage({
						message: message,
						type: 'error',
					});
					state.loading.signIn = false;
				});
		}
	});
};
// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
	if (isNoPower) {
		ElMessage.warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = currentTime.value;
		// 登录成功，跳到转首页
		// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('message.signInText');
		ElMessage.success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
	state.loading.signIn = false;
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
