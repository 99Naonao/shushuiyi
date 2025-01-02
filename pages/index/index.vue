<template>
	<view class="content">
		<image class="back" mode="widthFix" src="../../static/SMY_01_bg.png"></image>
		<view class="battery">
			<image class="back-img" mode="widthFix" src="../../static/index/SMY_02_DCyanjing.png"></image>
			<view class="info">
				<view class="fillprogress" :style="menuInfo"></view>
				<image class="battery-icon" mode="widthFix" src="../../static/index/SMY_02_IconDC1.png"></image>
				<view class="battery-info">{{(battery)}}%</view>
			</view>
		</view>
		<view class="connect-btn" @click="connectHandler" v-if="!loginStatus">连接主机</view>
		<view class="connect-btn" @click="useHandler" v-else>开始使用</view>
		<view class="bar">
			<view class="bar-left flex just-center align-center">
				<image class="soundicon" mode="widthFix" src="../../static/index/SMY_02_IconYZ.png"></image>
			</view>
			<view class="bar-right" @click="enterDetailHandle">
				<view class="subtitle">
					眠加眼罩
				</view>
				<view class="flex align-center just-center next-part">
					<image class="blueicon" mode="widthFix" src="../../static/index/SMY_02_IconLY.png"></image>
					{{loginStatus?'已连接':'未连接'}}
				</view>
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
		addLog
	} from '../../utils/miniapp';
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

			const deviceInfo = uni.getDeviceInfo();
			this.system = deviceInfo.system;
			console.log({
				deviceInfo
			})
			this.loginStatus = blue_class.getInstance().loginSuccess

			// let name = '平补平泻.qzd';
			// let status_arraybuffer = utf8toGBK(name);
			// let unit8array = [];
			// var dateview = new DataView(status_arraybuffer);
			// for (var index = 0; index < status_arraybuffer.byteLength; index++) {
			// 	unit8array.push(dateview.getUint8(index));
			// }
			// console.log("[changePlayFile]", name, status_arraybuffer, utf8toGBK(name), ab2hex(unit8array))
			// let out = utf8to16(status_arraybuffer)
			// console.log(out);
			// // c6bdb2b9c6bdd0ba2e717a640a
			// var gbk = new TextEncoder('gb2312').encode(name);
			// console.log('gbk:', gbk)

			// const decoded = new TextDecoder('utf-8')
			// 	.decode(new Uint8Array([
			// 		0x7A, 0xC2, 0xA2, 0xE6, 0xB0, 0xB4, 0xF0,
			// 		0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD,
			// 	]))
			// console.log(decoded)

			// const decoded1 = new TextDecoder('utf-8').decode(new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114,
			// 	108, 100
			// ]));
			// console.log(decoded1)

			// addLog({
			// 	'time': 300,
			// 	'handStyle': '平补平泻.qzd',
			// 	'battery': 80,
			// 	'press': 1,
			// 	'streath': 3,
			// 	'music': ''
			// });
		},
		data() {
			return {
				menuInfo: {
					'--menuButtonTop': '30px',
					'--bateryWidth': '0rpx',
				},
				battery: 10,
				loginStatus: false,
				system: '',
			}
		},
		onLoad() {
			// let test = utf8to16([228, 184, 173, 230, 150, 135, 97, 98, 99]);
			// console.log("onload!!!", test)
		},
		onHide() {
			uni.$off('update_pillow_info', this.updateInfo);
			uni.$off('status_change', this.statusChange);
		},
		onShareAppMessage() {

		},
		methods: {
			statusChange() {
				this.loginStatus = blue_class.getInstance().loginSuccess
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
				this.$set(this.menuInfo, '--bateryWidth', (Number(this.battery) / 100) * 50 + 'rpx');
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
				console.log(':', this.system)
				if (this.system.indexOf('IOS') > -1) {
					uni.showToast({
						title: '先选择时长'
					})
				} else {

					wx.openSystemBluetoothSetting({
						success(res) {
							console.log(res)
						}
					})
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
	.content {
		background-color: rgb(5, 12, 21);
		height: 100%;
		position: relative;
	}

	.battery {
		position: absolute;
		top: 120rpx;
		left: 40rpx;

		.back-img {
			width: 120rpx;
		}

		.info {
			margin-top: -80rpx;
			margin-left: 30rpx;
			overflow: hidden;
		}

		.battery-info {
			font-size: 22rpx;
			color: #FFFFFF;
			line-height: 22rpx;
		}


		.fillprogress {
			position: absolute;
			width: 50rpx;
			height: 20rpx;
			top: 18rpx;
			left: 28rpx;
			width: var(--bateryWidth);
			background-color: green;
			border-radius: 2rpx;
			z-index: 99;
		}

		.battery-icon {
			width: 55rpx;
			position: relative;
			z-index: 100;
		}
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
		line-height: 91rpx;
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