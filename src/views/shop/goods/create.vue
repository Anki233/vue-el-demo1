<template>
	<div class="bg-white px-3 goods_create" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 14px;left: 180px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		<div style="height: 10px;"></div>
		<el-form ref="form" label-width="100px">
			<el-form-item label="商品名称">
				<el-input v-model="form.title" class="w-50" placeholder="请输入商品名称,不能超过60个字符"></el-input>
			</el-form-item>
			<el-form-item label="封面">
				<div>
					<span v-if="!form.cover" class="btn btn-light border mr-2" @click="chooseImage">
						<i class="el-icon-plus"></i>
					</span>
					<img v-else :src="form.cover" class="rounded" style="width: 45px;height: 45px;cursor: pointer;" @click="chooseImage" />
				</div>
			</el-form-item>
			<el-form-item label="商品分类">
				<el-select v-model="form.category_id" placeholder="请选择商品分类">
				    <el-option v-for="(item,index) in cates" :key="index" 
						:label="item | tree" :value="item.id">
					</el-option>
				  </el-select>
			</el-form-item>
			<el-form-item label="商品描述">
				<el-input type="textarea" class="w-50" v-model="form.desc" :rows="5" 
					placeholder="选填,商品卖点简述,例如:此款商品美观大方 性价比较高 不容错过">
				</el-input>
			</el-form-item>
			<el-form-item label="商品单位">
				<el-input v-model="form.unit" style="width: 200px;" placeholder="请输入商品单位"></el-input>
			</el-form-item>
			<el-form-item label="总库存">
				<el-input type="number" v-model="form.stock" style="width: 165px;">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存预警">
				<el-input type="number" v-model="form.min_stock" style="width: 165px;">
					<template slot="append">件</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低销售价">
				<el-input type="number" v-model="form.min_price" style="width: 165px;">
					<template slot="append">元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="最低原价">
				<el-input type="number" v-model="form.min_oprice" style="width: 165px;">
					<template slot="append">元</template>
				</el-input>
			</el-form-item>
			<el-form-item label="库存显示">
				<el-radio-group v-model="form.stock_display">
					<el-radio :label="1" border size="medium">是</el-radio>
					<el-radio :label="0" border size="medium">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否上架">
				<el-radio-group v-model="form.status">
					<el-radio :label="0" border size="medium">放入仓库</el-radio>
					<el-radio :label="1" border size="medium">立即上架</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="运费模板">
				<el-select v-model="form.express_id" placeholder="请选择运费模板">
					<el-option v-for="(item,index) in express" :key="index" 
						:label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" 
			@click="submit">提交</el-button>
	</div>
</template>

<script>
	export default {
		inject: ['app','layout'],
		data() {
			return {
				cates:[],
				express:[],
				form:{
					title:"",
					category_id:"",
					cover:"",
					desc:"",
					unit:"",
					stock:"",
					min_stock:"",
					ischeck:0,
					status:0,
					stock_display:0,
					express_id:"",
					min_price:"",
					min_oprice:""
				},
				id:0
			}
		},
		created() {
			// 获取id
			this.id = this.$route.params.id
			if(this.id) {
				// 获取之前的商品详情
				this.layout.showLoading()
				this.axios.get('/admin/goods/read/'+this.id,{
					token:true
				}).then(res=>{
					let data = res.data.data
					this.form = data
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			}
			this.axios.get('/admin/goods/create',{
				token:true
			}).then(res=>{
				let data = res.data.data
				this.cates = data.cates
				this.express = data.express.list
				console.log(res.data.data)
			}).catch(err=>{
				
			})
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
			submit() {
				this.layout.showLoading()
				let url = this.id ? '/admin/goods/'+this.id : '/admin/goods'
				this.axios.post(url,this.form,{
					token:true
				}).then(res=>{
					this.$message({
						message:this.id ? '修改成功' : '发布成功',
						type:'success'
					})
					this.layout.hideLoading()
					this.$router.push({
						name:"shop_goods_list"
					})
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			},
			chooseImage() {
				this.app.chooseImage((res) => {
					this.form.cover = res[0].url
				}, 1)
			}
		}
	}
</script>

<style>
</style>
