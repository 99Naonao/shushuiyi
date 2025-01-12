<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title='请选择您喜爱的佩戴方式'></z-nav-bar>
	<view class="main">
		<view class="select-part" :style="menuStyle">
			<view class="top1">
				<image class="icon" mode="widthFix" :src="'../static/SMY_07_BG01.png'"></image>
			</view>
			<view class="top1">
				<image class="icon" mode="widthFix" :src="'../static/SMY_07_BG02.png'"></image>
			</view>
			<view class="flex space-round">
				<view class="tips">
					绑带内含压力感应器，佩戴时请不要设置过紧
					或者过松，经过三五次佩戴即可精准定位穴位
				</view>
			</view>
			<view class="border flex">
				<view class="border-left">
					<image class="ring" :src="'../static/SMY_07_IconLD.png'">></image>
				</view>
				<view class="tips1">
					<span>听到提示音后助眠程序将自动启动</span>
					<view class="tips2">您可以关闭手机</view>
				</view>

			</view>
		</view>
		<view class="opt-part">
			<view class="opt-btn opt-btn-top" @click="nextStepHandle">
				<view>

					<image class="ring2" :src="'../static/SMY_07_IconJJ.png'">></image>
				</view>
				<view>

					<label>高级设置</label>
				</view>
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
		onShow() {
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 50) + 'px');
		},
		methods: {
			nextStepHandle() {
				console.log('nextStepHandle')
				uni.navigateTo({
					url: "/page_subject/selectMore/selectMore"
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.main {
		background-color: rgb(221, 224, 226);

		width: 100%;
		height: 100%;
		font-family: YouYuan;

		.select-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.icon {
				width: 687rpx;
			}

			.top1 image {
				margin: 0 auto;
				display: block;
				padding-top: 15rpx;
				padding-bottom: 15rpx;
			}

			.icon1 {
				width: 61rpx;
			}

			.icon2 {
				width: 61rpx;
			}



			.tips {
				font-weight: 400;
				font-size: 26rpx;
				line-height: 40rpx;
				color: #E24F36;
				padding-top: 40rpx;
				padding-bottom: 40rpx;
				padding-left: 120rpx;
				padding-right: 120rpx;
			}

			.border {
				background-color: #eff2f6;
				border-radius: 38rpx;
				align-items: center;

				margin: 32rpx;

				.border-left {
					padding: 31rpx;
					padding-top: 30rpx;
					padding-bottom: 30rpx;
					border-top-left-radius: 38rpx;
					border-bottom-left-radius: 38rpx;
					background-color: #E24F36;
					height: 100%;
				}

				.ring {
					width: 65rpx;
					height: 72rpx;
					vertical-align: middle;
					padding: 10rpx;

				}



				.tips1 {
					font-family: YouYuan;
					font-weight: 400;
					line-height: 57rpx;
					font-size: 32rpx;
					color: #3D3D3D;
					text-align: center;
					flex: 1;
				}

				.tips2 {
					font-family: YouYuan;
					font-weight: 400;
					font-size: 28rpx;
					text-align: center;
					padding-top: 20rpx;
					color: #828282;
					padding: 21rpx;
				}


				.title {
					padding: 20rpx;
					text-align: center;
					width: 100%;
				}
			}

		}

		.ring2 {
			width: 44rpx;
			height: 45rpx;
			vertical-align: middle;
			padding: 10rpx;

		}

		.opt-part {
			display: flex;
			justify-content: flex-start;
			margin-top: 42rpx;
			margin-bottom: 42rpx;
			margin-left: 30rpx;

			.opt-btn {
				width: 184rpx;
				height: 120rpx;
				display: flex;
				justify-content: space-around;
				flex-direction: column;
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

		.info-part {
			background-color: #eff2f6;
			border-radius: 38rpx;

			margin: 32rpx;
			padding-bottom: 20rpx;
			padding-top: 16rpx;

			.info-second-part {
				position: relative;
				margin: 0 auto;
				width: 634rpx;
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				// padding: 18rpx;
				color: #5B7897;
				background-color: #eff2f6;

				.item {

					padding-bottom: 16rpx;
					padding-top: 16rpx;
					margin-left: 16rpx;
					margin-right: 16rpx;
					border-bottom: #dde0e2 1px solid;
				}

				.bo {
					width: 128rpx;
					height: 76rpx;
					background-color: rgb(77, 127, 201);
					color: white;
					text-align: center;
					line-height: 76rpx;
					border-radius: 30rpx 30rpx;
				}

				.bo-left {
					position: absolute;
					left: 55rpx;
					top: 193rpx;
					z-index: 10;
				}

				.bo-right {
					z-index: 10;
					position: absolute;
					right: 130rpx;
					top: 193rpx;
				}

				.select {
					background-color: white;
					color: rgb(28, 68, 133);
				}

				.bzb-icon {
					position: absolute;
					left: 66rpx;
					top: 60rpx;
					width: 358rpx;
					height: 139rpx;
				}

				.tzb-icon {
					position: absolute;
					right: 66rpx;
					top: 60rpx;
					width: 327rpx;
					height: 125rpx;
				}

				.human-icon {
					position: absolute;
					right: -30rpx;
					top: -60rpx;
					width: 476rpx;
					height: 271rpx;
				}

				.desc1 {
					font-size: 30rpx;
					color: #3D3D3D;
					line-height: 40rpx;
					z-index: 11;
				}

				.desc1size {
					font-size: 36rpx;

					position: absolute;
					color: #003C71;
					right: 388rpx;
					top: 18rpx;
					z-index: 11;
				}

				.desc2 {
					color: #547896;
					font-size: 26rpx;
					line-height: 35rpx;
					z-index: 11;
				}

				.desc2size {
					font-size: 36rpx;
					color: #003C71;
					position: absolute;
					right: 37rpx;
					top: 43rpx;
					z-index: 11;
				}




				@-webkit-keyframes downEffect {
					0% {
						transform: translateY(0);
						opacity: 0.3;
					}

					30% {
						transform: translateY(120);
						opacity: 1;

					}

					100% {
						transform: translateY(0);
						top: 70px;
						opacity: 1;
					}
				}

				@keyframes downEffect {
					0% {
						transform: translateY(0);
						opacity: 0.3;
					}

					30% {
						transform: translateY(120);
						opacity: 1;

					}

					100% {
						transform: translateY(0);
						top: 70px;
						opacity: 1;
					}
				}


				.down-icon-effect {
					animation: 1s linear 0s infinite downEffect;
					-webkit-animation: 1s linear 0s infinite downEffect;
				}

				@-webkit-keyframes upEffect {
					0% {
						opacity: 0.3;
						top: 50px;
					}

					30% {
						opacity: 1;
					}

					100% {
						top: 20px;
						opacity: 1;
					}
				}

				@keyframes upEffect {
					0% {
						opacity: 0.3;
						top: 50px;
					}

					30% {
						opacity: 1;
					}

					100% {
						top: 20px;
						opacity: 1;
					}
				}

				.up-icon-effect {
					animation: 1s linear 0s infinite upEffect;
					-webkit-animation: 1s linear 0s infinite upEffect;
				}
			}
		}
	}
</style>