<template>
	<div class="card mb-2" style="line-height: 1.2;">
		<div class="card-header d-flex align-items-center">
			规格项：
			<el-input @input="vModel('name',index,$event)" size="mini" style="width: 200px;" :value="item.name">
				<el-button slot="append" 
					icon="el-icon-more" @click="chooseSkus"></el-button>
			</el-input>
			<el-radio-group
				@input="vModel('type',index,$event)" :value="item.type" 
				size="mini" class="ml-2" style="margin-bottom: -10px;">
				<el-radio :label="0">无</el-radio>
				<el-radio :label="1">颜色</el-radio>
				<el-radio :label="2">图片</el-radio>
			</el-radio-group>
			<!-- 上移 -->
			<el-button @click="sortCard('moveUp',index)" :disabled="index === 0" class="ml-auto" icon="el-icon-top" size="mini"></el-button>
			<!-- 下移 -->
			<el-button @click="sortCard('moveDown',index)" :disabled="(index+1) === total" icon="el-icon-bottom" size="mini"></el-button>
			<!-- 删除 -->
			<el-button type="text" size="mini" @click="delSkuCardEvent">删除</el-button>
		</div>
		<div class="card-body">
			<!-- 规格属性列表 -->
			<div class="d-flex align-items-center flex-wrap">
				<skuCardChildren :type="item.type" v-for="(item2,index2) in list"
					:key="index2" :item="item2" :index="index2" :cardIndex="index"
					v-dragging="{ item: item2, list: list, group: `skuItem${index}` }">
				</skuCardChildren>
			</div>
			<!-- 增加规格属性 -->
			<div class="mt-2">
				<el-button style="font-weight: 600;" type="text" 
					size="mini" icon="el-icon-plus" @click="addSkuValueEvent">
					增加规格值
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import skuCardChildren from './sku-card-children.vue';
	import {mapState,mapMutations} from "vuex"
	
	let defaultVal = ['属性值','#FFFFFF','/favicon.co']
	export default {
		inject:['app','layout'],
		components:{
			skuCardChildren
		},
		props:{
			item:Object,
			index:Number,
			total:Number
		},
		data() {
			return {
				list: this.item.list
			}
		},
		mounted () {
			this.$watch('item.list',(newValue,oldValue)=>{
				this.list = newValue
			})
			// 监听拖拽结束
		    this.$dragging.$on('dragend', (e) => {
				if(e.group === 'skuItem' + this.index) {
					this.sortSkuValue({
						index:this.index,
						value:this.list
					})
					this.axios.post('/admin/goods_skus_card_value/sort',{
						sortdata:this.list.map((item,index)=>{
							return {
								id:item.id,
								order:index+1
							}
						})
					},{token:true})
				}
		    })
		},
		computed:{
			...mapState({
				sku_card: state => state.goods_create.sku_card,
			}),
		},
		methods:{
			...mapMutations(['delSkuCard','vModelSkuCard','sortSkuCard','addSkuValue','sortSkuValue']),
			addSkuValueEvent(value = false) {
				this.layout.showLoading()
				this.axios.post('/admin/goods_skus_card_value',{
					goods_skus_card_id:this.item.id,
					name:this.item.name,
					order:50,
					value:typeof value === 'string' ? value : defaultVal[this.item.type]
				},{
					token:true
				}).then(res=>{
					let data = res.data.data
					data.text = this.item.type === 0 ? data.value : defaultVal[0]
					data.image = this.item.type === 2 ? data.value : defaultVal[2]
					data.color = this.item.type === 1 ? data.value : defaultVal[1]
					this.addSkuValue({
						index:this.index,
						data
					})
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			},
			delSkuCardEvent() {
				this.layout.showLoading()
				this.axios.post('/admin/goods_skus_card/'+this.item.id+'/delete',{},{
					token:true
				}).then(res=>{
					let data = res.data.data
					this.delSkuCard(this.index)
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			},
			updateSkuCard() {
				this.axios.post('/admin/goods_skus_card/'+this.item.id,this.item,{token:true})
			},
			vModel(key,index,value){
				this.vModelSkuCard({key,index,value})
				this.updateSkuCard()
			},
			// 排序规格卡片
			sortCard(action,index){
				this.sortSkuCard({action,index})
				this.axios.post('/admin/goods_skus_card/sort',{
					sortdata:this.sku_card.map((item,index)=>{
						return {
							id:item.id,
							order:index+1
						}
					})
				},{
					token:true
				})
			},
			// 选择规格
			chooseSkus(){
				this.app.chooseSkus((res)=>{
					this.vModel('name',this.index,res.name)
					this.vModel('type',this.index,res.type)
					// this.vModel('list',this.index,res.list)
					// this.list = res.list
					res.list.forEach(item=>{
						this.addSkuValueEvent(item.name)
					})
				})
			}
		}
	}
</script>

<style>
</style>
