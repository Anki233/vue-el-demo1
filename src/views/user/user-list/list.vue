<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<buttonSearch class="pt-3" placeholder="手机号/邮箱/会员名称">
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
						<el-select v-model="search.group_id" size="mini" placeholder="请选择会员等级">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间" class="mb-0">
						<el-date-picker class="mr-2" size="mini" v-model="search.time" type="daterange" align="right" unlink-panels
						 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
						</el-date-picker>
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
					{{scope.row.level.name}}
				</template>
			</el-table-column>
			<el-table-column label="注册/登录" align="center">
				<template slot-scope="scope">
					<div>注册时间：{{scope.row.create_time}}</div>
					<div>最后登录：{{scope.row.update_time}}</div>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" width="180">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button type="text" size="mini">重置密码</el-button>
					<el-button type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 65px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
			<div style="flex:1" class="px-2">
				<el-pagination :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper"
				 :total="400">
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
					<el-select v-model="form.level_id" placeholder="请选择会员等级" size="mini">
						<el-option label="普通会员" :value="1"></el-option>
						<el-option label="黄金会员" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机" prop="phone">
					<el-input v-model="form.phone" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="form.sex" size="mini">
						<el-radio-button :label="0">保密</el-radio-button>
						<el-radio-button :label="1">男</el-radio-button>
						<el-radio-button :label="2">女</el-radio-button>
					</el-radio-group>
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
	import buttonSearch from "../../../components/common/button-search.vue"
	export default {
		components: {
			buttonSearch
		},
		inject: ['app'],
		data() {
			return {
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
				tableData: [{
					id: 10,
					username: "用户名",
					avatar: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=27&gp=0.jpg",
					level_id: 1,
					level: {
						id: 1,
						name: '普通会员'
					},
					create_time: "2019-07-24 15:52:56",
					update_time: "2019-08-20 12:41:05",
					status: 1, //启用
				}],
				currentPage: 1,
				createModel: false,
				editIndex: -1,
				search: {
					keyword: "",
					group_id: "",
					time: ""
				},
				form: {
					username: "",
					password: "",
					nickname: "",
					avatar: "",
					level_id: "",
					phone: "",
					email: "",
					sex: 0,
					status: 1
				}
			}
		},
		created() {

		},
		methods: {
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
						level_id: "",
						phone: "",
						email: "",
						sex: 0,
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
						level_id: e.row.level_id,
						phone: e.row.phone,
						email: e.row.email,
						sex: e.row.sex,
						status: e.row.status
					}
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 添加规格
			submit() {
				var msg = "添加"
				if (this.editIndex === -1) {
					this.form.level = {
						id:1,
						name:'普通会员'
					}
					this.tableData.unshift(this.form)
				} else {
					let item = this.tableData[this.editIndex]
					item.username = this.form.username
					item.password = this.form.password
					item.nickname = this.form.nickname
					item.avatar = this.form.avatar
					item.level_id = this.form.level_id
					item.phone = this.form.phone
					item.email = this.form.email
					item.sex = this.form.sex
					item.status = this.form.status
					msg = "修改"
				}
				this.createModel = false
				this.$message({
					message: msg + '成功',
					type: 'success'
				})
			},
			// 加载数据
			handleClick(tab, event) {
				console.log(tab.index)
			},
			// 删除单个
			deleteItem(scope) {
				this.$confirm('是否要删除该会员', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.tableData.splice(scope.$index, 1)
					this.$message({
						message: '删除成功',
						type: 'success'
					})
				})
			},
			// 清空筛选条件
			clearSearch() {
				this.search = {
					keyword: "",
					group_id: "",
					time: ""
				}
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'String') {
					return console.log('简单搜索', e)
				}
				// 高级搜索
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
