<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<buttonSearch class="pt-3" placeholder="手机号/邮箱/会员名称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加会员</el-button>
			</template>
			<template #form>
				<!-- 表单 -->
				<el-form inline ref="form" :model="search" label-width="100px">
					<el-form-item label="搜索内容" class="mb-0">
						<el-input size="mini" v-model="search.keyword" placeholder="手机号/邮箱/会员名称"></el-input>
					</el-form-item>
					<el-form-item label="会员等级" class="mb-0">
						<el-select v-model="search.user_level_id" size="mini" placeholder="请选择会员等级">
							<el-option v-for="(item,index) in user_level" :key="index" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
						<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</buttonSearch>
		<!-- 商品列表 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%">
			<el-table-column label="会员" width="280">
				<template slot-scope="scope">
					<div class="media">
						<div class="media-left">
							<a href="#">
								<img style="width: 40px;height: 40px;" class="media-object rounded-circle" :src="scope.row.avatar">
							</a>
						</div>
						<div class="media-body ml-2">
							<h6 class="mt-0 d-flex align-items-center">
								{{scope.row.username}}
								<el-button class="ml-auto" type="text">详情</el-button>
							</h6>
							用户名id：{{scope.row.id}}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="会员等级" width="180">
				<template slot-scope="scope">
					{{scope.row.user_level.name}}
				</template>
			</el-table-column>
			<el-table-column label="注册/登录" align="center">
				<template slot-scope="scope">
					<div>注册时间：{{scope.row.create_time}}</div>
					<div>最后登录：{{scope.row.last_login_time}}</div>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" width="180">
				<template slot-scope="scope">
					<el-button :type="scope.row.status===1? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
						{{scope.row.status===1? '启用' : '禁用'}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 65px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
			<div style="flex:1" class="px-2">
				<el-pagination :current-page="page.current" :page-sizes="page.sizes" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
				 :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
				</el-pagination>
			</div>
		</el-footer>
		<!-- 新增/修改模态框 -->
		<el-dialog title="添加会员" :visible.sync="createModel" width="40%" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<span v-if="!form.avatar" class="btn btn-light border mr-2" @click="chooseImage">
							<i class="el-icon-plus"></i>
						</span>
						<img v-else :src="form.avatar" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage" />
					</div>
				</el-form-item>
				<el-form-item label="等级">
					<el-select v-model="form.user_level_id" placeholder="请选择会员等级" size="mini">
						<el-option v-for="(item,index) in user_level" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
					<el-input v-model="form.phone" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	import common from '@/common/mixins/common.js'
	
	export default {
		mixins:[common],
		inject:['layout','app'],
		components: {
			buttonSearch
		},
		data() {
			return {
				preUrl:"user",
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				tableData:[],
				createModel: false,
				editIndex: -1,
				search: {
					keyword: "",
					user_level_id: ""
				},
				form: {
					username: "",
					password: "",
					nickname: "",
					avatar: "",
					user_level_id: "",
					phone: "",
					email: "",
					status: 1
				},
				user_level:[]
			}
		},
		methods: {
			getListResult(e) {
				this.tableData = e.list
				this.user_level = e.user_level
			},
			// 打开模态框
			openModel(e = false) {
				// 增加
				if (!e) {
					// 初始化表单
					this.form = {
						username: "",
						password: "",
						nickname: "",
						avatar: "",
						user_level_id: 3,
						phone: "",
						email: "",
						status: 1
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = {
						username: e.row.username,
						password: "",
						nickname: e.row.nickname,
						avatar: e.row.avatar,
						user_level_id: e.row.user_level_id,
						phone: e.row.phone,
						email: e.row.email,
						status: e.row.status
					}
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 添加规格
			submit() {
				let id = 0
				if (this.editIndex !== -1) {
					id = this.tableData[this.editIndex].id
				} 
				this.addOrEdit(this.form,id)
				this.createModel = false
			},
			// 加载数据
			handleClick(tab, event) {
				console.log(tab.index)
			},
			// 清空筛选条件
			clearSearch() {
				this.search = {
					keyword: "",
					user_level_id: ""
				}
			},
			// 获取请求列表分页url
			getListUrl() {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.search.keyword}&user_level_id=${this.search.user_level_id}`
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'string') {
					this.search.keyword = e
					this.getList()
					return
				}
				// 高级搜索
				this.getList()
				console.log('搜索事件')
			},
			// 选择图片
			chooseImage() {
				this.app.chooseImage((res) => {
					this.form.avatar = res[0].url
				}, 1)
			}
		}
	}
</script>

<style>
</style>
