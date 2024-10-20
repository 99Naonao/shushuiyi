<template>
	<view class="content">
		<image class="back" mode="widthFix" src="../../static/SMY_01_bg.png"></image>
		<view class="connect-btn">连接助眠仪</view>
		<view class="start-btn">开始设置</view>
		<view class="bar">
			<view class="bar-left flex just-center align-center">
				<image class="soundicon" mode="widthFix" src="../../static/index/SMY_02_IconEJ.png"></image>
			</view>
			<view class="bar-right">
				<view class="subtitle">
					眠加耳机
				</view>
				<view class="flex align-center just-center next-part">
					<image class="blueicon" mode="widthFix" src="../../static/index/SMY_02_IconLY.png"></image>
					未连接
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			let curPages = getCurrentPages()[0]
			console.log("fuck:", curPages)
			if (typeof curPages.getTabBar === 'function' && curPages.getTabBar()) {
				curPages.getTabBar().setData({
					selected: 0,
					onshow: true
				});
			}
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.content {
		background-color: rgb(5, 12, 21);
		height: 100%;
	}

	.back {
		width: 100%;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}


	.connect-btn {
		width: 467rpx;
		height: 91rpx;
		text-align: center;
		background-color: rgb(28, 68, 133);
		line-height: 78rpx;
		color: white;
		margin: 20rpx;
		border-radius: 25rpx;
		position: absolute;
		bottom: 290rpx;
		left: 50%;
		margin-left: -232rpx;
	}

	.bar {
		width: 315rpx;
		height: 117rpx;
		/* background-color: white; */
		overflow: hidden;
		position: relative;
		bottom: 160rpx;
		left: 50%;
		margin-left: -157rpx;
		border-radius: 15rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;


		.bar-right {
			height: 100%;
			width: 215rpx;

			margin-left: 10rpx;
			background-color: rgb(213, 223, 247);

			.subtitle {
				height: 30rpx;
				font-weight: normal;
				font-size: 32rpx;
				color: #3D3D3D;
				text-align: center;
				width: 100%;
				margin-top: 10rpx;
			}

			.next-part {
				margin-top: 20rpx;
			}
		}

		.bar-left {
			width: 115rpx;
			height: 100%;
			background-color: rgb(159, 169, 187);
			// background-color: antiquewhite;
		}


		.blueicon {
			width: 36rpx;
			height: 41rpx;
		}

		.soundicon {
			width: 57rpx;
			height: 45rpx;
		}


	}
</style>