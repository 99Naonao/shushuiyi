<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#1A202C' transparentFixedFontColor='#1A202C'
		title='进阶设置'></z-nav-bar>
	<view class="flow-page">
		<view class="flow-content" :style="menuStyle">
			<view class="be-card settings-card">
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
									<slider class="flex1" block-size="18" activeColor="#4A7FD4" :value="press" min="1"
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
									<slider class="flex1" block-size="18" activeColor="#4A7FD4" :value="strength"
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
	@import '@/common/theme.scss';

	slider {
		display: block;
		margin: 0 36rpx;
		margin-top: 10rpx;
		padding: 0;
	}

	.flow-page {
		@include be-page-base;
		min-height: 100vh;
	}

	.flow-content {
		padding-top: var(--menuButtonTop);
		padding-bottom: 48rpx;
	}

	.settings-card {
		margin: 24rpx 32rpx;
		padding: 36rpx 32rpx;
	}

	.setting-block {
		padding-bottom: 40rpx;
		margin-bottom: 40rpx;
		border-bottom: 1rpx solid #EDF2F7;
	}

	.setting-block:last-child {
		border-bottom: none;
		padding-bottom: 0;
		margin-bottom: 0;
	}

	.setting-header {
		display: flex;
		align-items: flex-start;
		margin-bottom: 24rpx;
	}

	.setting-icon {
		width: 56rpx;
		height: 56rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.title {
		font-size: 32rpx;
		font-weight: 600;
		color: $be-text-primary;
		line-height: 1.4;
	}

	.tips {
		font-size: 24rpx;
		color: $be-text-secondary;
		margin-top: 8rpx;
		line-height: 1.5;
	}

	.strength-part {
		position: relative;
		padding-top: 16rpx;
	}

	.tick {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		margin: 0 80rpx;
	}

	.sub-title {
		font-size: 24rpx;
		color: $be-text-muted;
		text-align: center;
	}

	.info {
		width: 100%;
		margin-top: 20rpx;
	}

	.icon-left {
		width: 28rpx;
	}

	.icon-right {
		width: 28rpx;
	}

	.icon1, .icon2 {
		width: 56rpx;
		padding-right: 20rpx;
	}

	.border-right {
		border-bottom: none;
	}
</style>