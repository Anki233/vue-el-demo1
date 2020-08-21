<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="管理员列表" name="first">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini">添加管理员</el-button>
					<div class="ml-auto d-flex">
						<el-input v-model="keyword" class="mr-2" size="mini" style="width: 200px;"></el-input>
						<el-button type="info" size="mini">搜索</el-button>
					</div>
				</div>
				<el-table border class="mt-3" :data="managerList">
					<el-table-column align="center" label="用户头像" width="120">
						<template slot-scope="scope">
							<el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="登录账户" align="center">
					</el-table-column>
					<el-table-column prop="phone" align="center" label="手机" width="180">
					</el-table-column>
					<el-table-column prop="email" align="center" label="邮箱" width="180">
					</el-table-column>
					<el-table-column align="center" label="所属用户组" width="180">
						<template slot-scope="scope">
							{{scope.row.group.name}}
						</template>
					</el-table-column>
					<el-table-column label="状态" align="center" width="180">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="180">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="success" plain size="mini">修改</el-button>
								<el-button type="danger" plain size="mini">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="角色列表" name="second">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini">添加角色</el-button>
				</div>
				<el-table border class="mt-3" :data="groupList">
					<el-table-column prop="name" label="角色名称" align="center">
					</el-table-column>
					<el-table-column prop="create_time" label="添加时间" align="center">
					</el-table-column>
					<el-table-column label="状态" align="center" width="180">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="220">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="text" plain size="mini">修改</el-button>
								<el-button class="mx-2" type="text" plain size="mini">配置权限</el-button>
								<el-button type="text" plain size="mini">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限管理" name="third">
				<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"
				 draggable @node-drop="nodeDrop">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div>
							<el-input v-if="data.editStatus" v-model="data.label" size="mini" style="width: 150px;"></el-input>
							<span v-else>{{ node.label }} </span>
						</div>
						<span>
							<el-button @click.stop="showOrHide(data)" size="mini" :type="data.status ? 'primary' : 'danger'">
								{{data.status ? '显示' : '隐藏'}}
							</el-button>
							<el-button type="success" size="mini" @click="append(data)">
								增加
							</el-button>
							<el-button :type="data.editStatus ?'default':'warning'" size="mini" @click="edit(data)">
								{{data.editStatus ? '完成':'修改'}}
							</el-button>
							<el-button type="danger" size="mini" @click="remove(node,data)">删除</el-button>
						</span>
					</span>
				</el-tree>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				keyword: "",
				managerList: [{
					id: 10,
					username: "用户名",
					avatar: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=27&gp=0.jpg",
					phone: "123467982407",
					email: "xx111@145.com",
					group_id: 1,
					group: {
						id: 1,
						name: '普通管理员'
					},
					status: 1
				}],
				groupList: [{
					id: 10,
					name: "超级管理员",
					create_time: "2019-08-25 14:25:58",
					status: 1
				}],
				activeName: 'first',
				form: {
					customer: "",
					key: ""
				},
				data: [{
					id: 1,
					label: '一级 1',
					status: 1,
					editStatus: false,
					children: [{
						id: 2,
						label: '二级 1-1',
						status: 1,
						editStatus: false,
						children: [{
							id: 3,
							label: '三级 1-1-1',
							status: 1,
							editStatus: false,
						}]
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		filters: {
			formatType(value) {
				let arr = ['按重量', '按件数']
				return arr[value]
			}
		},
		methods: {
			handleNodeClick(data) {
				console.log(data);
			},
			// 显示/隐藏
			showOrHide(data) {
				data.status = data.status ? 0 : 1
			},
			// 编辑/提交
			edit(data) {
				data.editStatus = !data.editStatus
			},
			// 删除
			remove(node, data) {
				this.$confirm('是否删除该分类', '提示', {
					confirmButtonText: '删除',
					cancleButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const parent = node.parent;
					const children = parent.data.children || parent.data;
					const index = children.findIndex(d => d.id === data.id);
					children.splice(index, 1);
				})
			},
			// 增加子分类
			append(data) {
				let newObj = {
					id: 2,
					label: '默认分类',
					status: 1,
					editStatus: true,
					children: []
				}
				data.children.push(newObj)
			},
			// 拖拽
			nodeDrop(...options) {
				console.log(options[0].data)
				console.log(options[1].data)
			},
		}
	};
</script>
