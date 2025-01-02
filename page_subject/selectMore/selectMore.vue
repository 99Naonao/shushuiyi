<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title='进阶设置'></z-nav-bar>
	<view class="main">
		<view class="select-part" :style="menuStyle">
			<view class="border">
				<view class="flex">
					<view>
						<image class="icon1" mode="widthFix" :src="'../static/selectMore/SMY_08_IconYL.png'"></image>
					</view>
					<view class="flex1 border-right">
						<view class="top-tips">
							<view class="title">
								自动启动压力控制
							</view>
							<view class="tips">
								感受到这个压力后，将自动启动助眠程序
							</view>
							<switch class="opt-switch" v-if="false"></switch>
						</view>
						<view class="flex border-center strength-part">
							<view class="flex space-between tick" style="margin: 0 58rpx 0 58rpx;">
								<view class="sub-title">1</view>
								<view class="sub-title">2</view>
								<view class="sub-title">3</view>
								<view class="sub-title">4</view>
								<view class="sub-title">5</view>
							</view>
							<view class="flex info" style="margin-top: 30rpx;">
								<view>
									<image class="icon-left" mode="widthFix"
										:src="'../static/selectMore/SMY_08_IconSong.png'"></image>
									<view class="sub-title">松</view>
								</view>
								<view class="flex1">
									<slider class="flex1" block-size="18" activeColor="#194a94" :value="press" min="1"
										max="5" @change="stressSliderChange" step="1" />
									<view class="sub-title">默认</view>
								</view>
								<view>
									<image class="icon-right" mode="widthFix"
										:src="'../static/selectMore/SMY_08_IconJin.png'">
									</image>
									<view class="sub-title">紧</view>
								</view>
							</view>
						</view>

					</view>
				</view>
				<view class="flex" style="margin-top: 46rpx;">
					<view>
						<image class="icon2" mode="widthFix" :src="'../static/selectMore/SMY_08_IconQD.png'"></image>
					</view>
					<view class="flex1">
						<view class="top-tips">
							<view class="title">
								强度调整
							</view>
							<view class="tips">
								调整适合您的按摩强度
							</view>
							<switch class="opt-switch" v-if="false"></switch>
						</view>
						<view class="border-center strength-part">
							<view class="flex tick">
								<view class="sub-title"></view>
								<view class="sub-title flex1">{{strength}}</view>
								<view class="sub-title"></view>
							</view>
							<view class="info flex" style="margin-top: 20rpx;">
								<view>
									<image class="icon-left" mode="widthFix"
										:src="'../static/selectMore/SMY_08_IconRuo.png'"></image>
									<view class="sub-title">弱</view>
								</view>
								<view class="flex1">
									<slider class="flex1" block-size="18" activeColor="#194a94" :value="strength"
										min="0" max="32" @change="strongSliderChange" step="1" />

									<view class="sub-title" v-if="false">默认</view>
								</view>
								<view>
									<image class="icon-right" mode="widthFix"
										:src="'../static/selectMore/SMY_08_IconQiang.png'">
									</image>
									<view class="sub-title">强</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="opt-part" v-if="false">
			<view class="opt-btn opt-btn-top" @click="nextStepHandle">
				<label>进阶设置</label>
			</view>
		</view>
	</view>
</template>

<script>
	import blue_class from '../../utils/BlueManager';
	import {
		addLog
	} from '../../utils/miniapp';
	export default {
		data() {
			return {
				menuStyle: {},
				press: 100,
				strength: 20,
			}
		},
		onShow() {
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 50) + 'px');

			this.press = blue_class.getInstance().getPress();
			this.strength = blue_class.getInstance().getStrength();

			uni.$on('update_strength', this.updateStrengthHandle)
		},
		onHide() {
			uni.$off('update_strength', this.updateStrengthHandle)
		},
		methods: {
			updateStrengthHandle() {
				console.log("updateStrengthHandle")
				this.press = blue_class.getInstance().getPress();
				this.strength = blue_class.getInstance().getStrength();

				addLog({
					'time': 0,
					'handStyle': blue_class.getInstance().getHandStyle(),
					'battery': blue_class.getInstance().getBattery(),
					'press': blue_class.getInstance().getPress(),
					'streath': blue_class.getInstance().getStrength(),
					'music': ''
				});
			},
			strongSliderChange(value) {
				console.log('strong slider:', value.detail.value)
				this.strength = value.detail.value
				blue_class.getInstance().changeStrongMode(value.detail.value + '')

				// addLog({
				// 	'time': 0,
				// 	'handStyle': blue_class.getInstance().getHandStyle(),
				// 	'battery': blue_class.getInstance().getBattery(),
				// 	'press': blue_class.getInstance().getPress(),
				// 	'streath': this.strength,
				// 	'music': ''
				// });
			},
			stressSliderChange(value) {
				console.log('stress slider:', value.detail.value)
				this.press = value.detail.value;
				// 取整间隔是37.5
				blue_class.getInstance().changeStressMode(Math.floor(value.detail.value) + '')

				// addLog({
				// 	'time': 0,
				// 	'handStyle': blue_class.getInstance().getHandStyle(),
				// 	'battery': blue_class.getInstance().getBattery(),
				// 	'press': this.press,
				// 	'streath': blue_class.getInstance().getStrength(),
				// 	'music': ''
				// });
			},
			nextStepHandle() {
				uni.navigateTo({
					url: "/page_subject/selectMore/selectMore"
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	slider {
		display: block;
		margin: 0px 18px;
		margin-top: 10rpx;
		padding: 0;
	}

	.main {
		background-color: rgb(221, 224, 226);

		width: 100%;
		height: 100%;

		.select-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.icon1 {
				width: 61rpx;
				padding-right: 45rpx;
			}

			.icon2 {
				width: 61rpx;
				padding-right: 45rpx;
			}

			.border {
				background-color: #eff2f6;
				border-radius: 38rpx;
				padding: 46rpx 38rpx 46rpx 38rpx;

				margin: 32rpx;

				.top-tips {
					position: relative;
				}

				.opt-switch {
					position: absolute;
					right: -10rpx;
					top: 0px;
				}

				.icon-left {
					width: 23rpx;
				}

				.icon-right {
					width: 25rpx;
				}

				.border-center {
					padding-top: 20rpx;
					padding-bottom: 20rpx;
				}

				.border-right {
					border-bottom: #dde0e2 1px solid;
					margin-bottom: 10rpx;
					padding-bottom: 10rpx;
				}

				.tips {
					font-weight: 400;
					font-size: 24rpx;
					line-height: 70rpx;
					color: #547896;
				}

				.sub-title {
					font-weight: 400;
					font-size: 26rpx;
					color: #828282;
					text-align: center;
				}



				.title2 {}

				.title {
					font-family: YouYuan;
					font-weight: 400;
					font-size: 30rpx;
					color: #3D3D3D;
					line-height: 50rpx;
				}

				.progress-box {
					display: flex;
					height: 50rpx;
					margin-bottom: 60rpx;
				}

				.uni-icon {
					line-height: 1.5;
				}

				.progress-cancel {
					margin-left: 40rpx;
				}

				.progress-control button {
					margin-top: 20rpx;
				}
			}

		}

		.strength-part {
			position: relative;
		}

		.tick {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 10rpx;
			margin: 0 50rpx 0 50rpx;
		}

		.info {
			width: 100%;
			margin-top: 20rpx;
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