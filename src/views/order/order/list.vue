<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane :label="tab.name" :key="tabI" v-for="(tab,tabI) in tabbars">
			</el-tab-pane>
		</el-tabs>
		<buttonSearch ref="buttonSearch" placeholder="要搜索的订单编号" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<el-button type="success" size="mini" @click="exportModel = true">导出数据</el-button>
				<el-button type="danger" size="mini" @click="deleteAll">批量删除</el-button>
			</template>
			<!-- 高级搜索表单 -->
			<template #form>
				<!-- 表单 -->
				<el-form inline ref="form" :model="form" label-width="100px">
					<el-form-item label="订单编号" class="mb-0">
						<el-input size="mini" v-model="form.node" placeholder="要搜索的订单编号"></el-input>
					</el-form-item>
					<el-form-item label="下单时间" class="mb-0">
						<el-date-picker value-format="yyyy-MM-dd" class="mr-2" size="mini" v-model="form.time" type="daterange" align="right"
						 unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
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
		<el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center">
			</el-table-column>
			<el-table-column prop="title" label="商品信息" width="320">
				<template slot-scope="scope">
					<div class="d-flex">
						<div style="flex:1">
							<p class="mb-1">订单编号</p>
							<p class="mb-1">
								<small><strong>{{scope.row.no}}</strong></small>
							</p>
						</div>
						<div style="flex:1">
							<p class="mb-1">下单时间</p>
							<p class="mb-1">
								<small><strong>{{scope.row.create_time}}</strong></small>
							</p>
						</div>
					</div>
					<div class="media border-top py-2" v-for="(item,index) in scope.row.order_items" :key="index">
						<!-- <img class="mr-3" style="width: 60px;height: 60px;" :src="item.goods_item.cover"> -->
						<img class="mr-3" style="width: 60px;height: 60px;" src="https://res.vmallres.com/pimages//product/6972453164742/78_78_DA3EC111518BD3850225AFD2CA0127B75C37A020458A3864mp.png">
						<div class="media-body">
							<p><a class="text-primary">荣耀 X10 Max 5G全网通 标配版 6GB+64GB 竞速蓝</a></p>
							<!-- <p><a class="text-primary">{{item.goods_item.title}}</a></p> -->
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="实付款" align="center" width="150">
				<template slot-scope="scope">
					<span>{{scope.row.total_price}}</span>
					<p><small>(含运费：￥0.00)</small></p>
				</template>
			</el-table-column>
			<el-table-column label="买家" align="center" width="150">
				<template slot-scope="scope">
					<span>{{scope.row.user.username}}</span>
					<p><small>(用户名id：{{scope.row.user.id}})</small></p>
				</template>
			</el-table-column>
			<el-table-column label="支付方式" align="center">
				<template slot-scope="scope">
					<span class="badge badge-success" v-if="scope.row.payment_method === 'wechat'">微信支付</span>
					<span class="badge badge-primary" v-else-if="scope.row.payment_method === 'alipay'">支付宝支付</span>
					<span class="badge badge-secondary" v-else>未支付</span>
				</template>
			</el-table-column>
			<el-table-column label="配送方式" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.ship_data">
						<p>{{scope.row.ship_data.express_company}}</p>
						<p>{{scope.row.ship_data.express_no}}</p>
					</div>
					<div v-else><span class="badge badge-secondary">未配送</span></div>
				</template>
			</el-table-column>
			<el-table-column label="交易状态" align="center">
				<template slot-scope="scope">
					<div>付款方式：<span class="badge" :class="scope.row.payment_method ? 'badge-success' : 'badge-secondary' ">{{scope.row.payment_method ? '已付款' : '未付款'}}</span></div>
					<div>发货状态：<span class="badge" :class="scope.row.ship_data ? 'badge-success' : 'badge-secondary' ">{{scope.row.ship_data ? '已发货' : '未发货'}}</span></div>
					<div>收货状态：<span class="badge" :class="scope.row.ship_status === 'receview' ? 'badge-success' : 'badge-secondary' ">{{scope.row.ship_status === 'receview' ? '已收货' : '未收货'}}</span></div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini">订单详情</el-button>
					<el-button type="text" size="mini" v-if="scope.row.ship_status === 'pending' && scope.row.closed === 0 && scope.row.payment_method && scope.row.refund_status === 'pending'"
					 @click="ship(scope.row)">订单发货</el-button>
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
		<el-dialog title="订单发货" :visible.sync="shipModel">
			<el-form :model="shipForm" ref="ruleForm">
				<el-form-item label="快递公司" prop="express_company">
					<el-select v-model="shipForm.express_company" placeholder="请选择" size="mini">
						<el-option v-for="(item,index) in express_company_options" :key="index" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号" prop="express_no">
					<el-input class="w-50" size="mini" type="text" v-model="shipForm.express_no"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="shipModel = false">取 消</el-button>
				<el-button type="primary" @click="shipSubmit">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="导出数据" :visible.sync="exportModel" width="40%">
			<el-form :model="exportForm" ref="ruleForm">
				<el-form-item label="订单类型" prop="express_company">
					<el-select v-model="exportForm.tab" placeholder="请选择" size="mini">
						<el-option v-for="(item,index) in tabbars" :key="index" :label="item.name" :value="item.key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间范围">
					<el-date-picker value-format="yyyy-MM-dd" class="mr-2" size="mini" v-model="exportForm.time" type="daterange"
					 align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="exportModel = false">取 消</el-button>
				<el-button type="primary" @click="exportExcel">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import buttonSearch from "@/components/common/button-search.vue"
	import common from '@/common/mixins/common.js'

	export default {
		mixins: [common],
		inject: ['layout'],
		components: {
			buttonSearch
		},
		data() {
			return {
				preUrl: "order",
				tabIndex: 0,
				tabbars: [{
						name: "全部",
						key: "all"
					},
					{
						name: "待付款",
						key: "nopay"
					},
					{
						name: "代发货",
						key: "noship"
					},
					{
						name: "已发货",
						key: "shiped"
					},
					{
						name: "已收货",
						key: "recevied"
					},
					{
						name: "已完成",
						key: "finish"
					},
					{
						name: "已关闭",
						key: "closed"
					},
					{
						name: "退款中",
						key: "refunding"
					}
				],
				form: {
					node: "",
					time: "",
					name: "",
					phone: ""
				},
				tableData: [],
				shipModel: false,
				shipForm: {
					express_company: "",
					express_no: ""
				},
				shipId: 0,
				exportModel: false,
				exportForm: {
					tab: "",
					time: ""
				},
				express_company_options: [],
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
		computed: {
			tab() {
				return this.tabbars[this.tabIndex].key
			},
			getParams() {
				let str = ''
				for (let key in this.form) {
					let val = this.form[key]
					if (val) {
						if (Array.isArray(this.form[key])) {
							str += `&starttime=${val[0]}`
							str += `&endtime=${val[1]}`
						} else {
							str += `&${key}=${val}`
						}
					}
				}
				return str
			}
		},
		created() {
			this.axios.get('/admin/express_company/1?limit=50', {
				token: true,
			}).then(res => {
				let data = res.data.data
				this.express_company_options = data.list
			}).catch(err => {})
		},
		methods: {
			// 导出数据
			exportExcel() {
				this.layout.showLoading()
				if (!this.exportForm.tab) {
					return this.$message({
						message: '订单类型不能为空',
						type: 'error'
					})
				}
				let url = `/admin/order/excelexport?tab=${this.exportForm.tab}`
				let params = ''
				let val = this.exportForm.time
				if (val && Array.isArray(val)) {
					params += `&starttime=${val[0]}`
					params += `&endtime=${val[1]}`
				}
				this.axios.post(url + params, {}, {
					token: true,
					responseType: 'blob' 
				}).then(res => {
					if (res.status == 200) {
						let url = window.URL.createObjectURL(new Blob([res.data]))
						let link = document.createElement('a')
						link.style.display = 'none'
						link.href = url
						let filename = new Date().getTime() + '.xlsx';
						link.setAttribute('download', filename)
						document.body.appendChild(link)
						link.click()
					}
					this.exportModel = false
					this.layout.hideLoading()
				}).catch(err => {
					this.$message({
						type: "error",
						message: "下载失败"
					})
					this.layout.hideLoading()
				})
			},
			getListUrl() {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.getParams}`
			},
			getListResult(e) {
				this.tableData = e.list
			},
			// 加载数据
			handleClick(tab, event) {
				this.getList()
			},
			// 清空筛选条件
			clearSearch() {
				this.form = {
					node: "",
					time: "",
					name: "",
					phone: ""
				}
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'string') {
					this.form.node = e
					this.getList()
					return
				}
				// 高级搜索
				this.getList()
			},
			ship(item) {
				this.shipId = item.id
				this.shipModel = true
			},
			shipSubmit() {
				this.layout.showLoading()
				this.axios.post('/admin/order/' + this.shipId + '/ship', this.shipForm, {
					token: true
				}).then(res => {
					this.$message({
						message: '发货成功',
						type: 'success'
					})
					this.getList()
					this.shipModel = false
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			}
		}
	}
</script>

<style>
</style>
