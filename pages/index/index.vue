<template>
	<view class="content">
		<image class="back" mode="widthFix" src="../../static/SMY_01_bg.png"></image>
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

<style>
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
</style>