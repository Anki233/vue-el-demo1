<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<buttonSearch class="pt-3">
			<!-- 左边 -->
			<template #left>
				<el-button type="primary" size="mini" @click="openModel(false)">添加等级</el-button>
			</template>
			<template #right>
				<div>
					<small class="mr-2">选择升级标准：</small>
					<el-radio-group v-model="level" size="mini">
						<el-radio-button :value="0" :label="0">累计消费</el-radio-button>
						<el-radio-button :value="1" :label="1">累计次数</el-radio-button>
					</el-radio-group>
				</div>
			</template>
		</buttonSearch>
		<!-- 商品列表 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%">
			<el-table-column prop="name" align="center" label="等级名称" width="180">
			</el-table-column>
			<el-table-column label="升级条件" align="center">
				<template slot-scope="scope">
					{{getLevel.name + ':' + scope.row[getLevel.value]}}
				</template>
			</el-table-column>
			<el-table-column prop="discont" align="center" label="折扣率(%)" width="180">
			</el-table-column>
			<el-table-column prop="level" align="center" label="等级序号" width="180">
			</el-table-column>
			<el-table-column label="状态" align="center" width="180">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="success" plain size="mini" @click="openModel(scope)">修改</el-button>
						<el-button type="danger" plain size="mini" @click="deleteItem(scope)">删除</el-button>
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
		<el-dialog title="添加等级" :visible.sync="createModel" width="40%" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="等级名称" prop="name">
					<el-input v-model="form.name" size="mini" style="width: 25%;"></el-input>
					<small class="text-secondary d-block">设置会员等级</small>
				</el-form-item>
				<el-form-item label="等级权重" prop="level">
					<el-input-number v-model="form.level" size="mini" style="width: 25%;"></el-input-number>
					<small class="text-secondary d-block">
						设置会员等级排序(此参数决定等级的高低,排序越大等级越高,请谨慎选择)
					</small>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="升级条件">
					<div>
						<small class="mr-2">累计消费满</small>
						<el-input class="mr-2" size="mini" v-model="form.consume" style="width: 25%;">
							<template slot="append">元</template>
						</el-input>
						<small class="text-secondary">设置会员等级所需要的累计消费必须大于等于0，单位：元</small>
					</div>
					<div>
						<small class="mr-2">累计次数满</small>
						<el-input class="mr-2" size="mini" v-model="form.times" style="width: 25%;">
							<template slot="append">笔</template>
						</el-input>
						<small class="text-secondary">设置会员等级所需要的购买量必须大于等于0，单位：笔</small>
					</div>
				</el-form-item>
				<el-form-item label="折扣率(%)">
					<el-input v-model="form.discont" size="mini" style="width: 25%;margin-bottom:0 10px;">
						 <template slot="append">%</template>
					</el-input>
					<p style="font-size: 12px;">折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</p>
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
				level:0,
				tableData: [{
					name:"普通会员",
					consume:100,
					times:10,
					discont:10,
					level:1,
					status:1,
					create_time:""
				}],
				currentPage: 1,
				createModel: false,
				editIndex: -1,
				form: {
					name:"普通会员",
					consume:0,
					times:0,
					discont:0,
					level:0,
					status:1,
				}
			}
		},
		created() {

		},
		computed: {
			getLevel(){
				let arr = [{
					name:"累计消费",
					value:"consume"
				},{
					name:"累计次数",
					value:"times"
				}]
				return arr[this.level]
			}
		},
		methods: {
			// 打开模态框
			openModel(e = false) {
				// 增加
				if (!e) {
					// 初始化表单
					this.form = {
						name:"普通会员",
						consume:0,
						times:0,
						discont:0,
						level:0,
						status:1,
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = {
						name: e.row.name,
						consume: e.row.consume,
						times: e.row.times,
						discont: e.row.discont,
						level: e.row.level,
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
					this.tableData.unshift(this.form)
				} else {
					let item = this.tableData[this.editIndex]
					item.name = this.form.name
					item.consume = this.form.consume
					item.times = this.form.times
					item.discont = this.form.discont
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
				this.$confirm('是否要删除该等级', '提示', {
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
	.el-form-item{
		margin: 0 0 12px;
	}
</style>
