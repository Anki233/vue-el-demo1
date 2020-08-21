<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<buttonSearch class="pt-3" :showSearch="false">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="openModel(false)">添加类型</el-button>
				<el-button type="danger" size="mini" @click="deleteAll()">批量删除</el-button>
			</template>
		</buttonSearch>

		<!-- 商品列表 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center">
			</el-table-column>
			<el-table-column prop="name" label="类型名称" align="center" width="200">
			</el-table-column>
			<el-table-column label="属性标签">
				<template slot-scope="scope">
					{{scope.row.value_list | formatValue}}
				</template>
			</el-table-column>
			<el-table-column prop="order" label="属性排序" align="center" width="220">
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
		<el-dialog title="添加类型" :visible.sync="createModel" width="80%" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="类型名称" prop="name">
					<el-input v-model="form.name" placeholder="类型名称" size="mini" style="width: 150px;"></el-input>
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
				<el-form-item label="关联规格">
					<div class="d-flex">
						<span class="sku-list-item px-3 py-2 border rounded mr-3" style="line-height: initial;">
							<font>颜色</font>
							<i class="el-icon-delete"></i>
						</span>
						<el-button size="mini">
							<i class="el-icon-plus"></i>
						</el-button>
					</div>
				</el-form-item>
				<el-form-item label="属性列表">
					<el-table :data="value_list" style="width: 100%">
						<el-table-column prop="order" label="排序" width="80">
							<template slot-scope="scope">
								<el-input v-model="scope.row.order" size="mini" placeholder="排序"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="属性名称" width="130">
							<template slot-scope="scope">
								<el-input v-model="scope.row.name" size="mini" placeholder="属性名称"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="type" label="所属类型" width="130">
							<template slot-scope="scope">
								<el-select v-model="scope.row.type" placeholder="请选择所属类型" size="mini">
									<el-option label="输入框" value="input"></el-option>
									<el-option label="单选框" value="radio"></el-option>
									<el-option label="多选框" value="checkbox"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="是否显示" width="80">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="属性值">
							<template slot-scope="scope" v-if="scope.row.type !=='input'">
								<el-input v-if="scope.row.isedit" type="textarea" v-model="scope.row.value" size="mini" placeholder="一行为一个属性值,多个属性值用换行输入"></el-input>
								<span v-else> {{scope.row.value}}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="220">
							<template slot-scope="scope">
								<el-button v-if="scope.row.type !== 'input'" type="text" size="mini" @click="editRow(scope)">{{scope.row.isedit ? '完成' :'编辑属性值'}}</el-button>
								<el-button type="text" size="mini" @click="delRow(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
				<el-form-item>
					<el-button @click="addValue" type="text" size="mini" icon="el-icon-plus">添加一个属性</el-button>
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
					name: "鞋子",
					order: 50,
					status: 1,
					sku_list: [{
							id: 1,
							name: "颜色"
						},
						{
							id: 2,
							name: "尺寸"
						}
					],
					value_list: [{
						order: 50,
						name: "特性",
						type: 'input',
						value: ""
					}, {
						order: 50,
						name: "前置摄像头",
						type: 'input',
						value: ""
					}]
				}],
				currentPage: 1,
				multipleSelection: [],
				createModel: false,
				editIndex: -1,
				form: {
					name: "",
					order: 50,
					status: 1,
					sku_list: [],
				},
				value_list: [{

					order: 50,
					name: "属性名称",
					type: "input",
					value: "属性值",
					isedit: false
				}],
				rules: {
					name: [{
						required: true,
						message: '类型名称不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {

		},
		filters: {
			formatValue(value) {
				// ['特性']
				let arr = value.map(v => v.name)
				return arr.join(',')
			}
		},
		methods: {
			// 批量删除
			deleteAll() {
				this.$confirm('是否要删除选中规格', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item => {
						let index = this.tableData.findIndex(v => v.id === item.id)
						if (index !== -1) {
							this.tableData.splice(index, 1)
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
						sku_list: [],
					}
					this.value_list = []
					this.editIndex = -1
				} else {
					// 修改
					this.form = {
						...e.row
					}
					this.value_list = [...e.row.value_list]
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 添加类型
			submit() {
				this.$refs.form.validate(res => {
					// 验证属性列表
					var result = true
					var msg = []
					this.value_list.forEach((item, index) => {
						index++
						if (item.order == '') {
							result = result && false
							msg.push('第' + index + '行中的排序不能为空')
						}
						if (item.name == '') {
							result = result && false
							msg.push('第' + index + '行：属性名称不能为空')
						}
						if (item.type !== 'input' && item.value == '') {
							result = result && false
							msg.push('第' + index + '行：属性值不能为空')
						}
					})
					if (!result) {
						var temp = ''
						msg.forEach(v => {
							temp += `<li>${v}</li>`
						})
						return this.$notify({
							title: '提示',
							dangerouslyUseHTMLString: true,
							type: 'warning',
							message: `<ul style="list-style:none">${temp}</ul>`
						});
					}
					if (res) {
						var message = "添加"
						if (this.editIndex === -1) {
							this.tableData.unshift({
								...this.form,
								value_list:[...this.value_list]
							})
						} else {
							let item = this.tableData[this.editIndex]
							item.name = this.form.name
							item.order = this.form.order
							item.status = this.form.status
							item.type = this.form.type
							item.sku_list = this.form.value
							item.value_list = this.value_list
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
			// 生成数据
			__getData() {

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
			},
			// 增加属性
			addValue() {
				this.value_list.push({
					order: 50,
					name: "",
					type: "input",
					value: "",
					isedit: false
				})
			},
			// 编辑属性值
			editRow(scope) {
				scope.row.isedit = !scope.row.isedit
			},
			// 删除属性值
			delRow(index) {
				this.value_list.splice(index, 1)
			}
		}
	}
</script>

<style>
	.sku-list-item i {
		display: none;
		cursor: pointer;
	}

	.sku-list-item:hover {
		background-color: #f4f4f4;
	}

	.sku-list-item:hover font {
		display: none;
	}

	.sku-list-item:hover i {
		display: inline-block;
	}
</style>
