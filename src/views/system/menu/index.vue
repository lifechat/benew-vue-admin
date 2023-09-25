<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<el-form :model="state.queryParams" :inline="true" v-show="state.showSearch">
				<el-form-item label="菜单名称">
					<el-input @keyup.enter="getQueryData" v-model="state.queryParams.keyword" style="width: 200px" placeholder="请输入菜单名称" clearable />
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="state.queryParams.menutype" placeholder="类型" clearable>
						<el-option label="目录" value="M" />
						<el-option label="菜单" value="C" />
						<el-option label="按钮" value="B" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="state.queryParams.isDisable" placeholder="菜单状态" clearable style="width: 200px">
						<el-option v-for="item in isDisable" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button size="default" type="primary" @click="getQueryData">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" type="plain" @click="handleReset">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button size="default" type="success" class="ml10" @click="onOpenAddMenu">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增菜单
					</el-button>
				</el-form-item>
			</el-form>
			<!-- 表格展示 -->
			<el-table
				v-if="refreshTable"
				v-loading="loading"
				:data="menuList"
				row-key="id"
				:default-expand-all="isExpandAll"
				:tree-props="defaultProps"
				highlight-current-row
			>
				<!-- 菜单名称 -->
				<el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="200"></el-table-column>
				<!-- 图标 -->
				<el-table-column prop="icon" label="图标" align="center" width="90">
					<template #default="scope">
						<SvgIcon :name="scope.row.icon" />
					</template>
				</el-table-column>
				<!-- 排序 -->
				<el-table-column prop="orderNum" label="排序" align="center" width="60"></el-table-column>
				<!-- 类型 -->
				<el-table-column prop="menuType" label="类型" align="center" width="80">
					<template #default="scope">
						<el-tag v-if="scope.row.menuType === 'M'" type="warning">目录</el-tag>
						<el-tag v-if="scope.row.menuType === 'C'" type="success">菜单</el-tag>
						<el-tag v-if="scope.row.menuType === 'B'" type="danger">按钮</el-tag>
					</template>
				</el-table-column>
				<!-- 状态 -->
				<el-table-column prop="status" label="状态" align="center" width="80">
					<template #default="scope">
						<el-tag v-if="scope.row.isDisable === 0">正常</el-tag>
						<el-tag v-if="scope.row.isDisable === 1" type="danger">禁用</el-tag>
					</template>
				</el-table-column>
				<!-- 权限标识 -->
				<el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
				<!-- 组件路径 -->
				<el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
				<!-- 是否隐藏 -->
				<el-table-column prop="status" label="是否隐藏" align="center" width="90">
					<template #default="scope">
						<el-tag v-if="scope.row.isHidden === 0">否</el-tag>
						<el-tag v-if="scope.row.isHidden === 1" type="danger">是</el-tag>
					</template>
				</el-table-column>
				<!-- 创建时间 -->
				<el-table-column label="创建时间" align="center" prop="createTime" width="160">
					<template #default="scope">
						<span>{{ formatDateTime(scope.row.createTime) }}</span>
					</template>
				</el-table-column>
				<!-- 操作 -->
				<el-table-column label="操作" align="center" width="210">
					<template #default="scope">
						<el-button
							v-if="scope.row.menuType === 'M' || scope.row.menuType === 'C'"
							size="small"
							text
							type="primary"
							@click="onOpenAddMenu(scope.row, 'add')"
							>新增</el-button
						>
						<el-button size="small" text type="primary" @click="onOpenEditMenu(scope.row, 'edit')">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
						<!-- <el-button v-if="scope.row.menuType === 'M' || scope.row.menuType === 'C'" type="success" link icon="Plus" @click="handleAdd(scope.row)"
							>新增</el-button
						> -->
						<!-- <el-button type="primary" link icon="Edit" @click="handleEdit(scope.row.id)">编辑</el-button>
						<el-button type="danger" link icon="Delete" @click="handleDelete(scope.row.id)">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { defineAsyncComponent, ref, onMounted, reactive, toRefs } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getMenuList, deleteMenu } from '/@/api/menu';
import { MenuOption, MenuQuery, MenuForm, Menu } from '/@/api/menu/types';
import { formatDateTime } from '/@/utils/formatTime';
import { mutable } from 'element-plus/es/utils';
// import { setBackEndControlRefreshRoutes } from "/@/router/backEnd";

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('/@/views/system/menu/dialog.vue'));

// 定义变量内容
const defaultProps = { value: 'id', label: 'label', children: 'children' };

const menuDialogRef = ref();
const state = reactive({
	showSearch: true,
	loading: false,
	title: '',
	addOrUpdate: false,
	queryParams: {} as MenuQuery,
	isDisable: [
		{
			value: 0,
			label: '正常',
		},
		{
			value: 1,
			label: '禁用',
		},
	],
	isHidden: [
		{
			value: 0,
			label: '显示',
		},
		{
			value: 1,
			label: '隐藏',
		},
	],
	showChooseIcon: false,
	refreshTable: true,
	isExpandAll: false,
	menuOptions: [] as MenuOption[],
	menuForm: {} as MenuForm,
	menuList: [] as Menu[],
	tableData: {
		data: [] as RouteRecordRaw[],
		loading: true,
	},
});

const {
	showSearch,
	loading,
	title,
	addOrUpdate,
	queryParams,
	isDisable,
	isHidden,
	showChooseIcon,
	refreshTable,
	isExpandAll,
	menuOptions,
	menuForm,
	menuList,
} = toRefs(state);

const getQueryData = () => {
	// 解决查询字段为空的bug 不出结果
	const { keyword, menutype, isDisable } = state.queryParams;
	if (!keyword) {
		state.queryParams.keyword = null;
	}
	if (!menutype) {
		state.queryParams.menutype = null;
	}
	if (!isDisable) {
		state.queryParams.isDisable = null;
	}
	if (!keyword || !menutype || !isDisable) {
		getMenuList(state.queryParams).then(({ data }) => {
			state.menuList = data;
			state.tableData.loading = true;
		});
	}
};
// 获取路由数据，真实请从接口获取
const getTableData = () => {
	getMenuList().then(({ data }) => {
		state.menuList = data;
		setTimeout(() => {
			state.tableData.loading = false;
		}, 500);
	});
};
// 打开新增菜单弹窗
const onOpenAddMenu = (row: any, type: string) => {
	menuDialogRef.value.openDialog(row, type);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (row: any, type: string) => {
	menuDialogRef.value.openDialog(row, type);
};
// 重置操作
const handleReset = () => {
	getTableData();
};

// 删除当前行
const onTabelRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})

		.then(() => {
			handleDelMenu(row.id);
			getTableData();
		})
		.catch((error) => {
			ElMessage.error(error);
		});
};

const handleDelMenu = async (id: number) => {
	try {
		await deleteMenu(id);
		ElMessage.success('删除成功');
		getTableData();
	} catch (error: any) {
		ElMessage.error(error);
	}
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>
