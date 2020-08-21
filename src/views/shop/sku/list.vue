<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<buttonSearch class="pt-3" :showSearch="false">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加规格</el-button>
				<el-button type="danger" size="mini" @click="deleteAll()">批量删除</el-button>
			</template>
		</buttonSearch>

		<!-- 商品列表 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center">
			</el-table-column>
			<el-table-column prop="name" label="规格名称" align="center" width="200">
			</el-table-column>
			<el-table-column prop="value" label="规格值">
			</el-table-column>
			<el-table-column prop="order" label="排序" align="center" width="220">
			</el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="180">
				<template slot-scope="scope">
					<el-button :type="scope.row.status===1? 'success' : 'danger'" size="mini" plain @click="changeStatus(scope.row)">
						{{scope.row.status===1? '启用' : '禁用'}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="success" size="mini" plain @click="openModel(scope)">编辑</el-button>
						<el-button type="danger" size="mini" plain @click="deleteItem(scope)">删除</el-button>
					</el-button-group>
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
		<el-dialog title="添加规格" :visible.sync="createModel" width="40%" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="规格名称" prop="name">
					<el-input v-model="form.name" placeholder="规格名称" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="form.order" :min="0" size="mini"></el-input-number>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启动</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="form.type" size="mini">
						<el-radio :label="0" border>文字</el-radio>
						<el-radio :label="1" border>颜色</el-radio>
						<el-radio :label="2" border>图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规格值" prop="value">
					<el-input type="textarea" :rows="3" placeholder="一行为一个规格项, 多个规格项用换行输入" v-model="form.value">
					</el-input>
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
		data() {
			return {
				tableData: [{
					id: 1,
					name: "颜色",
					value: "棕色,蓝色",
					order: 50,
					status: 1,
					type: 0
				}, {
					id: 2,
					name: "尺寸",
					value: "XL,XXL",
					order: 50,
					status: 1,
					type: 0
				}, {
					id: 3,
					name: "颜色",
					value: "棕色,黑色",
					order: 50,
					status: 1,
					type: 0
				}],
				currentPage: 1,
				multipleSelection: [],
				createModel: false,
				editIndex: -1,
				form: {
					name: "",
					order: 50,
					status: 1,
					type: 0,
					value: ""
				},
				rules: {
					name: [{
						required: true,
						message: '规格名称不能为空',
						trigger: 'blur'
					}],
					value: [{
						required: true,
						message: '规格值不能为空',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {

		},
		methods: {
			// 批量删除
			deleteAll() {
				this.$confirm('是否要删除选中规格', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item=>{
						let index = this.tableData.findIndex(v=>v.id === item.id)
						if(index !== -1) {
							this.tableData.splice(index,1)
						}
					})
					this.multipleSelection = []
					this.$message({
						message: '删除成功',
						type: 'success'
					})
				})
			},
			// 打开模态框
			openModel(e = false) {
				// 增加
				if (!e) {
					// 初始化表单
					this.form = {
						name: "",
						order: 50,
						status: 1,
						type: 0,
						value: ""
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = {
						name: e.row.name,
						order: e.row.order,
						status: e.row.status,
						type: e.row.type,
						value: e.row.value.replace(/,/g, '\n')
					}
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 添加规格
			submit() {
				this.$refs.form.validate(res => {
					if (res) {
						var msg = "添加"
						this.form.value = this.form.value.replace(/\n/g, ',')
						if (this.editIndex === -1) {
							this.tableData.unshift(this.form)
						} else {
							let item = this.tableData[this.editIndex]
							item.name = this.form.name
							item.order = this.form.order
							item.status = this.form.status
							item.type = this.form.type
							item.value = this.form.value
							msg = "修改"
						}
						this.createModel = false
						this.$message({
							message: msg + '成功',
							type: 'success'
						})
					}
				})
			},
			// 修改状态
			changeStatus(item) {
				// 请求服务器修改状态
				item.status = item.status === 1 ? 0 : 1
				this.$message({
					message: item.status ? '启用' : '禁用',
					type: 'success'
				})
			},
			// 加载数据
			handleClick(tab, event) {
				console.log(tab.index)
			},
			// 选中
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 删除单个
			deleteItem(scope) {
				this.$confirm('是否要删除该规格', '提示', {
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
			}
		}
	}
</script>

<style>
</style>
