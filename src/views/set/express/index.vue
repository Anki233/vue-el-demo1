<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="运费模板" name="first">
				<div>
					<el-button type="primary" size="mini" @click="openModel(false)">添加模板</el-button>
				</div>
				<el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column prop="name" align="center" label="模板名称">
					</el-table-column>
					<el-table-column label="计费方式" align="center">
						<template slot-scope="scope">
							{{scope.row.type | formatType}}
						</template>
					</el-table-column>
					<el-table-column prop="order" align="center" label="排序">
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="openModel(scope.$index)">修改</el-button>
							<el-button type="text" size="mini" @click="openDrawer(scope.row)">配置模板({{scope.row.express_values.length}})</el-button>
							<el-button type="text" size="mini" @click="deleteItem(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="物流跟踪" name="second">
				<el-form ref="form" v-model="form" label-width="80px">
					<el-form-item label="快递100 Customer" label-width="150px">
						<el-input size="mini" style="width: 50%;" v-model="form.customer"></el-input>
						<p class="mb-0" style="font-size: 12px;">
							用于查询物流信息，<a href="#">快递100申请</a>
						</p>
					</el-form-item>
					<el-form-item label="密钥" label-width="150px">
						<el-input size="mini" style="width: 50%;" v-model="form.key"></el-input>
					</el-form-item>
					<el-form-item label-width="150px">
						<el-button type="primary" size="mini">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<div style="height: 65px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 position-fixed bg-white" style="bottom: 0;left: 200px;right: 0;z-index: 100;">
			<div style="flex:1" class="px-2">
				<el-pagination :current-page="page.current" :page-sizes="page.sizes" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper"
				 :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
				</el-pagination>
			</div>
		</el-footer>
		<!-- 新增/修改模态框 -->
		<el-dialog title="添加模板" :visible.sync="createModel" width="40%" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="model" label-width="80px">
				<el-form-item label="模板名称" prop="name">
					<el-input v-model="model.name" size="mini" style="width: 25%;"></el-input>
				</el-form-item>
				<el-form-item label="等级权重" prop="level">
					<el-input-number v-model="model.order" size="mini" style="width: 25%;"></el-input-number>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="model.type" size="mini">
						<el-radio :label="1" border>按重量</el-radio>
						<el-radio :label="0" border>按件数</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
		<el-drawer :visible.sync="drawer" size="70%" direction="rtl">
		  <div class="p-1">
			  <el-table border class="mt-3" :data="express_values" style="width: 100%">
			  	<el-table-column prop="id" align="center" label="ID">
			  	</el-table-column>
				<el-table-column align="center" label="可配送区域" width="220">
					<template slot-scope="scope">
						<el-cascader v-model="scope.row.region" @change="change(scope.row)" size="mini" :options="options" :props="props" collapse-tags clearable></el-cascader>
					</template>
			  	</el-table-column>
			  	<el-table-column label="首件(个)/首重(Kg)" align="center" width="150">
			  		<template slot-scope="scope">
						<el-input @change="change(scope.row)" size="mini" v-model="scope.row.first"></el-input>
			  		</template>
			  	</el-table-column>
				<el-table-column label="运费(元)" align="center" width="150">
					<template slot-scope="scope">
						<el-input @change="change(scope.row)" size="mini" v-model="scope.row.first_price"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="续件/续重" align="center" width="150">
					<template slot-scope="scope">
						<el-input @change="change(scope.row)" size="mini" v-model="scope.row.add"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="续费(元)" align="center" width="150">
					<template slot-scope="scope">
						<el-input @change="change(scope.row)" size="mini" v-model="scope.row.add_price"></el-input>
					</template>
				</el-table-column>
			  	<el-table-column label="操作" align="center">
			  		<template slot-scope="scope">
			  			<el-button type="text" size="mini" @click="deleteValue(scope.row,scope.$index)">删除</el-button>
			  		</template>
			  	</el-table-column>
			  </el-table>
			  <el-button type="primary" size="mini" class="mt-2 ml-2" @click="addValue">添加策略</el-button>
		  </div>
		</el-drawer>
	</div>
</template>
<script>
	import common from '@/common/mixins/common.js'
	
	export default {
		mixins:[common],
		inject:['layout'],
		data() {
			return {
				preUrl:"express",
				tableData: [],
				activeName: 'first',
				form: {
					customer: "",
					key: ""
				},
				drawer:false,
				drawerId:0,
				createModel: false,
				model: {
					name:"",
					order:50,
					type:0,
				},
				modelIndex:-1,
				express_values:[],
				props: { 
					multiple: true ,
					label:"name",
					value:"name"
				},
				options: []
			}
		},
		filters:{
			formatType(value) {
				let arr = ['按件数','按重量']
				return arr[value]
			}
		},
		methods: {
			getListResult(e) {
				console.log(e)
				this.tableData = e.list
				this.options = e.area.map(item=>{
					item.children = item.citys.map(v=>{
						v.children = v.districts
						return v
					})
					return item
				})
			},
			openModel(index) {
				// 新增
				if(index === false) {
					this.model = {
						name:"",
						order:50,
						type:0,
					}
					this.modelIndex = -1
					return this.createModel = true
				}
				// 修改
				let item = this.tableData[index]
				this.model = {
					name:item.name,
					order:item.order,
					type:item.type,
				}
				this.createModel = true
			},
			submit() {
				let id = 0
				if(this.modelIndex !== -1) {
					id = this.tableData[this.modelIndex].id
				}
				this.addOrEdit(this.model,id)
				this.createModel = false
				this.getList()
			},
			openDrawer(item) {
				this.express_values = item.express_values
				this.drawer =true
				this.drawerId = item.id
			},
			addValue() {
				this.axios.post('/admin/express_value',{
					first:0,
					first_price:0,
					add:0,
					add_price:0,
					express_id:this.drawerId,
					region:[
						['全国','所有','所有']
					]
				},{
					token:true
				}).then(res=>{
					let data =res.data.data
					this.express_values.push(data)
				})
			},
			deleteValue(item,index) {
				this.axios.post('/admin/express_value/'+item.id+'/delete',{},{
					token:true
				}).then(res=>{
					this.express_values.splice(index,1)
					this.$message({
						message:'删除成功',
						type:'success'
					})
				})
			},
			change(item) {
				this.axios.post('/admin/express_value/'+item.id,item,{
					token:true
				}).then(res=>{})
			},
		}
	};
</script>
