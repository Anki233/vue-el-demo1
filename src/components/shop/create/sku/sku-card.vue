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
			<el-button type="text" size="mini" @click="delSkuCard(index)">删除</el-button>
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
					size="mini" icon="el-icon-plus" @click="addSkuValue(index)">
					增加规格值
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import skuCardChildren from './sku-card-children.vue';
	
	import {mapState,mapMutations} from "vuex"
	export default {
		inject:['app'],
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
				}
		    })
		},
		methods:{
			...mapMutations(['delSkuCard','vModelSkuCard','sortSkuCard','addSkuValue','sortSkuValue']),
			vModel(key,index,value){
				this.vModelSkuCard({key,index,value})
			},
			// 排序规格卡片
			sortCard(action,index){
				this.sortSkuCard({action,index})
			},
			// 选择规格
			chooseSkus(){
				this.app.chooseSkus((res)=>{
					this.vModel('name',this.index,res.name)
					this.vModel('type',this.index,res.type)
					this.vModel('list',this.index,res.list)
					this.list = res.list
				})
			}
		}
	}
</script>

<style>
</style>
