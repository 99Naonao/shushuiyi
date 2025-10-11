<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title='连接设备'></z-nav-bar>
	<public-module></public-module>
	<!-- <page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta> -->
	<view class="main-container">
		<image class="topKV" :style="menuStyle" mode="widthFix" src="/static/work/SMY_04_01.png"></image>
		<view class="info-part">

			<view class="tips" for="">监测到以下设备</view>
			<view class="tips" v-if="deviceIdList.length == 0">暂无设备</view>
			<view v-for="(item,index) in deviceIdList" :key="index">
				<view class="device-item">
					<image class="device-icon" mode="widthFix" src="/page_subject/static/work/SMY_04_IconYJ.png">
					</image>
					<view class="item-name">
						{{item.name}}
					</view>
					<view class="blue-tooth">
						<image mode="widthFix" :src="checkConnectList(item)">
						</image>
					</view>
					<!-- 				<view class="wifi" v-if="false">
				</view> -->
					<view class="connect-btn" @click="connectBlueToothSleepHandler(item)">{{loginStatus?'已连接':'未连接'}}
					</view>
					<!-- 				<image :src="'../static/SY_01WIEI_buttonTJa.png'" class="connect-btn">
				</image> -->
				</view> 
			</view>
		</view>
		<view class="spetips">
			<div class="item" style="margin-left: 42rpx;">特别说明:</div>
			<div class="item flex align-center" style="padding-bottom: 60rpx;">
				<image class="iconblue" mode="widthFix" src="../../static/SY_01_IconLY.png"></image>
				<div>要使用助眠仪的基本功能，需要用到蓝牙连接</div>
			</div>
		</view>
	</view>
</template>

