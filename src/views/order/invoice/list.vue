<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<buttonSearch class="pt-3">
			<template #right>
				<div class="d-flex align-items-center">
					<el-date-picker class="mr-2" size="medium" v-model="search.time" type="daterange" align="right" unlink-panels
					 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
					</el-date-picker>
					<el-input v-model="search.keyword" class="mr-2" style="width: 150px;" size="medium" placeholder="请输入订单编号"></el-input>
					<el-button type="info" size="medium">搜索</el-button>
				</div>
			</template>
		</buttonSearch>
		<!-- 商品列表 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center">
			</el-table-column>
			<el-table-column prop="name" label="订单编号" align="center">
			</el-table-column>
			<el-table-column prop="username" label="用户名" align="center">
			</el-table-column>
			<el-table-column prop="price" label="开票金额" align="center">
			</el-table-column>
			<el-table-column prop="order" label="抬头" align="center">
			</el-table-column>
			<el-table-column prop="content" label="发票内容" align="center">
			</el-table-column>
			<el-table-column prop="code" label="纳税人识别号" align="center">
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center" width="180">
				<template slot-scope="scope">
					<el-button-group>
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
	</div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	
	export default {
		components: {
			buttonSearch
		},
		data() {
			return {
				tableData: [],
				currentPage: 1,
				multipleSelection: [],
				search: {
					time: "",
					keyword: ""
				},
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
			}
		},
		created() {

		},
		methods: {
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
