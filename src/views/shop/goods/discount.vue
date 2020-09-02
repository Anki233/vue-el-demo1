<template>
	<div class="bg-white px-3 goods_create" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<router-link :to="{name:'shop_goods_list'}" style="position: absolute;top: 14px;left: 180px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		<div style="height: 10px;"></div>
		<el-form ref="form" label-width="80px">
			<el-form-item label="会员价">
				<el-input v-model="discount" style="width: 250px;">
					<template slot="append">%</template>
				</el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" style="position: absolute;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
	export default {
		inject: ['app','layout'],
		data() {
			return {
				discount:"",
				id:""
			}
		},
		created() {
			this.id = this.$route.params.id
			if(!this.id) {
				this.$message({
					message:'非法参数',
					type:'error'
				})
				return this.$router.push({
					name:"shop_goods_list"
				})
			}
			// 获取之前的商品详情
			this.layout.showLoading()
			this.axios.get('/admin/goods/read/'+this.id,{
				token:true
			}).then(res=>{
				console.log(res.data.data)
				let data = res.data.data
				this.discount = data.discount
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
		},
		methods: {
			submit() {
				this.layout.showLoading()
				this.axios.post('/admin/goods/'+this.id,{
					discount:this.discount
				},{ token: true}).then(res=>{
					this.$message({
						message:'修改成功',
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
		}
	}
</script>

<style>
	.goods_create .el-form-item {
		margin-bottom: 10px;
	}
</style>
