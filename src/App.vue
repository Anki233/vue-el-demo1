<template>
	<div id="app">
		<router-view></router-view>
		<imageDialog ref="imageDialog" :max="maxChooseImage"></imageDialog>
		<skusDialog ref="skusDialog"></skusDialog>
	</div>
</template>

<script>
	import imageDialog from '@/components/image/image-dialog.vue'
	import skusDialog from '@/components/skus/skus-dialog.vue'

	export default {
		components: {
			imageDialog,
			skusDialog
		},
		name: "app",
		// 依赖注入
		provide() {
			return {
				app: this
			}
		},
		data() {
			return {
				maxChooseImage: 9
			}
		},
		methods:{
			// 选择图片
			chooseImage(callback,max = 9){
				this.maxChooseImage = max
				this.$refs.imageDialog.chooseImage(callback)
			},
			// 选择规格
			chooseSkus(callback) {
				this.$refs.skusDialog.chooseSkus(callback)
			}
		}
	}
</script>

<style>
	.el-table th.gutter {
		display: table-cell !important;
	}

	::-webkit-scrollbar {
		/*滚动条整体样式*/
		-webkit-appearance: none;
		width: 10px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 1px;
	}

	::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 10px;
		background-color: #c1c1c1;
		background-image: -webkit-linear-gradient(45deg,
			rgba(255, 255, 255, 0.2) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.2) 75%,
			transparent 75%,
			transparent);
	}

	::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #ededed;
		border-radius: 0;
	}
</style>