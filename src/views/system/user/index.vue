<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-form :model="queryParams" :inline="true">
					<el-form-item label="用户昵称:">
						<el-input @keyup.enter="handleQuery" v-model="queryParams.keyword" style="width: 200px" placeholder="请输入用户昵称" clearable />
					</el-form-item>
					<el-form-item label="登录方式:">
						<el-select v-model="queryParams.loginType" placeholder="请选择登录方式" clearable style="width: 200px">
							<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="handleQuery">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增用户
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="userList" v-loading="state.tableData.loading" align="center" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<!-- 用户头像 -->
				<el-table-column prop="avatar" label="头像" align="center" width="100" show-overflow-tooltip>
					<template #default="scope">
						<img :src="scope.row.avatar" width="40" height="40" />
					</template>
				</el-table-column>
				<!-- 昵称 -->
				<el-table-column prop="nickname" label="昵称" align="center" width="140" show-overflow-tooltip></el-table-column>
				<!-- 登录方式 -->
				<el-table-column prop="loginType" label="登录方式" align="center" width="100" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.loginType == 1">邮箱</el-tag>
						<el-tag v-if="scope.row.loginType == 2">QQ</el-tag>
						<el-tag type="danger" v-if="scope.row.loginType == 3">Gitee</el-tag>
						<el-tag type="info" v-if="scope.row.loginType == 4">Github</el-tag>
					</template>
				</el-table-column>
				<!-- 用户角色 -->
				<el-table-column prop="roleList" label="用户角色" align="center" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-for="item in scope.row.roleList" :key="item.id" style="margin-right: 4px; margin-top: 4px">
							{{ item.roleName }}
						</el-tag>
					</template>
				</el-table-column>
				<!-- 状态 -->
				<el-table-column prop="status" label="状态" align="center" width="100" show-overflow-tooltip>
					<template #default="scope">
						<el-switch
							v-model="scope.row.isDisable"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="0"
							:inactive-value="1"
							@change="handleChangeStatus(scope.row)"
						></el-switch>
					</template>
				</el-table-column>
				<!-- 登录ip -->
				<el-table-column prop="ipAddress" label="登录ip" align="center" width="140" show-overflow-tooltip></el-table-column>
				<!-- 登录地址 -->
				<el-table-column prop="ipSource" label="登录地址" align="center" width="140" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" align="center" width="180" show-overflow-tooltip>
					<template #default="scope">
						<div class="create-time">
							<el-icon>
								<clock />
							</el-icon>
							<span style="margin-left: 10px">{{ formatDateTime(scope.row.createTime) }}</span>
						</div>
					</template>
				</el-table-column>
				<!-- 登录时间 -->
				<el-table-column prop="loginTime" label="登录时间" align="center" width="260">
					<template #default="scope">
						<div class="create-time">
							<el-icon>
								<clock />
							</el-icon>
							<span style="margin-left: 10px">{{ formatDateTime(scope.row.loginTime) }}</span>
						</div>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="userName" label="账户名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userNickname" label="用户昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleSign" label="关联角色" show-overflow-tooltip></el-table-column>
				<el-table-column prop="department" label="部门" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="用户状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column> -->

				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-if="count > 0"
				style="margin: 0 auto"
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="queryParams.current"
				background
				v-model:page-size="queryParams.size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="count"
			>
			</el-pagination>
		</el-card>
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { getUserList, getUserRoleList, updateUser, updateUserStatus } from '/@/api/user';
import { User, UserForm, UserQuery, UserRole } from './types';
import { formatDateTime } from '/@/utils/formatTime';
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/system/user/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = reactive<SysUserState | any>({
	count: 0,
	update: false,
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 10,
		},
	},
	loading: false,
	queryParams: {
		current: 1,
		size: 10,
	} as UserQuery,
	typeList: [
		{
			value: 1,
			label: '邮箱',
		},
		{
			value: 2,
			label: 'QQ',
		},
		{
			value: 3,
			label: 'Gitee',
		},
		{
			value: 4,
			label: 'Github',
		},
	],
	userList: [] as User[],
	userForm: {} as UserForm,
	userRoleList: [] as UserRole[],
	roleIdList: [] as string[],
});

const { count, update, loading, queryParams, typeList, userList, userForm, userRoleList, roleIdList } = toRefs(state);

// 初始化表格数据
const getTableData = () => {
	loading.value = true;
	getUserList(queryParams.value).then(({ data }) => {
		userList.value = data.recordList;
		count.value = data.count;
		loading.value = false;
	});
	setTimeout(() => {
		state.tableData.loading = false;
	}, 500);
};

// 查询动作
const handleQuery = () => {};

// 解封,封禁动作
const handleChangeStatus = (user: User) => {
	let text = user.isDisable === 0 ? '解封' : '封禁';
	ElMessageBox.confirm(`确定要 ${text} ${user.nickname}吗?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			updateUserStatus({ id: 1, isDisable: 0 }).then((data) => {
				if (data.flag) {
					ElMessage.success(data.msg);
					getTableData();
				} else {
					user.isDisable = user.isDisable === 0 ? 1 : 0;
				}
			});
		})
		.catch(() => {
			user.isDisable = user.isDisable === 0 ? 1 : 0;
		});
};
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, row: RowUserType) => {
	userDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: RowUserType) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};
// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.param.pageSize = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNum = val;
	getTableData();
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.system-user-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
		.el-table {
			flex: 1;
		}
	}
}
</style>
