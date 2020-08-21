<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="支付设置" name="first">
				<el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column align="left" label="支付方式">
						<template slot-scope="scope">
							<div class="d-flex align-items-center">
								<img :src="scope.row.src" class="rounded mr-2" style="width: 40px;height: 40px;">
								<div class="d-flex flex-column" style="align-items: flex-start;">
									<h6>{{scope.row.name}}</h6>
									<small class="d-block text-secondary">{{scope.row.desc}}</small>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="250">
						<template slot-scope="scope">
							<el-button type="text" plain size="mini">配置</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="购物设置" name="second">
				<el-form ref="form" label-width="80px">
					<el-form-item label="未支付订单" label-width="180px">
						<el-input type="number" size="mini" style="width: 250px;">
							<template slot="append">天后自动关闭</template>
						</el-input>
						<p class="mb-0" style="font-size: 12px;">
							订单下单未付款，n天后自动关闭，设置0天不自动关闭
						</p>
					</el-form-item>
					<el-form-item label="已发货订单" label-width="180px">
						<el-input type="number" size="mini" style="width: 250px;">
							<template slot="append">天后自动确认收货</template>
						</el-input>
						<p class="mb-0" style="font-size: 12px;">
							如果在期间未确认收货，系统自动完成收货，设置0天不自动收货
						</p>
					</el-form-item>
					<el-form-item label="已完成订单" label-width="180px">
						<el-input type="number" size="mini" style="width: 250px;">
							<template slot="append">天内允许申请售后</template>
						</el-input>
						<p class="mb-0" style="font-size: 12px;">
							订单完成后，用户在n天内可以发起售后申请，设置0天不允许申请售后
						</p>
					</el-form-item>
					<el-form-item label="运费组合策略" label-width="180px">
						<el-select v-model="value" placeholder="请选择运费组合策略" size="mini">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
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
					name: "银联卡支付",
					desc: "该系统支持即时到账接口",
					src: "http://wxcs.niuteam.cn/addons/NsUnionPay/ico.png"
				}, {
					name: "支付宝支付",
					desc: "该系统支持即时到账接口",
					src: "http://wxcs.niuteam.cn/addons/NsAlipay/ico.png"
				}, {
					name: "微信支付",
					desc: "该系统支持微信网页支付和扫码支付",
					src: "http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png"
				}],
				activeName: 'first',
				options: [{
					value: '选项1',
					label: '运费一'
				}, {
					value: '选项2',
					label: '运费二'
				}],
				value: ''
			}
		}
	}
</script>
