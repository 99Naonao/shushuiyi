<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#1A202C' transparentFixedFontColor='#1A202C'
		title='佩戴方式'></z-nav-bar>
	<view class="flow-page">
		<scroll-view class="flow-scroll" scroll-y :style="menuStyle">
			<view class="be-card guide-card">
				<image class="guide-img" mode="widthFix" src="../static/SMY_07_BG02.png"></image>
				<view class="guide-tips">
					绑带内含压力感应器，佩戴时请不要设置过紧或者过松，经过三五次佩戴即可精准定位穴位
				</view>
			</view>

			<view class="be-card settings-card">
				<view class="section-label">高级设置</view>
				<view class="flex setting-row">
					<image class="icon1" mode="widthFix" src="../static/selectMore/SMY_08_IconYL.png"></image>
					<view class="flex1">
						<view class="title">自动启动压力控制</view>
						<view class="tips">感受到这个压力后，将自动启动助眠程序</view>
						<view class="strength-part">
							<view class="flex space-between tick">
								<view class="sub-title">1</view>
								<view class="sub-title">2</view>
								<view class="sub-title">3</view>
								<view class="sub-title">4</view>
								<view class="sub-title">5</view>
							</view>
							<view class="flex info slider-row">
								<view class="slider-side">
									<image class="icon-left" mode="widthFix" src="../static/selectMore/SMY_08_IconSong.png"></image>
									<view class="sub-title">松</view>
								</view>
								<view class="flex1">
									<slider block-size="18" activeColor="#4A7FD4" :value="press" min="1" max="5"
										@change="stressSliderChange" step="1" />
									<view class="sub-title">默认</view>
								</view>
								<view class="slider-side">
									<image class="icon-right" mode="widthFix" src="../static/selectMore/SMY_08_IconJin.png"></image>
									<view class="sub-title">紧</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="divider"></view>

				<view class="flex setting-row">
					<image class="icon2" mode="widthFix" src="../static/selectMore/SMY_08_IconQD.png"></image>
					<view class="flex1">
						<view class="title">强度调整</view>
						<view class="tips">调整适合您的按摩强度</view>
						<view class="strength-part">
							<view class="flex tick strength-value">
								<view class="sub-title flex1">{{strength}}</view>
							</view>
							<view class="flex info slider-row">
								<view class="slider-side">
									<image class="icon-left" mode="widthFix" src="../static/selectMore/SMY_08_IconRuo.png"></image>
									<view class="sub-title">弱</view>
								</view>
								<view class="flex1">
									<slider block-size="18" activeColor="#4A7FD4" :value="strength" min="0" max="32"
										@change="strongSliderChange" step="1" />
								</view>
								<view class="slider-side">
									<image class="icon-right" mode="widthFix" src="../static/selectMore/SMY_08_IconQiang.png"></image>
									<view class="sub-title">强</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="flow-footer">
			<view class="be-btn-primary flow-btn" @click="navIndexStepHandle">返回首页</view>
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
				press: 3,
				strength: 20,
			}
		},
		onShow() {
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 50) + 'px');

			const pressVal = blue_class.getInstance().getPress()
			const strengthVal = blue_class.getInstance().getStrength()
			this.press = pressVal > 0 ? pressVal : 3
			this.strength = strengthVal >= 0 ? strengthVal : 20

			uni.$on('update_strength', this.updateStrengthHandle)
		},
		onHide() {
			uni.$off('update_strength', this.updateStrengthHandle)
		},
		methods: {
			updateStrengthHandle() {
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
				this.strength = value.detail.value
				blue_class.getInstance().changeStrongMode(value.detail.value + '')
			},
			stressSliderChange(value) {
				this.press = value.detail.value
				blue_class.getInstance().changeStressMode(Math.floor(value.detail.value) + '')
			},
			navIndexStepHandle() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/theme.scss';

	slider {
		display: block;
		margin: 0 24rpx;
		margin-top: 10rpx;
		padding: 0;
	}

	.flow-page {
		@include be-page-base;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.flow-scroll {
		flex: 1;
		min-height: 0;
		padding-top: var(--menuButtonTop);
		padding-bottom: 24rpx;
		box-sizing: border-box;
	}

	.guide-card,
	.settings-card {
		margin: 24rpx 32rpx;
		padding: 32rpx;
	}

	.guide-img {
		width: 100%;
		border-radius: $be-radius-md;
		display: block;
	}

	.guide-tips {
		margin-top: 24rpx;
		padding: 24rpx;
		background: rgba(232, 168, 124, 0.12);
		border-radius: $be-radius-md;
		border-left: 6rpx solid $be-accent;
		font-size: 28rpx;
		line-height: 1.7;
		color: $be-text-secondary;
	}

	.section-label {
		font-size: 30rpx;
		font-weight: 600;
		color: $be-text-primary;
		margin-bottom: 28rpx;
	}

	.setting-row {
		align-items: flex-start;
	}

	.icon1,
	.icon2 {
		width: 56rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.title {
		font-size: 30rpx;
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

	.divider {
		height: 1rpx;
		background: #EDF2F7;
		margin: 32rpx 0;
	}

	.strength-part {
		position: relative;
		padding-top: 16rpx;
	}

	.tick {
		margin: 0 80rpx;
	}

	.strength-value {
		justify-content: center;
		margin-bottom: 8rpx;
	}

	.sub-title {
		font-size: 24rpx;
		color: $be-text-muted;
		text-align: center;
	}

	.slider-row {
		margin-top: 16rpx;
		align-items: flex-end;
	}

	.slider-side {
		text-align: center;
		width: 56rpx;
		flex-shrink: 0;
	}

	.icon-left,
	.icon-right {
		width: 28rpx;
		display: block;
		margin: 0 auto;
	}

	.flow-footer {
		flex-shrink: 0;
		padding: 24rpx 48rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		background: $be-surface;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	}

	.flow-btn {
		width: 100%;
		box-sizing: border-box;
	}
</style>
