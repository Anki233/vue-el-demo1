<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane :label="tab.name" :key="tabI" v-for="(tab,tabI) in tabbars">
				<buttonSearch ref="buttonSearch" placeholder="要搜索的订单编号" @search="searchEvent">
					<!-- 左边 -->
					<template #left>
						<el-button type="warning" size="mini">导出数据</el-button>
						<el-button type="danger" size="mini">批量删除</el-button>
					</template>
					<!-- 高级搜索表单 -->
					<template #form>
						<!-- 表单 -->
						<el-form inline ref="form" :model="form" label-width="100px">
							<el-form-item label="订单编号" class="mb-0">
								<el-input size="mini" v-model="form.code" placeholder="要搜索的订单编号"></el-input>
							</el-form-item>
							<el-form-item label="订单状态" class="mb-0">
								<el-select v-model="form.type" size="mini" placeholder="请选择订单状态">
									<el-option label="区域一" value="shanghai"></el-option>
									<el-option label="区域二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="下单时间" class="mb-0">
								<el-date-picker class="mr-2" size="mini" v-model="form.time" type="daterange" align="right" unlink-panels
									range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="收货人" class="mb-0">
								<el-input size="mini" v-model="form.username" placeholder="请输入收货人姓名"></el-input>
							</el-form-item>
							<el-form-item label="手机号" class="mb-0">
								<el-input size="mini" v-model="form.phone" placeholder="请输入收货人手机号"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="info" size="mini" @click="searchEvent">搜索</el-button>
								<el-button size="mini" @click="clearSearch">清空筛选条件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</buttonSearch>
				<!-- 商品列表 -->
				<el-table border class="mt-3" :data="tableData[tabI].list" style="width: 100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="45" align="center">
					</el-table-column>
					<el-table-column prop="title" label="商品信息" width="320">
						<template slot-scope="scope">
							<div class="d-flex">
								<div style="flex:1">
									<p class="mb-1">订单编号</p>
									<p class="mb-1">
										<small><strong>2018080898545157</strong></small>
									</p>
								</div>
								<div style="flex:1">
									<p class="mb-1">下单时间</p>
									<p class="mb-1">
										<small><strong>2018-08-02 09:45:05</strong></small>
									</p>
								</div>
							</div>
							<div class="media">
								<img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.cover">
								<div class="media-body">
									<p><a class="text-primary">{{scope.row.title}}</a></p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="实付款" align="center">
						<template slot-scope="scope">
							<span>￥2000</span>
							<p><small>(含运费：￥0.00)</small></p>
						</template>
					</el-table-column>
					<el-table-column label="买家" align="center">
						<template slot-scope="scope">
							<span>用户名</span>
							<p><small>(用户名id：01)</small></p>
						</template>
					</el-table-column>
					<el-table-column label="支付方式" align="center">
						<template slot-scope="scope">
							<span class="badge badge-success">微信支付</span>
						</template>
					</el-table-column>
					<el-table-column label="配送方式" align="center">
						<template slot-scope="scope">
							<div><p>顺丰快递</p></div>
						</template>
					</el-table-column>
					<el-table-column label="交易状态" align="center">
						<template slot-scope="scope">
							<div>付款方式：<span class="badge badge-success">已付款</span></div>
							<div>付款方式：<span class="badge badge-secondary">代发货</span></div>
							<div>付款方式：<span class="badge badge-secondary">代收货</span></div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="120">
						<template slot-scope="scope">
								<el-button type="success" size="mini" plain>订单详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div style="height: 65px;"></div>
				<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
					<div style="flex:1" class="px-2">
						<el-pagination :current-page="tableData[tabI].currentPage"
						 :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
						</el-pagination>
					</div>
				</el-footer>
			</el-tab-pane>
		</el-tabs>
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
				tabIndex: 0,
				tabbars: [{
						name: "全部"
					},
					{
						name: "待付款"
					},
					{
						name: "代发货"
					},
					{
						name: "已发货"
					},
					{
						name: "已收货"
					},
					{
						name: "已完成"
					},
					{
						name: "已关闭"
					},
					{
						name: "退款中"
					}
				],
				form: {
					code: "",
					type: "",
					time:"",
					username:"",
					phone:""
				},
				tableData: [],
				multipleSelection: [],
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
			this.__getData()
		},
		methods: {
			// 生成数据
			__getData() {
				for (let i = 0; i < this.tabbars.length; i++) {
					this.tableData.push({
						currentPage: 1,
						list: []
					})
					for (let j = 0; j < 20; j++) {
						this.tableData[i].list.push({
							id: j,
							title: '荣耀 X10 Max 5G全网通 标配版 6GB+64GB 竞速蓝' + i + '--' + j,
							cover: 'https://res.vmallres.com/pimages//product/6972453164742/78_78_DA3EC111518BD3850225AFD2CA0127B75C37A020458A3864mp.png',
							crate_time: '2019-07-17 18:34:14',
							category: "手机",
							type: "普通商品",
							sale_count: 20,
							order: 100,
							status: 1,
							stock: 200,
							pprice: 1000,
							ischeck: 1,
							// 0未审核 1通过 2不通过	
						})
					}
				}
			},
			// 删除当前商品
			deleteItem(index) {
				this.$confirm('是否删除该商品', '提示', {
					confirmButtonText: '确定',
					cancleButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.tableData[this.tabIndex].list.splice(index, 1)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '删除取消'
					})
				})
			},
			// 加载数据
			handleClick(tab, event) {
				console.log(tab.index)
			},
			// 清空筛选条件
			clearSearch() {
				this.form = {
					code: "",
					type: "",
					time:"",
					username:"",
					phone:""
				}
				this.$refs.buttonSearch[this.tabIndex].closeSuperSearch()
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
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}
</script>

<style>
</style>