<script>
	import {
		object2Query,
		hexCharCodeToStr,
		appAnswer,
		parseTime,
		ab2hex,
		ab2str,
		str2ab,
		hex2String,
		Uint8ArrayToString,
		hexStringToArrayBuffer,
		utf8to16,
	} from '@/common/util.js'
	import blue_class from '../../utils/BlueManager';
	import {
		nextTick
	} from 'vue';
	export default {
		components: {

		},
		data() {
			return {
				menuStyle: {
					'--menuButtonTop': "0",
				},
				currentItem: {},
				onShowing: false, //页面是否显示
				show: false,
				loginStatus: false,
				success: false, //第一次握手成功
				characteristicId: '6E400004-B5A3-F393-E0A9-E50E24DCCA9E', //特征值
				characteristicStringId: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E', //write，string，rx；
				searching: false, // 搜索中
				deviceId: '', // 连接的蓝牙id
				serviceId: '', // 连接的服务id
				findingIndex: 0,
				deviceIdList: [], // 检测列表
				testName: '测试专用',
				// deviceIdList: [],
				connectList: [], // 连接列表
				service_1: '0001FFE7-6865-6F6E-652D-7A732D717A10',
				service_charactor1: '0001FFE7-6865-6F6E-652D-7A732D717A11',
				service_charactor2: '0001FFE7-6865-6F6E-652D-7A732D717A12',
				service_charactor3: '0001FFE7-6865-6F6E-652D-7A732D717A13',
				service_charactor4: '0001FFE7-6865-6F6E-652D-7A732D717A14',
				service_2: '0001FFE7-6865-6F6E-652D-7A732D717A50',
				service2_charactor1: '0001FFE7-6865-6F6E-652D-7A732D717A51',
				service2_charactor2: '0001FFE7-6865-6F6E-652D-7A732D717A52',
				service2_charactor3: '0001FFE7-6865-6F6E-652D-7A732D717A56',
				service2_charactor4: '0001FFE7-6865-6F6E-652D-7A732D717A54',
				service2_charactor5: '0001FFE7-6865-6F6E-652D-7A732D717A53',
				service_3: '0001FFE7-6865-6F6E-652D-7A732D717A30',
				service_3_press: '0001FFE7-6865-6F6E-652D-7A732D717A33',
				service_battery: '0000180F-0000-1000-8000-00805F9B34FB',
				service_battery_c1: '00002A19-0000-1000-8000-00805F9B34FB',
			}
		},
		onShow() {
			this.onShowing = true;
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 80) + 'px');
			this.loginStatus = blue_class.getInstance().loginSuccess

			// 如果正在搜索中
			if (this.searching) {
				uni.closeBluetoothAdapter({
					complete: () => {
						this.searching = false
					}
				})
			} else {
				if (blue_class.getInstance().deviceName != '') {
					this.deviceIdList = [{
						name: blue_class.getInstance().deviceName
					}];
				} else if (app.globalData.versionCode == 0) {
					this.deviceIdList.push({
						name: this.testName,
						deviceId: 'deviceId'
					});
				}
			}
			uni.$on('xx', this.handleMessage)
			// 监听低功耗蓝牙设备的特征值变化事件.必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
			// uni.onBLECharacteristicValueChange(this.handleMessage)
		},
		onHide() {
			// uni.offBLECharacteristicValueChange(this.handleMessage)
			this.onShowing = false;
			uni.$off('xx', this.handleMessage)
		},
		onLoad() {
			// 监听设备发现
			let that = this
			uni.onBluetoothDeviceFound((result) => {
				//剔除重复设备，兼容不同设备API的不同返回值
				var isnotexist = true
				let devices = result.devices
				// 1
				if (result.deviceId) {

				} else if (result.devices) {
					if (result.devices[0].advertisData) {
						result.devices[0].advertisData = ab2hex(result.devices[0].advertisData)
					} else {
						result.devices[0].advertisData = ''
					}

					for (var i = 0; i < that.deviceIdList.length; i++) {
						if (result.devices[0].deviceId == that.deviceIdList[i].deviceId) {
							isnotexist = false
						}
					}
					if (isnotexist && result.devices[0].name != '') {
						if (result.devices[0].name.indexOf('zzZMinga') > -1) {
							that.deviceIdList.push(result.devices[0])
						}
						console.log('result.devices[0].name:', result.devices[0].name)
						// }
					}
					// if (isnotexist && result.devices[0].name != '' && result.devices[0].name.indexOf('Minga') > -
					// 	1) {
					// 	that.deviceIdList.push(result.devices[0])
					// }
				} else if (result[0]) {
					if (result[0].advertisData) {
						result[0].advertisData = ab2hex(result[0].advertisData)
					} else {
						result[0].advertisData = ''
					}

					for (var i = 0; i < that.deviceIdList.length; i++) {
						if (result[0].deviceId == that.deviceIdList[i].deviceId) {
							isnotexist = false
						}
					}
					if (isnotexist && result[0].name != '' && result[0].name.indexOf('zzZMinga') > -1) {
						that.deviceIdList.push(result[0])
					}
				}

				let first_device = devices[0]
				for (var i = 0; i < that.deviceIdList.length; i++) {
					if (devices.deviceId == that.deviceIdList[i].deviceId) {
						isnotexist = false
					}
				}
				console.log('new device list has founded', devices.length, devices)
			})

			uni.openBluetoothAdapter({
				success: (res) => {
					console.log('startBluetoothDevicesDiscovery')
					// 开始搜索蓝牙设备
					uni.startBluetoothDevicesDiscovery({
						services: [],
						success(res) {
							console.log('startBluetoothDevicesDiscovery success:', res)
							this.searching = true
						}
					})

					uni.getBluetoothAdapterState({
						success: (res) => {
							console.log('getBluetoothAdapterState success!', res)
						}
					})
				},
				fail(res) {
					uni.showModal({
						title: '权限不足提示',
						content: '请检查小程序是否授予蓝牙权限',
						showCancel: false,
						success: (res) => {
							this.searching = false
						}
					})
				}
			})
		},

		methods: {
			handlePressMessage(characteristic) {
				// 处理压力
				switch (characteristic.characteristicId) {
					case this.service_3_press:
						let a = ab2hex(characteristic.value)
						let press = parseInt('0x' + a);
						console.log('压力:', press, ab2hex(characteristic.value))
						blue_class.getInstance().setPress(press);
						break;
				}
			},
			handleHardMessage(characteristic) {
				switch (characteristic.characteristicId) {
					case this.service_charactor1:
						// 型号
						let a = ab2hex(characteristic.value)
						console.log('型号:', hex2String(a), ab2hex(characteristic.value))
						break;
					case this.service_charactor2:
						// 型号
						let b = ab2hex(characteristic.value)
						console.log('SN:', hex2String(b), ab2hex(characteristic.value))
						break;
					case this.service_charactor3:
						// 型号
						let c = ab2hex(characteristic.value)
						console.log('硬件版本:', hex2String(c), ab2hex(characteristic.value))
						break;
					case this.service_charactor4:
						// 型号
						let d = ab2hex(characteristic.value)
						console.log('固件版本:', hex2String(d), ab2hex(characteristic.value))
						break;
				}
			},
			handlePlayMessage(characteristic) {
				let d = ab2hex(characteristic.value);
				if (characteristic.characteristicId == this.service2_charactor5) {
					// 如果是读取的模式
					let handstyle = utf8to16(characteristic.value);
					console.log('模式返回21:', d, handstyle)
					blue_class.getInstance().setHandStyle(handstyle);
				} else if (characteristic.characteristicId == this.service2_charactor4) {
					console.log('强度返回2:', parseInt('0x' + ab2hex(characteristic.value)), ab2hex(characteristic.value))
					blue_class.getInstance().setStrength(parseInt('0x' + ab2hex(characteristic.value)));
				} else if (characteristic.characteristicId == this.service2_charactor3) {
					console.log('按键通知:readBLECharacteristicValue:')
					// 收到按键通知
					if (d == '01') {
						uni.readBLECharacteristicValue({
							// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
							deviceId: blue_class.getInstance().deviceId,
							// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
							serviceId: this.service_2,
							// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
							characteristicId: this.service2_charactor5,
							success(res) {
								console.log('模式:readBLECharacteristicValue:', res, res.errCode)
							},
							fail(res) {
								console.log('fail!', res)
							}
						})
					} else if (d == '02') {
						uni.readBLECharacteristicValue({
							// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
							deviceId: blue_class.getInstance().deviceId,
							// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
							serviceId: this.service_2,
							// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
							characteristicId: this.service2_charactor4,
							success(res) {
								console.log('强度:readBLECharacteristicValue:', res, res.errCode)
							},
							fail(res) {
								console.log('fail!', res)
							}
						})
					}
				}

				console.log('播放状态版本13211:', ab2hex(characteristic.value), characteristic.characteristicId)
				// if (characteristic.characteristicId == this.service2_charactor1) {
				// 	this.changeMode('start', "30")
				// }
			},
			handleBatteryMessage(characteristic) {
				console.log('电池百分比返回132:', characteristic)
				let d = ab2hex(characteristic.value);
				if (characteristic.characteristicId == this.service_battery_c1) {
					// 如果是读取的模式
					console.log('电池百分比返回1:', d, parseInt('0x' + d))
					blue_class.getInstance().setBattery(parseInt('0x' + d));
				}
			},
			changeMode(status, time) {
				let status_arraybuffer = str2ab(status);
				console.log("[changeMode]", status, time, str2ab(status))
				// 更改播放模式
				uni.writeBLECharacteristicValue({
					deviceId: blue_class.getInstance().deviceId,
					serviceId: this.service_2,
					characteristicId: this.service2_charactor1,
					value: status_arraybuffer,
					success: (res) => {
						console.log('更改状态成功:', status, res)

						uni.writeBLECharacteristicValue({
							characteristicId: this.service2_charactor2,
							deviceId: blue_class.getInstance().deviceId,
							serviceId: this.service_2,
							value: str2ab(time),
							success: (res2) => {
								console.log('更改播放时长状态成功:', res2)
							}
						})
					},
					fail: (res) => {
						console.log('更改状态失败:', status, res)
					}
				})
			},
			handleValueMessage(characteristic) {
				// 处理消息
				console.log('characteristic value comed:', characteristic)
				console.log('readBLECharacteristicValue:', characteristic.value)
				if (characteristic.serviceId == this.service_1) {
					this.handleHardMessage(characteristic)
				} else if (characteristic.serviceId == this.service_2) {
					this.handlePlayMessage(characteristic)
				} else if (characteristic.serviceId == this.service_3) {
					this.handlePressMessage(characteristic)
				} else if (characteristic.serviceId == this.service_battery) {
					this.handleBatteryMessage(characteristic)
				}
			},
			readMessage(deviceId, serviceId, characteristicId) {
				console.log('readMessage', deviceId, serviceId, characteristicId)

				// 必须在这里的回调才能获取
				uni.onBLECharacteristicValueChange(this.handleValueMessage)

				uni.readBLECharacteristicValue({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: characteristicId,
					success(res) {
						console.log('readBLECharacteristicValue:', res, res.errCode)
					},
					fail(res) {
						console.log('fail!', res)
					}
				})
			},
			handleMessage(res) {
				console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
				let arrayBuffer = new Uint8Array(res.value);

				let info = hexCharCodeToStr(res.value)

				console.log('接收到数据', ab2hex(res.value), info, arrayBuffer.length)
				// 如果收到数据是4个字节,虽然发的是8个字节，但是只有后4个字节有数据
				if (arrayBuffer.length == 4) {

				} else if (arrayBuffer.length == 2) {
					console.log('接收到回复数据2:', ab2hex(res.value))
				} else {

				}

				if (res.serviceId == this.service_1) {
					this.handleHardMessage(res)
				} else if (res.serviceId == this.service_2) {
					this.handlePlayMessage(res)
				} else if (res.serviceId == this.service_3) {
					this.handlePressMessage(res)
				} else if (res.serviceId == this.service_battery) {
					this.handleBatteryMessage(res)
				}

				// if (res.characteristicId == this.service_battery_c1) {
				// 	this.handleBatteryMessage(res)
				// }
			},
			parsePillowStatus(arraybuffer) {

			},
			parsePillowSleepData(array_buffer) {

				blue_class.getInstance().write2tooth(appAnswer(5))

				//解析枕头睡眠阶段状态	
				// 数据1-姿态（U8）(1--平躺，2--侧卧) + 数据2开始时间（T4）+数据3结束时间（T4）+ 数据4-姿态（U8）(1--平躺，2--侧卧) + 数据5开始时间（T4）+数据6结束时间（T4）+ ... ,关于该指令的说明，是多个姿态+开始时间和结束时间的条目的组合，根据数据长度计算一条指令中包含多少组数据
				let receive8 = new ArrayBuffer(array_buffer);
				let dataView = new DataView(receive8)
				console.log('姿态:', dataView.getUint8(0));
				let uint32_s = dataView.getUint32(1);
				let unit32_e = dataView.getUint32(5);
				// parseTime(uint32_s)
				// 秒：0-5bit，分：6-11bit，时：12-16bit，日：17-21bit，月：22-25bit，年：26-31bit），年基于2020，月取值1-12

			},
			// 停止蓝牙
			stopBlueTooth() {
				uni.stopBluetoothDevicesDiscovery({
					success: (res) => {
						console.log("stopBlueTooth success!")
						this.searching = false
					},
					fail: (res) => {
						console.log("stopBlueTooth fail!")
					}
				})
			},

			reconnect() {
				uni.openBluetoothAdapter({
					success: (res) => {
						console.log('startBluetoothDevicesDiscovery')
						// 开始搜索蓝牙设备
						uni.startBluetoothDevicesDiscovery({
							services: [],
							success(res) {
								console.log('startBluetoothDevicesDiscovery success:', res)
								this.searching = true
							}
						})

						uni.getBluetoothAdapterState({
							success: (res) => {
								console.log('getBluetoothAdapterState success!', res)
							}
						})
						// //  50s扫描结束
						// setTimeout(function() {
						// 	that.stopBlueTooth()
						// }, 500000);
					},
					fail(res) {
						// if (res.errCode == 10001) {
						// 	uni.showToast({
						// 		duration: 3000,
						// 		title: '请打开蓝牙'
						// 	})
						// }
						uni.showModal({
							title: '提示',
							content: '请检查手机蓝牙是否打开',
							showCancel: false,
							success: (res) => {
								this.searching = false
							}
						})
					}
				})
			},
			// 连接蓝牙
			connectBlueToothSleepHandler(item) {
				if (this.loginStatus) return;
				uni.showLoading({
					title: '连接蓝牙设备中...',
				})


				let app = getApp();
				let deviceId = item.deviceId;
				if (app.globalData.versionCode == 0 && deviceId == 'deviceId') {
					wx.showToast({
						title: '连接成功',
						icon: 'success',
						duration: 1000
					})
					this.stopBlueTooth();
					app.globalData.deviceId = deviceId;

					blue_class.getInstance().deviceId = deviceId;
					// 链接成功
					blue_class.getInstance().loginSuccess = true;

					console.log('connectBluetooth success!:', deviceId)
					uni.switchTab({
						url: "/pages/index/index"
					})
					return;
				}
				uni.createBLEConnection({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: deviceId,
					success: (res) => {
						wx.showToast({
							title: '连接成功',
							icon: 'success',
							duration: 1000
						})
						this.stopBlueTooth();
						app.globalData.deviceId = deviceId;

						blue_class.getInstance().deviceId = deviceId;
						// 链接成功
						blue_class.getInstance().loginSuccess = true;

						console.log('connectBluetooth success!:', deviceId, res)

						this.findingIndex = 0;

						uni.getBLEDeviceServices({
							deviceId,
							success: (res) => {
								console.log('getBLEDeviceServices res.services:', res
									.services)
								for (let i = 0; i < res.services.length; i++) {
									console.log("service:", res.services[i])
									// 监听变化
									blue_class.getInstance().startValueChange();
									if (res.services[i].isPrimary) {
										this.getBLEDeviceCharacteristics(deviceId,
											this.service_1)
										this.getBLEDeviceCharacteristics(deviceId,
											this.service_2)
										this.getBLEDeviceCharacteristics(deviceId,
											this.service_3)
										this.getBLEDeviceCharacteristics(deviceId,
											this.service_battery)
										break;
									}
								}



							},
							fail: (res) => {
								console.log('getBLEDeviceServices fail:', res)
							}
						})
					},
					fail: (res) => {
						console.log("connectBluetooth fail: ", res)
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			// 获取蓝牙设备某个服务中所有特征值(characteristic)。
			getBLEDeviceCharacteristics(deviceId, serviceId) {
				let that = this
				console.log('getBLEDeviceCharacteristics123:', deviceId, serviceId)
				try {
					uni.getBLEDeviceCharacteristics({
						deviceId: deviceId,
						serviceId: serviceId,
						success: (res) => {
							console.log("%c getBLEDeviceCharacteristics success", "color:red;", res
								.characteristics);
							for (var item in res.characteristics) {
								// 是否支持读
								if (res.characteristics[item].uuid && res.characteristics[item]
									.properties
									.read) {
									that.readMessage(deviceId,
										serviceId,
										res.characteristics[item].uuid)
								}
							}

							if (serviceId == this.service_2) {
								// 开启监听
								blue_class.getInstance().startNotice({
									deviceUUID: deviceId,
									serviceUUID: serviceId,
									notifyUUID: this.service2_charactor3
								})
							} else if (serviceId == this.service_battery) {
								// 开启监听
								blue_class.getInstance().startNotice({
									deviceUUID: deviceId,
									serviceUUID: serviceId,
									notifyUUID: this.service_battery_c1
								})
							}

							// 三个service都读取成功后，跳转首页
							that.findingIndex += 1;
							if (that.findingIndex == 3) {
								// 跳转首页
								uni.switchTab({
									url: "/pages/index/index"
								})
								return;

							}
						},
						fail: (res) => {
							console.log("%c getBLEDeviceCharacteristics fail", "color:red;", res);
						}
					})
				} catch (e) {
					//TODO handle the exception
					console.log('error:', e)
				}
			},
			// 检测是否
			checkConnectList(item) {
				if (this.connectList.indexOf(item.deviceId) > -1) {
					return '../static/SY_01WIEI_IconLY.png'
				}
				return '../static/SY_01WIEI_IconLY.png'
			},
			checkWifiConnectList(item) {
				return ('../static/SY_01WIEI_IconWF.png');
			},
			// 连接枕头
			connectSleepHandler(item) {
				console.log('this', this.$refs)
				this.$refs.ppp.open('bottom')
				this.show = true
				this.currentItem = item;
				return
				uni.navigateTo({
					url: '/pages/initWifi/initWifi'
				})
			},
			change(e) {
				this.show = e.show
			}
		}
	}
</script>
<style lang="scss">
	.main-container {
		background-color: rgb(34, 49, 73);
		height: 100%;

		.topKV {
			width: 100%;
			padding-top: var(--menuButtonTop);
			display: block;
		}

		.info-part {
			margin-top: -160rpx;
		}
	}


	.header {
		height: 80rpx;
	}

	.tips {
		text-align: center;
		color: #fff;
		font-size: 32rpx;
		padding: 20rpx;
	}

	.spetips {
		text-align: left;
		font-size: 32rpx;
		padding: 30rpx;

		position: absolute;
		left: 0;
		right: 0;
		background-color: #ffffff;
		box-shadow: 0rpx 0rpx 20rpx #5B7897;
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.item {
			line-height: 32rpx;
			padding: 5rpx;
			letter-spacing: 1rpx;
			padding-bottom: 20rpx;
		}

		.iconblue {
			width: 30rpx;
			padding: 5rpx;
			margin-right: 10rpx;
		}

	}

	.device-item {
		border: 1px solid #5B7897;
		border-radius: 20rpx;
		margin-left: 41rpx;
		margin-right: 41rpx;
		height: 118rpx;
		line-height: 118rpx;
		display: flex;
		align-items: center;
		background-color: rgb(213, 224, 247);

		.connect-btn {
			width: 225rpx;
			height: 78rpx;
			text-align: center;
			background-color: #5B7897;
			line-height: 78rpx;
			color: white;
			margin: 20rpx;
			border-radius: 25rpx;
		}

		.item-name {
			line-height: 38rpx;
			color: #5B7897;
			font-size: 32rpx;
			padding-left: 30rpx;
			padding-right: 30rpx;
			flex: 1;
			text-overflow: ellipsis;
			overflow: hidden;
			margin-right: auto;
		}

		.blue-tooth {
			width: 80rpx;
			height: 80rpx;
			background-color: white;
			border-radius: 30rpx;
			box-shadow: 0rpx 0rpx 20rpx #5B7897;
			display: flex;
			align-items: center;
			justify-content: center;
			// margin-right: 30rpx;

			image {
				display: inline-block;
				width: 28rpx;
				height: 43rpx;
			}
		}

		.wifi {
			background-color: white;
			border-radius: 30rpx;
			box-shadow: 0rpx 0rpx 20rpx #5B7897;
			display: flex;
			align-items: center;
			justify-content: center;

			width: 80rpx;
			height: 80rpx;

			image {
				display: inline-block;
				width: 42rpx;
				height: 29rpx;
			}
		}
	}

	.uni-popup__wrapper-box {

		display: block;

		position: relative;
		/* iphonex 等安全区设置，底部安全区适配 */

		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

	}

	.device-icon {
		width: 73rpx;
		height: 47rpx;
		margin-left: 5rpx;
	}

	.container {
		background-color: white;
		border-radius: 50rpx 50rpx 0rpx 0rpx;
		position: relative;

		::after {
			content: '';
			display: block;
			clear: both;
		}

		.tip {
			width: 322rpx;
			height: 161rpx;
			position: absolute;
			left: 50%;
			top: -60rpx;
			margin-left: -161rpx;
		}

	}
</style>