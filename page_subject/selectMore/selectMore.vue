<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title='进阶设置'></z-nav-bar>
	<view class="main">
		<view class="select-part" :style="menuStyle">
			<view class="border">
				<view class="flex">
					<view>
						<image class="icon1" mode="widthFix" src="../static/step/SMY_08_IconYL.png"></image>
					</view>
					<view class="flex1">
						<view class="">
							自动启动压力控制
						</view>
					</view>
				</view>
				<view class="flex">
					<view>
						<image class="icon2" mode="widthFix" src="../static/step/SMY_08_IconQD.png"></image>
					</view>
				</view>
				<view class="flex space-round">
					<view class="tips">
						绑带内含压力感应器，佩戴时请不要设置过紧
						或者过松，经过三五次佩戴即可精准定位穴位
					</view>
				</view>
			</view>
		</view>
		<view class="opt-part">
			<view class="opt-btn opt-btn-top" @click="nextStepHandle">
				<label>进阶设置</label>
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
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 20) + 'px');
		},
		methods: {
			nextStepHandle() {
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

		.select-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.icon1 {
				width: 61rpx;
			}

			.icon2 {
				width: 61rpx;
			}

			.border {
				background-color: #eff2f6;
				border-radius: 38rpx;

				margin: 32rpx;

				.tips {
					font-weight: 400;
					font-size: 26rpx;
					line-height: 30rpx;
					color: #E24F36;
				}

				.title {
					padding: 20rpx;
					text-align: center;
					width: 100%;
				}
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