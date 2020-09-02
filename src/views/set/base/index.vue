<template>
	<div class="bg-white px-3" style="margin: -20px; margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="注册与访问" name="first">
				<el-form ref="form" v-model="form" label-width="80px">
					<el-form-item label="是否允许注册会员" label-width="150px">
						<el-radio-group v-model="form.open_reg" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型" label-width="150px">
						<el-radio-group v-model="form.reg_method" size="mini">
							<el-radio-button label="username">普通注册</el-radio-button>
							<el-radio-button label="phone">手机注册</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码最小长度" label-width="150px">
						<el-input size="mini" style="width: 25%;" v-model="form.password_min"></el-input>
					</el-form-item>
					<el-form-item label="强制密码复杂度" label-width="150px">
						<el-checkbox-group v-model="form.password_encrypt" size="mini">
							<el-checkbox-button label="0">数字</el-checkbox-button>
							<el-checkbox-button label="1">小写字母</el-checkbox-button>
							<el-checkbox-button label="2">大写字母</el-checkbox-button>
							<el-checkbox-button label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="上传设置" name="second">
				<el-form ref="form" v-model="form" label-width="80px">
					<el-form-item label="默认上传方式" label-width="150px">
						<el-radio-group v-model="form.upload_method" size="mini">
							<el-radio-button label="local">本地存储</el-radio-button>
							<el-radio-button label="oss">阿里云存储</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<template v-if="form.upload_method === 'oss'">
						<el-form-item label="Bucket" label-width="150px">
							<el-input size="mini" style="width: 25%;" v-model="form.upload_config.Bucket"></el-input>
						</el-form-item>
						<el-form-item label="ACCESS_KEY" label-width="150px">
							<el-input size="mini" style="width: 50%;" v-model="form.upload_config.ACCESS_KEY"></el-input>
						</el-form-item>
						<el-form-item label="SECRET_KEY" label-width="150px">
							<el-input size="mini" style="width: 50%;" v-model="form.upload_config.SECRET_KEY"></el-input>
						</el-form-item>
						<el-form-item class="mb-0" label="空间域名" label-width="150px">
							<el-input size="mini" style="width: 25%;" v-model="form.upload_config.http"></el-input>
							<small class="text-secondary d-block">请补全http://或https://</small>
						</el-form-item>
					</template>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="Api安全" name="third">
				<el-form ref="form" v-model="form" label-width="80px">
					<el-form-item class="mb-0" label="是否开启API安全" label-width="150px">
						<el-radio-group v-model="form.api_safe" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
						<p class="mb-0" style="font-size: 12px;">
							api安全功能开启之后调用前端api需要传输签名串
						</p>
					</el-form-item>
					<el-form-item label="密钥" label-width="150px">
						<el-input size="mini" style="width: 50%;" v-model="form.api_secret"></el-input>
						<p class="mb-0" style="font-size: 12px;">
							密钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，
							请慎重设置，注意设置之后对应会员要求重新登录获取token
						</p>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<el-form>
			<el-form-item label-width="150px">
				<el-button type="primary" size="mini" @click="submit">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	export default {
		inject:['layout'],
		data() {
			return {
				activeName: 'first',
				form: {
					open_reg: 1,
					reg_method: "普通注册",
					password_min: 5,
					password_encrypt: ["0"],
					upload_method:"local",
					upload_config:{
						Bucket:"",
						ACCESS_KEY:"",
						SECRET_KEY:"",
						http:""
					},
					api_safe:0,
					api_secret:""
				}
			};
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				this.layout.showLoading()
				this.axios.get('/admin/sysconfig',{
					token:true
				}).then(res=>{
					this.form = res.data.data
					this.form.password_encrypt = this.form.password_encrypt.split(',')
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			},
			submit() {
				this.layout.showLoading()
				this.form.password_encrypt = this.form.password_encrypt.join(',')
				this.axios.post('/admin/sysconfig',this.form,{
					token:true
				}).then(res=>{
					this.$message({
						message:'修改成功',
						type:'success'
					})
					this.getData()
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			}
		}
	};
</script>
