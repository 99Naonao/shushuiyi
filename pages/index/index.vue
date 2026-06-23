<template>
	<view class="home">
		<view class="home-hero">
			<view class="home-header" :style="{ paddingTop: headerPaddingTop }">
				<view class="battery-card">
					<view class="battery-icon-wrap">
						<view class="battery-body">
							<view class="battery-fill" :style="menuInfo"></view>
						</view>
						<view class="battery-cap"></view>
					</view>
					<text class="battery-text">{{ battery }}%</text>
				</view>
			</view>
			<view class="device-visual">
				<image class="device-img" mode="aspectFill" src="../../static/SMY_01_bg.png"></image>
			</view>
		</view>

		<view class="home-body">
			<view class="status-card" @click="enterDetailHandle">
				<view class="status-left">
					<image class="status-icon" mode="widthFix" src="../../static/index/SMY_02_IconYZ.png"></image>
				</view>
				<view class="status-right">
					<view class="status-name">助眠仪主机</view>
					<view class="status-row">
						<view class="be-status-dot" :class="loginStatus ? 'online' : 'offline'"></view>
						<text class="status-label">{{ loginStatus ? '已连接' : '未连接' }}</text>
					</view>
				</view>
				<view class="status-arrow">›</view>
			</view>

			<view class="action-area">
				<view class="be-btn-primary action-btn" @click="connectHandler" v-if="!loginStatus">连接主机</view>
				<view class="be-btn-primary action-btn" @click="useHandler" v-else>开始使用</view>
			</view>
		</view>
	</view>
</template>

<script>
	import blue_class from '../../utils/BlueManager';
	import {
		utf8to16,
		utf8toGBK,
		ab2hex
	} from "../../common/util.js"
	import {
		addLog,
		getappVersion,
	} from '../../utils/miniapp';
	import base from '@/utils/baseUrl';
	export default {
		onShow() {
			let curPages = getCurrentPages()[0]
			if (typeof curPages.getTabBar === 'function' && curPages.getTabBar()) {
				curPages.getTabBar().setData({
					selected: 0,
					onshow: true
				});
			}

			uni.$on('update_pillow_info', this.updateInfo);
			uni.$on('status_change', this.statusChange);
			this.updateInfo(false)

			this.loginStatus = blue_class.getInstance().loginSuccess;
			console.log('onShow statusChange:', this.loginStatus)

			this.updateSafeArea()

			getappVersion({
				appId: base.publicAppId
			}).then(res => {
				const app = getApp();
				app.globalData.versionCode = res.versionCode;
			})

		},
		data() {
			return {
				menuInfo: {
					'--bateryWidth': '0%',
				},
				headerPaddingTop: '44px',
				battery: 10,
				loginStatus: false,
			}
		},
		onLoad() {
			this.updateSafeArea()
		},
		onHide() {
			uni.$off('update_pillow_info', this.updateInfo);
			uni.$off('status_change', this.statusChange);
		},
		onShareAppMessage() {

		},
		methods: {
			updateSafeArea() {
				const sys = uni.getSystemInfoSync()
				const statusBarHeight = sys.statusBarHeight || 20
				let menuTop = statusBarHeight + 4
				if (sys.platform === 'ios') {
					menuTop = statusBarHeight + 4
				} else {
					const menuButton = uni.getMenuButtonBoundingClientRect()
					if (menuButton && menuButton.top) {
						menuTop = menuButton.top
					}
				}
				const app = getApp()
				if (app.globalData && app.globalData.top) {
					menuTop = app.globalData.top
				}
				this.headerPaddingTop = menuTop + 'px'
			},
			statusChange() {
				this.loginStatus = blue_class.getInstance().loginSuccess;
				console.log('statusChange:', this.loginStatus)
			},
			useHandler() {
				if (this.loginStatus) {
					uni.navigateTo({
						url: "/page_subject/adjust/adjust"
					})
				}
			},
			updateInfo(needlog = true) {

				// this.$set(this.menuInfo, '--bateryWidth', (blue_class.getInstance().pillowPower * 50 / 1000) + 'rpx');
				this.battery = blue_class.getInstance().getBattery();
				this.$set(this.menuInfo, '--bateryWidth', (Number(this.battery)) + '%');
				console.log('updateInfo!', this.menuInfo)

				if (needlog) {

					addLog({
						'time': 0,
						'handStyle': blue_class.getInstance().getHandStyle(),
						'battery': blue_class.getInstance().getBattery(),
						'press': blue_class.getInstance().getPress(),
						'streath': blue_class.getInstance().getStrength(),
						'music': ''
					});
				}
			},
			enterDetailHandle() {
				if (this.loginStatus) {
					this.useHandler()
				} else {
					this.connectHandler()
				}
			},
			connectHandler() {
				uni.navigateTo({
					url: "/page_subject/work/work"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/theme.scss';

	.home {
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: $be-bg-dark;
		padding-bottom: calc(#{$be-tabbar-height} + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.home-hero {
		flex: 1;
		min-height: 0;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.home-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 2;
		padding-left: 32rpx;
		padding-right: 32rpx;
		padding-bottom: 16rpx;
		box-sizing: border-box;
	}

	.battery-card {
		display: inline-flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.1);
		border-radius: $be-radius-pill;
		padding: 12rpx 24rpx;
		border: 1rpx solid rgba(255, 255, 255, 0.15);
	}

	.battery-icon-wrap {
		display: flex;
		align-items: center;
		margin-right: 12rpx;
	}

	.battery-body {
		width: 48rpx;
		height: 24rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.6);
		border-radius: 4rpx;
		padding: 2rpx;
		overflow: hidden;
	}

	.battery-fill {
		height: 100%;
		width: var(--bateryWidth);
		background: linear-gradient(90deg, $be-success, #68D391);
		border-radius: 2rpx;
	}

	.battery-cap {
		width: 4rpx;
		height: 12rpx;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 0 2rpx 2rpx 0;
		margin-left: 2rpx;
	}

	.battery-text {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	}

	.device-visual {
		flex: 1;
		min-height: 0;
		width: 100%;
		overflow: hidden;
	}

	.device-img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.home-body {
		flex-shrink: 0;
		width: 100%;
		box-sizing: border-box;
		background: $be-bg-page;
		border-radius: 40rpx 40rpx 0 0;
		padding: 32rpx 32rpx 24rpx;
	}

	.status-card {
		background: $be-surface;
		border-radius: $be-radius-lg;
		box-shadow: $be-shadow-sm;
		margin: 0 0 24rpx;
		padding: 24rpx 28rpx;
		display: flex;
		align-items: center;
	}

	.status-left {
		width: 80rpx;
		height: 80rpx;
		background: linear-gradient(135deg, $be-primary-light, $be-primary);
		border-radius: $be-radius-md;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.status-icon {
		width: 44rpx;
		height: 36rpx;
	}

	.status-right {
		flex: 1;
		min-width: 0;
	}

	.status-name {
		font-size: 30rpx;
		font-weight: 600;
		color: $be-text-primary;
		margin-bottom: 6rpx;
	}

	.status-row {
		display: flex;
		align-items: center;
	}

	.status-label {
		font-size: 24rpx;
		color: $be-text-secondary;
	}

	.status-arrow {
		font-size: 36rpx;
		color: $be-text-muted;
		font-weight: 300;
		flex-shrink: 0;
	}

	.action-area {
		width: 100%;
		box-sizing: border-box;
	}

	.action-btn {
		width: 100%;
		box-sizing: border-box;
		font-size: 32rpx;
		letter-spacing: 4rpx;
	}
</style>
