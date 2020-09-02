<template>
	<el-dialog title="图片管理" :visible.sync="imageModel" width="80%" top="5vh">
		<el-container style="position: relative;height: 70vh;margin: -30px -20px;">
			<el-header class="d-flex align-items-center border-bottom">
				<!-- 头部 -->
				<div class="d-flex mr-auto">
					<el-select v-model="searchForm.order" class="mr-2" placeholder="请选择图片排序方式" size="mini" style="width: 160px;">
						<el-option label="降序" value="desc"></el-option>
						<el-option label="升序" value="asc"></el-option>
					</el-select>
					<el-input class="mr-2" v-model="searchForm.keyword" placeholder="输入图片名称" size="mini" style="width: 150px;"></el-input>
					<el-button type="success" size="mini" @click="getImageList">搜索</el-button>
				</div>
			</el-header>
			<el-container>
				<el-aside v-loading="asideLoading" width="200px" style="position: absolute;top: 60px;left: 0;bottom: 60px;" class="bg-white border-right">
					<!-- 侧边 | 相册列表-->
					<ul class="list-group list-group-flush">
						<albumItem v-for="(item,index) in albums" :key="index" :item="item" :index="index" :active="albumIndex === index"
						 @change="albumChange" :showOptions="false">
						</albumItem>
					</ul>
				</el-aside>
				<el-container>
					<el-main v-loading="mainLoading" style="position: absolute;top: 60px;left: 200px;bottom: 60px;right: 0;">
						<!-- 主内容 -->
						<el-row :gutter="10">
							<el-col :span="24" :lg="4" :md="6" :sm="8" v-for="(item,index) in imagesList" :key="index">
								<el-card class="box-card mb-3 position-relative" shadow="hover" :body-style="{'padding':'0'}" style="cursor: pointer;">
									<div class="border" :class="{'border-danger':item.ischeck}">
										<span v-show="item.ischeck" class="badge badge-danger" style="position: absolute;right: 0;top:0">{{item.checkOrder}}</span>
										<img :src="item.url" class="w-100" style="height: 100px;" @click="choose(item)">
										<div class="w-100 text-white px-1" style="background-color: rgba(0,0,0,0.5);margin-top: -25px;position: absolute;">
											<span class="small">{{item.name}}</span>
										</div>
										<div class="p-2 text-center">
											<el-button-group>
												<el-button size="mini" class="p-2" icon="el-icon-edit" @click="imageEdit(item,index)"></el-button>
												<el-button size="mini" class="p-2" icon="el-icon-delete" @click="imageDel({index})"></el-button>
											</el-button-group>
										</div>
									</div>
								</el-card>
							</el-col>
						</el-row>
					</el-main>
				</el-container>
			</el-container>
			<el-footer class="border-top d-flex align-items-center px-0">
				<!-- 底部 -->
				<div style="width: 200px;flex-shrink: 0;" class="h-100 d-flex align-items-center justify-content-center border-right">
					<el-button-group>
						<el-button size="mini" :disabled="albumPage === 1" @click="changeAlbumPage('pre')">上一页</el-button>
						<el-button size="mini" :disabled="albumPage === Math.ceil(albumTotal / 10)"  @click="changeAlbumPage('next')">下一页</el-button>
					</el-button-group>
				</div>
				<div style="flex:1" class="px-2">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
					 :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</el-footer>
		</el-container>
		<div slot="footer" class="dialog-footer">
			<el-button @click="hide">取 消</el-button>
			<el-button type="primary" @click="confirm">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import albumItem from '@/components/image/album-item.vue'

	export default {
		props:{
			// 选中数量限制
			max:{
				type:Number,
				default:9
			}
		},
		components: {
			albumItem
		},
		data() {
			return {
				imageModel: false,
				callback: false,
				searchForm: {
					order: "",
					keyword: ""
				},
				albumIndex: 0,
				albums: [],
				imagesList: [],
				// 选中的数组
				chooseList: [],
				currentPage: 1,
				albumPage:1,
				albumTotal:0,
				pageSize:10,
				pageSizes:[10,20,50,100],
				total:0,
				asideLoading:false,
				mainLoading:false
			}
		},
		computed: {
			// 选中相册id
			image_class_id() {
				let item = this.albums[this.albumIndex]
				if(item) {
					return item.id
				}
				return 0
			},
			// 当前选中相册的图片列表URL
			getImageListUrl() {
				let other = ''
				if(this.searchForm.keyword != '') {
					other = `&keyword=${this.searchForm.keyword}`
				}
				return `/admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchForm.order}&{other}`
			}
		},
		methods: {
			// 打开弹出层
			chooseImage(callback) {
				this._initX()
				this.callback = callback
				this.imageModel = true
				// 取消选中
				this.unChoose()
			},
			// 点击确定
			confirm() {
				// 选中的图片url
				if (typeof this.callback === 'function') {
					this.callback(this.chooseList)
				}
				// 隐藏
				this.hide()
			},
			// 关闭弹出层
			hide() {
				this.imageModel = false
				this.callback = false
			},
			// 取消选中
			unChoose() {
				this.imagesList.forEach(img => {
					// 找到所有选中的图片
					let i = this.chooseList.findIndex(item => {
						return item.id === img.id
					})
					if (i > -1) {
						// 取消选中样式，选中排序归零
						img.ischeck = false
						img.checkOrder = 0
						// 从chooseList中移除
						this.chooseList.splice(i, 1)
					}
				})
			},
			// 选中图片
			choose(item) {
				// 选中
				if (!item.ischeck) {
					// 限制选中数量
					if(this.chooseList.length >=this.max){
						return this.$message({
							message: '最多选择'+this.max+'张图片',
							type:'warning'
						})
					}
					// 加入选中
					this.chooseList.push({
						id: item.id,
						url: item.url
					})
					// 计算序号
					item.checkOrder = this.chooseList.length
					// 修改状态
					item.ischeck = true
					return
				}
				// 取消选中
				// 找到在chooseList中的索引，删除
				// 修改状态
				let i = this.chooseList.findIndex(v => v.id === item.id)
				if (i === -1) return
				// 重新计算序号
				let length = this.chooseList.length
				// 取消选中中间部分
				if (i + 1 < length) {
					for (let j = i; j < length; j++) {
						let no = this.imagesList.findIndex(v => v.id === this.chooseList[j].id)
						if (no > -1) {
							this.imagesList[no].checkOrder--
						}
					}
				}
				// 删除
				this.chooseList.splice(i, 1)
				item.ischeck = false
				item.checkOrder = 0
			},
			_initX() {
				// 获取相册列表
				this.asideLoading = true
				this.axios.get('admin/imageclass/'+this.albumPage,{
					token:true
				}).then(res=>{
					let result = res.data.data
					this.albums = result.list
					this.albumTotal = result.totalCount
					this.asideLoading = false
					// 获取选中相册下的第一页图片列表
					this.getImageList()
				}).catch(err=>{
					this.asideLoading = false
				})
			},
			// 获取对应相册下的图片列表
			getImageList() {
				this.mainLoading = true
				this.axios.get(this.getImageListUrl,{
					token:true
				}).then(res=>{
					let result = res.data.data
					this.imagesList = result.list.map(item=>{
						return {
							id: item.id,
							url: item.url,
							name: item.name,
							ischeck: false,
							checkOrder: 0
						}
					})
					this.total = result.totalCount
					this.mainLoading = false
				}).catch(err=>{
					this.mainLoading = false
				})
			},
			// 切换相册
			albumChange(index) {
				this.albumIndex = index
				this.getImageList()
			},
			imageEdit(item, index) {
				this.$prompt('请输入新名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: item.name,
					inputValidator(val) {
						if (val === '') {
							return '图片名称不能为空'
						}
					}
				}).then(({
					value
				}) => {
					item.name = value
					this.$message({
						type: 'success',
						message: '修改成功'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '修改取消'
					});
				});
			},
			// 删除当前图片
			imageDel(obj) {
				this.$confirm(obj.all ? '是否删除选中图片，是否继续' : '是否删除该图片，是否继续', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (obj.all) {
						let list = this.imagesList.filter(img => {
							return !this.chooseList.some(c => c.id === img.id)
						})
						this.imagesList = list
						this.chooseList = []
					} else {
						this.imagesList.splice(obj.index, 1)
					}
					this.$message({
						message: '删除成功',
						type: 'success'
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '删除取消'
					})
				})
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			// 分页
			changeAlbumPage(type) {
				if(type === 'pre') {
					this.albumPage--
				}else {
					this.albumPage++
				}
				this._initX()
			},
		}
	}
</script>

<style>
</style>
