<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="运费模板" name="first">
				<div>
					<el-button type="primary" size="mini">添加模板</el-button>
				</div>
				<el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column prop="name" align="center" label="模板名称" width="180">
					</el-table-column>
					<el-table-column label="计费方式" align="center">
						<template slot-scope="scope">
							{{scope.row.type | formatType}}
						</template>
					</el-table-column>
					<el-table-column prop="order" align="center" label="排序" width="180">
					</el-table-column>
					<el-table-column prop="create_time" align="center" label="添加时间" width="180">
					</el-table-column>
					<el-table-column label="状态" align="center" width="180">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="180">
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="success" plain size="mini">修改</el-button>
								<el-button type="danger" plain size="mini">删除</el-button>
							</el-button-group>
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
	</div>
</template>
<script>
	export default {
		data() {
			return {
				tableData: [{
					name:"全国统一邮费",
					type:1,
					create_time:"2019-07-17 16:45:10",
					status:1,
					order:100
				}],
				activeName: 'first',
				form: {
					customer: "",
					key: ""
				}
			};
		},
		filters:{
			formatType(value) {
				let arr = ['按重量','按件数']
				return arr[value]
			}
		},
		methods: {
			handleClick(tab, event) {

			}
		}
	};
</script>
