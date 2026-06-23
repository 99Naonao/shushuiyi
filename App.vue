<script>
	export default {
		data() {
			return {
				/**
				 * @description 计算导航栏信息
				 */
				calcNavBarInfo() {
					console.log('this.global', this.globalData)
					uni.getSystemInfo({
						success: res => {
							let menuButtonInfo = {}
							if (res.platform === 'ios') {
								// ios设备的胶囊按钮都是固定的
								menuButtonInfo = {
									width: 87,
									height: 32,
									left: res.screenWidth - 7 - 87,
									right: res.screenWidth - 7,
									top: res.statusBarHeight + 4,
									bottom: res.statusBarHeight + 4 + 32
								}
							} else {
								// 安卓通过api获取
								menuButtonInfo = uni.getMenuButtonBoundingClientRect()
							}
							console.log('获取胶囊信息：', menuButtonInfo, res);
							// 导航栏高度 = 状态栏到胶囊的间距（胶囊距上未知-状态栏高度）* 2 + 胶囊高度 + 状态栏高度
							this.globalData.navHeight = (menuButtonInfo.top - res.statusBarHeight) *
								2 + menuButtonInfo.height + res.statusBarHeight;
							console.log('navHeight:', this.globalData.navHeight);
							// 按钮上下边距高度
							this.globalData.menuBottom = menuButtonInfo.top - res.statusBarHeight;
							this.globalData.top = menuButtonInfo.top;
							this.globalData.navHeight = res.statusBarHeight;
							// 导航栏右边到屏幕边缘的距离
							this.globalData.menuRight = res.screenWidth - menuButtonInfo.right;
							// 导航栏高度
							this.globalData.menuHeight = menuButtonInfo.height;
						},
						fail(err) {}
					})
				},
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.calcNavBarInfo();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import 'common/uni.css';
	@import 'common/theme.scss';

	page {
		width: 100%;
		height: 100%;
		background-color: #F0F4F8;
		font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
	}

	view {
		display: block;
	}

	.flex1 {
		flex: 1;
	}

	.flex {
		display: flex;
	}

	.space-round {
		justify-content: space-around;
	}

	.space-between {
		justify-content: space-between;
	}

	.just-center {
		justify-content: center;
	}

	.align-center {
		align-items: center;
	}
</style>