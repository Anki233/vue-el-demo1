<template>
	<table class="table table-sm table-bordered">
		<thead>
			<tr>
				<th v-for="(th,thi) in tableThs" :key="thi" scope="col" 
					class="text-center align-middle" :rowspan="th.rowspan" 
					:colspan="th.colspan">
					{{th.name}}
				</th>
			</tr>
			<tr>
				<th v-for="(th,thi) in skuLabels" :ley="thi" 
					scope="col" class="text-center" rowspan="1" colspan="1">
					{{th.name}}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item,index) in list" :key="index">
				<!-- 商品规格 -->
				<th scope="row"  class="text-center" v-for="(sku,skuI) in item.skus" :key="skuI">{{sku.value}}</th>
				<td class="text-center" width="120">
					<span v-if="!item.image" class="btn btn-light border mr-2" @click="chooseImage(item)">
						<i class="el-icon-plus"></i>
					</span>
					<img v-else :src="item.image" class="rounded" 
						style="width: 45px;height: 45px;cursor: pointer;"
						 @click="chooseImage(item)"/>
				</td>
				<td class="text-center" width="120">
					<input type="number" class="form-control text-center"
						v-model="item.pprice"/>
				</td>
				<td class="text-center" width="120">
					<input type="number" class="form-control text-center"
						v-model="item.oprice"/>
				</td>
				<td class="text-center" width="120">
					<input type="number" class="form-control text-center"
						v-model="item.cprice"/>
				</td>
				<td class="text-center" width="120">
					<input type="number" class="form-control text-center"
						v-model="item.stock"/>
				</td>
				<td class="text-center" width="120">
					<input type="number" class="form-control text-center"
						v-model="item.volume"/>
				</td>
				<td class="text-center" width="120">
					<input type="number" class="form-control text-center"
						v-model="item.weight"/>
				</td>
				<td class="text-center" width="120">
					<input type="text" class="form-control text-center"
						v-model="item.code"/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import {mapGetters,mapState} from 'vuex'
	export default {
		inject:['app'],
		data() {
			return {
				list: []
			}
		},
		computed:{
			...mapGetters(['tableThs','tableData','skuLabels']),
			...mapState({
				'sku_card':state=>state.goods_create.sku_card
			})
		},
		watch:{
			tableData(newValue,oldValue) {
				this.list = newValue
			}
		},
		mounted(){
			this.list = this.tableData
		},
		methods:{
			// 选择图片
			chooseImage(obj) {
				this.app.chooseImage((res)=>{
					obj.image = res[0].url
				},1)
			}
		}
	}
</script>

<style>
</style>
