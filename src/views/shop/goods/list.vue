<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="tabIndex" @tab-click="getList">
			<el-tab-pane :label="tab.name" :key="tabI" v-for="(tab,tabI) in tabbars">
			</el-tab-pane>
		</el-tabs>
		<buttonSearch ref="buttonSearch" placeholder="要搜索的商品名称" @search="searchEvent">
			<!-- 左边 -->
			<template #left>
				<router-link :to="{name:'shop_goods_create'}" class="mr-2">
					<el-button type="success" size="mini">发布商品</el-button>
				</router-link>
				<el-button v-if="tab === 'delete'" type="warning" size="mini" @click="doEvent('restore')">恢复商品</el-button>
				<el-button v-if="tab === 'delete'" type="danger" size="mini" @click="doEvent('destroy')">彻底删除</el-button>
				<el-button v-if="tab != 'delete'" type="danger" size="mini" @click="deleteAll">批量删除</el-button>
				<el-button v-if="tab === 'all' || tab === 'off'" size="mini" @click="changeSa(1)">上架</el-button>
				<el-button v-if="tab === 'all' || tab === 'saling'" size="mini" @click="changeSa(0)">下架</el-button>
			</template>
			<!-- 高级搜索表单 -->
			<template #form>
				<!-- 表单 -->
				<el-form inline ref="form" :model="form" label-width="100px">
					<el-form-item label="商品名称" class="mb-0">
						<el-input size="mini" v-model="form.title" placeholder="商品名称"></el-input>
					</el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-select v-model="form.category_id" size="mini" placeholder="请选择商品分类">
							<el-option v-for="(item,index) in categoryOP" :key="index" :label="item | tree" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间" class="mb-0">
						<el-date-picker value-format="yyyy-MM-dd" class="mr-2" size="mini" v-model="form.time" type="daterange" align="right"
						 unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
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
		<el-table border class="mt-3" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="45" align="center">
			</el-table-column>
			<el-table-column prop="title" label="商品" width="320">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" style="width: 60px;height: 60px;" :src="scope.row.cover">
						<div class="media-body">
							<h6 class="mt-0 mb-0">{{scope.row.title}}</h6>
							<p class="mb-0">分类：{{scope.row.category.name}}</p>
							<p class="mb-0">时间：{{scope.row.create_time}}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="sale_count" label="实际销量" align="center" width="70">
			</el-table-column>
			<el-table-column label="实际销量" align="center" width="80">
				<template slot-scope="scope">
					<span class="badge" :class="scope.row.status ? 'badge-success' : 'badge-danger'">
						{{scope.row.status ? '上架' : '仓库'}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="审核状态" align="center" width="120">
				<template slot-scope="scope">
					<div class="d-flex flex-column" v-if="!scope.row.ischeck">
						<el-button type="success" size="mini" plain
							@click="checkGoods(scope.row,1)">
							审核通过
						</el-button>
						<el-button class="ml-0 mt-1" type="danger" size="mini" plain
							@click="checkGoods(scope.row,2)">
							审核拒绝
						</el-button>
					</div>
					<span v-else>{{scope.row.ischeck === 1 ? '通过' : '拒绝'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="总库存" align="center" width="90">
			</el-table-column>
			<el-table-column prop="pprice" label="价格(元)" align="center" width="150">
				<template slot-scope="scope">
					<span class="text-danger">￥{{scope.row.min_price}}</span>
					<span>/</span>
					<span class="text-muted">￥{{scope.row.min_oprice}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini" @click="navigate('shop_goods_create',scope.row.id)">基础设置</el-button>
					<el-button type="text" :class="(scope.row.sku_type == 0 && !scope.row.sku_value) || (scope.row.sku_type == 1 && !scope.row.goods_skus.length) ? 'text-danger' : ''"
						size="mini" @click="navigate('shop_goods_sku',scope.row.id)">
						商品规格
					</el-button>
					<el-button type="text" @click="navigate('shop_goods_attr',scope.row.id)"
						size="mini" :class="scope.row.goods_attrs.length == 0 ? 'text-danger' : ''">
						商品属性
					</el-button>
					<el-button type="text" :class="scope.row.goods_banner.length == 0 ? 'text-danger' : ''" 
						size="mini" @click="navigate('shop_goods_banner',scope.row.id)">
						媒体设置
					</el-button>
					<el-button type="text" :class="!scope.row.content? 'text-danger' : ''" 
						size="mini" @click="navigate('shop_goods_content',scope.row.id)">
						商品详情{{!scope.row.content ? '(no)' : ''}}
					</el-button>
					<el-button type="text" size="mini" @click="navigate('shop_goods_discount',scope.row.id)">折扣设置</el-button>
					<el-button type="text" size="mini" @click="deleteItem(scope.row)">删除商品</el-button>
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
				preUrl:"goods",
				tabIndex: 0,
				tabbars: [
					{
						name:"全部",
						key:"all"
					},
					{
						name: "审核中",
						key:"checking"
					},
					{
						name: "出售中",
						key:"saling"
					},
					{
						name: "已下架",
						key:"off"
					},
					{
						name: "库存预警",
						key:"min_stock"
					},
					{
						name: "回收站",
						key:"delete"
					}
				],
				form: {
					title: "",
					time:"",
					category_id: ""
				},
				tableData: [],
				categoryOP:[],
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
		computed:{
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
		filters: {
			tree(item) {
				if(item.level == 0) {
					return item.name
				}
				let str = ''
				for(let i = 0;i < item.level;i++) {
					str += i == 0 ? '|--' : '--'
				}
				return str + item.name
			}
		},
		methods: {
			getListUrl() {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.getParams}`
			},
			getListResult(e) {
				this.categoryOP = e.cates
				this.tableData = e.list
			},
			// 清空筛选条件
			clearSearch() {
				this.form = {
					title: "",
					time:"",
					category_id: ""
				}
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'string') {
					this.form.title = e
					this.getList()
					return
				}
				// 高级搜索
				this.getList()
			},
			doEvent(key) {
				this.showLoading()
				this.axios.post('/admin/goods/'+key,{
					ids:this.ids
				},{
					token:true
				}).then(res=>{
					this.$message({
						message:'操作成功',
						type:'success'
					})
					this.getList()
					this.hideLoading()
				}).catch(err=>{
					this.hideLoading()
				})
			},
			// 上下架
			changeSa(num) {
				if(this.ids.length === 0) {
					return this.$message({
						message:'请选择要操作的商品',
						type:'error'
					})
				}
				this.showLoading()
				this.axios.post('/admin/goods/changestatus',{
					ids:this.ids,
					status:num
				},{
					token:true
				}).then(res=>{
					this.$message({
						message:'操作成功',
						type:'success'
					})
					this.getList()
					this.hideLoading()
				}).catch(err=>{
					this.hideLoading()
				})
			},
			navigate(name,id) {
				this.$router.push({
					name,
					params:{id}
				})
			},
			checkGoods(item,ischeck) {
				this.layout.showLoading()
				this.axios.post('/admin/goods/'+item.id+'/check',{
					ischeck
				},{
					token:true
				}).then(res=>{
					this.getList()
					this.$message({
						message:'操作成功',
						type:'success'
					})
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			}
		}
	}
</script>

<style>
</style>
