<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title=''></z-nav-bar>
	<view class="container">
		<view class="top-part" :style="menuStyle">
			<image mode="widthFix" class="cover" :src="'../static/SMY_06_playMAC.png'"></image>
		</view>
		<view class="center-part">

		</view>
		<view class="opt-part">
			<view class="opt-btn opt-btn-top" @click="nextStepHandle">
				<label>下一步</label>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuStyle: {}
			}
		},
		mounted() {
			let audio = uni.createInnerAudioContext()
			audio.src = "https://jinqiu.bytedance.com/sounds/bgm.mp3"
		},
		onShow() {
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 20) + 'px');
		},
		methods: {
			nextStepHandle() {
				uni.navigateTo({
					url: "/page_subject/step/step"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: rgb(221, 224, 226);

		width: 100%;
		height: 100%;

		.top-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.cover {
				width: 164rpx;
				border-radius: 50%;
				margin: 0 auto;
				display: block;
			}
		}

		.opt-part {
			display: flex;
			justify-content: space-around;
			margin-top: 42rpx;
			margin-bottom: 42rpx;

			.opt-btn {
				width: 284rpx;
				height: 90rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				background-color: rgb(28, 68, 133);
				border-radius: 30rpx;
				line-height: 56rpx;
				color: white;
			}

			.opt-btn-top {
				background-color: rgb(79, 128, 191);
			}

		}
	}
</style>