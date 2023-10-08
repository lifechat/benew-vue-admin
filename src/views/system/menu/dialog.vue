<template>
	<div class="system-menu-dialog-container">
		<el-dialog :title="props.title" v-model="state.ruleForm.isShowDialog" width="769px">
			<el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级菜单">
							<el-cascader
								:options="props.menuData"
								:props="{ checkStrictly: true, value: 'id', label: 'menuName' }"
								placeholder="请选择上级菜单"
								clearable
								class="w100"
								v-model="state.ruleForm.menuSuperior"
							>
								<template #default="{ node, data }">
									<span>{{ data.menuName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单类型" :rules="[{ required: true, message: '菜单类型不能为空', trigger: 'blur' }]">
							<el-radio-group v-model="state.ruleForm.menuType">
								<el-radio label="M">目录</el-radio>
								<el-radio label="C">菜单</el-radio>
								<el-radio label="B">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单名称" :rules="[{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.name" placeholder="请输入菜单名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'C' || state.ruleForm.menuType === 'M'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="路由路径" :rules="[{ required: true, message: '路由路径不能为空', trigger: 'blur' }]">
								<el-input v-model="state.ruleForm.path" placeholder="请输入路由路径值" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="重定向">
								<el-input v-model="state.ruleForm.redirect" placeholder="请输入路由重定向" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="菜单图标">
								<IconSelector placeholder="请输入菜单图标" v-model="state.ruleForm.meta.icon" />
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="组件路径" :rules="[{ required: true, message: '组件路径不能为空', trigger: 'blur' }]">
								<el-input v-model="state.ruleForm.componentAlias" placeholder="组件路径" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识">
								<el-select v-model="state.ruleForm.meta.roles" multiple placeholder="取角色管理" clearable class="w100">
									<el-option label="admin" value="admin"></el-option>
									<el-option label="common" value="common"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</template>
					<template v-if="state.ruleForm.menuType === 'B'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="权限标识">
								<el-input v-model="state.ruleForm.btnPower" placeholder="请输入权限标识" clearable></el-input>
							</el-form-item>
						</el-col>
					</template>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="菜单排序">
							<el-input-number v-model="state.ruleForm.menuSort" controls-position="right" placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<template v-if="state.ruleForm.menuType === 'C' || state.ruleForm.menuType === 'M'">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否隐藏">
								<el-radio-group v-model="state.ruleForm.meta.isHide">
									<el-radio :label="1">隐藏</el-radio>
									<el-radio :label="0">不隐藏</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="页面缓存">
								<el-radio-group v-model="state.ruleForm.meta.isKeepAlive">
									<el-radio :label="true">缓存</el-radio>
									<el-radio :label="false">不缓存</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否固定">
								<el-radio-group v-model="state.ruleForm.meta.isAffix">
									<el-radio :label="true">固定</el-radio>
									<el-radio :label="false">不固定</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否禁用">
								<el-radio-group v-model="state.ruleForm.meta.isDisable">
									<el-radio :label="1">是</el-radio>
									<el-radio :label="0">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否内嵌">
								<el-radio-group v-model="state.ruleForm.meta.isIframe" @change="onSelectIframeChange">
									<el-radio :label="true">是</el-radio>
									<el-radio :label="false">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { defineAsyncComponent, reactive, onMounted, ref, defineProps } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { i18n } from '/@/i18n/index';
import { addMenu } from '/@/api/menu';
import { ElMessage } from 'element-plus';
import { isEmpty } from '/@/utils/authFunction';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

// 定义变量内容
const props = defineProps({
	title: String,
	submitTxt: String,
	menuData: [] as any,
});
const menuDialogFormRef = ref();
const stores = useRoutesList();
const { routesList } = storeToRefs(stores);
const state = reactive({
	// 参数请参考 `/src/router/route.ts` 中的 `dynamicRoutes` 路由菜单格式
	ruleForm: {
		isShowDialog: false,
		menuSuperior: [], // 上级菜单
		menuType: 'M', // 菜单类型
		name: '', // 路由名称
		component: '', // 组件路径
		componentAlias: '', // 组件路径别名
		isLink: false, // 是否外链
		menuSort: 0, // 菜单排序
		path: '', // 路由路径
		redirect: '', // 路由重定向，有子集 children 时
		meta: {
			title: '', // 菜单名称
			icon: '', // 菜单图标
			isHide: 0, // 是否隐藏
			isKeepAlive: true, // 是否缓存
			isAffix: false, // 是否固定
			isDisable: 0, // 是否禁用
			isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
			isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
			roles: '', // 权限标识，取角色管理
		},
		btnPower: '', // 菜单类型为按钮时，权限标识
	},
	menuData: [] as RouteItems, // 上级菜单数据
	dialog: {
		type: '',
		title: '',
		isShowDialog: false,
		submitTxt: '',
	},
});

// 获取 pinia 中的路由
const getMenuData = (routes: RouteItems) => {
	const arr: RouteItems = [];
	routes.map((val: RouteItem) => {
		val['title'] = i18n.global.t(val.meta?.title as string);
		arr.push({ ...val });
		if (val.children) getMenuData(val.children);
	});
	return arr;
};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
	if (type === 'edit') {
		// 模拟数据，实际请走接口
		row.menuType = 'menu';
		row.menuSort = Math.floor(Math.random() * 100);
		state.ruleForm = JSON.parse(JSON.stringify(row));
		console.log(state.ruleForm);
		state.dialog.title = '修改菜单';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增菜单';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	menuDialogFormRef.value.resetFields();
		// });
	}
	state.ruleForm.isShowDialog = true;
};

// 是否内嵌下拉改变
const onSelectIframeChange = () => {
	if (state.ruleForm.meta.isIframe) state.ruleForm.isLink = true;
	else state.ruleForm.isLink = false;
};

// 关闭弹窗
const closeDialog = () => {
	state.ruleForm.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// 新增菜单
const handleAddMenu = async () => {
	console.log(state.ruleForm);
	const { menuType, meta, name, menuSort, path, componentAlias, menuSuperior, btnPower } = state.ruleForm;
	const params = {
		menuType: menuType,
		icon: meta.icon,
		path: path,
		menuName: name,
		orderNum: menuSort,
		component: componentAlias,
		isHidden: meta.isHide,
		isDisable: meta.isDisable,
		perms: btnPower,
		parentId: menuSuperior[0],
		create_time: new Date(),
	};
	try {
		const res = await addMenu(params);
		console.log(res);
	} catch (error: any) {
		ElMessage.error(error);
	}
};
// 提交
const onSubmit = () => {
	const { name, path, componentAlias, component } = state.ruleForm;
	if (isEmpty(name) && isEmpty(path) && isEmpty(componentAlias) && isEmpty(component)) {
		ElMessage({
			type: 'error',
			message: '请填写对应内容',
		});
		return;
	}
	handleAddMenu();
	closeDialog(); // 关闭弹窗
	emit('refresh');
};
// 页面加载时
onMounted(() => {
	state.menuData = getMenuData(routesList.value);
});

// 暴露变量
defineExpose({
	openDialog,
});
</script>
