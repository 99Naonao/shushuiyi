<template>
	<view class="help-page">
		<view class="help-hero" :style="menuStyle">
			<view class="help-hero-title">使用帮助</view>
			<view class="help-hero-desc">常见问题与操作指南</view>
		</view>
		<scroll-view class="help-body" scroll-y>
			<view class="help-content">
				<view class="section-title">常见问题</view>
				<uni-collapse ref="collapse" v-model="value" @change="change">
					<uni-collapse-item title="1. 如何连接设备">
						<view class="collapse-content">
							<text class="collapse-text">{{content}}</text>
						</view>
					</uni-collapse-item>
					<uni-collapse-item title="2. 如何测量我的头型">
						<view class="collapse-content">
							<text class="collapse-text">打开助眠仪后，在首页点击「连接主机」，确保手机蓝牙已开启。扫描到设备后点击连接，连接成功后即可开始使用。</text>
						</view>
					</uni-collapse-item>
					<uni-collapse-item title="3. 其他疑问">
						<view class="collapse-content">
							<text class="collapse-text">如遇到连接失败，请确认设备已开机并靠近手机，或尝试关闭后重新打开蓝牙。佩戴时请调整绑带松紧，经过几次使用即可精准定位穴位。</text>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuStyle: {
					'--menuButtonTop': '0'
				},
				title: 'Hello112123',
				value: [],
				accordionVal: '1',
				content: '长按助眠仪电源键 3 秒开启蓝牙，然后在小程序首页点击「连接主机」，从设备列表中选择您的助眠仪进行连接。',
				extraIcon: {
					color: '#4cd964',
					size: '26',
					type: 'image'
				},
			}
		},
		onShow() {
			let curPages = getCurrentPages()[0]
			if (typeof curPages.getTabBar === 'function' && curPages.getTabBar()) {
				curPages.getTabBar().setData({
					selected: 1
				});
			}

			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 24) + 'px');
		},
		onLoad() {

		},
		methods: {
			change(e) {

			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/theme.scss';

	.help-page {
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: $be-bg-page;
		padding-bottom: calc(#{$be-tabbar-height} + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.help-hero {
		flex-shrink: 0;
		background: linear-gradient(160deg, $be-primary-dark 0%, $be-primary 60%, $be-primary-light 100%);
		padding: var(--menuButtonTop) 48rpx 48rpx;
	}

	.help-hero-title {
		font-size: 44rpx;
		font-weight: 700;
		color: $be-text-inverse;
		letter-spacing: 4rpx;
	}

	.help-hero-desc {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.65);
		margin-top: 12rpx;
	}

	.help-body {
		flex: 1;
		min-height: 0;
		width: 100%;
	}

	.help-content {
		padding: 32rpx 32rpx 48rpx;
		box-sizing: border-box;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: $be-text-primary;
		margin-bottom: 24rpx;
	}

	.uni-collapse-item__title-text {
		flex: none !important;
	}

	.uni-collapse-item__title-box {
		background: none !important;
		color: $be-text-primary !important;
		font-size: 30rpx !important;
		font-weight: 500 !important;
	}

	.uni-collapse-item__wrap-content.uni-collapse-item--border {
		border-bottom-width: 0px !important;
	}

	.uni-collapse-item__wrap {
		background: none !important;
	}

	.uni-collapse-item__wrap-content {
		color: $be-text-secondary !important;
		font-size: 28rpx !important;
		line-height: 1.7 !important;
	}

	.uni-collapse-item__title.uni-collapse-item-border {
		border-bottom: none !important;
	}

	.uni-collapse-item {
		border: none;
		border-radius: $be-radius-md;
		margin-bottom: 20rpx;
		background: $be-surface;
		overflow: hidden;
		box-shadow: $be-shadow-sm;
	}

	.collapse-content {
		padding: 8rpx 24rpx 24rpx;
	}

	.collapse-text {
		color: $be-text-secondary;
		font-size: 28rpx;
		line-height: 1.7;
	}
</style>
