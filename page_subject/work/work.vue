<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title='连接设备'></z-nav-bar>
	<public-module></public-module>
	<!-- <page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta> -->
	<view class="work-page" :style="menuStyle">
		<view class="work-hero">
			<view class="work-hero-title">连接设备</view>
			<view class="work-hero-desc">请确保助眠仪已开机并靠近手机</view>
		</view>
		<view class="work-body">
			<view class="section-header">
				<text class="section-title">附近设备</text>
				<text class="section-count" v-if="deviceIdList.length">{{ deviceIdList.length }} 台</text>
			</view>
			<view class="empty-state" v-if="deviceIdList.length == 0">
				<view class="empty-icon">◎</view>
				<text class="empty-text">正在搜索设备...</text>
				<text class="empty-hint">长按震动键 3 秒开启蓝牙</text>
			</view>
			<view v-for="(item,index) in deviceIdList" :key="index" class="device-card">
				<view class="device-left">
					<image class="device-icon" mode="widthFix" src="/page_subject/static/work/SMY_04_IconYJ.png"></image>
				</view>
				<view class="device-info">
					<text class="device-name">{{item.name}}</text>
					<view class="device-status">
						<image class="ble-icon" mode="widthFix" :src="checkConnectList(item)"></image>
						<text>蓝牙设备</text>
					</view>
				</view>
				<view class="device-connect" :class="{connected: loginStatus}" @click="connectBlueToothSleepHandler(item)">
					{{loginStatus?'已连接':'连接'}}
				</view>
			</view>
		</view>
		<view class="work-footer">
			<image class="footer-icon" mode="widthFix" src="../../static/SY_01_IconLY.png"></image>
			<text class="footer-text">助眠仪基本功能需要通过蓝牙连接使用</text>
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
				connecting: false, // 是否正在连接
				maxConnectRetry: 2, // 连接失败最大重试次数
				rescanTimer: null,
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
			app.globalData.activeWorkPage = this
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 80) + 'px');
			this.loginStatus = blue_class.getInstance().loginSuccess

			if (blue_class.getInstance().deviceName != '' && this.deviceIdList.length === 0) {
				this.deviceIdList = [{
					name: blue_class.getInstance().deviceName,
					deviceId: blue_class.getInstance().deviceId
				}];
			} else if (app.globalData.versionCode == 0 && this.deviceIdList.length === 0) {
				this.deviceIdList.push({
					name: this.testName,
					deviceId: 'deviceId'
				});
			}
			if (!this.loginStatus) {
				this.startBluetoothScan()
			}
			uni.$on('xx', this.handleMessage)
			// 监听低功耗蓝牙设备的特征值变化事件.必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
			// uni.onBLECharacteristicValueChange(this.handleMessage)
		},
		onHide() {
			this.onShowing = false;
			this.stopBlueTooth()
			uni.$off('xx', this.handleMessage)
		},
		onUnload() {
			this.clearRescanTimer()
			this.connecting = false
			this.stopBlueTooth()
			const app = getApp()
			if (app.globalData.activeWorkPage === this) {
				app.globalData.activeWorkPage = null
			}
		},
		onLoad() {
			const app = getApp()
			if (!app.globalData.bleDeviceFoundRegistered) {
				app.globalData.bleDeviceFoundRegistered = true
				uni.onBluetoothDeviceFound((result) => {
					const page = app.globalData.activeWorkPage
					if (page && page.onShowing) {
						page.handleDeviceFound(result)
					}
				})
			}
		},

		methods: {
			handleDeviceFound(result) {
				let isnotexist = true
				let devices = result.devices || []
				if (result.devices && result.devices.length) {
					const device = result.devices[0]
					if (device.advertisData) {
						device.advertisData = ab2hex(device.advertisData)
					} else {
						device.advertisData = ''
					}
					for (let i = 0; i < this.deviceIdList.length; i++) {
						if (device.deviceId == this.deviceIdList[i].deviceId) {
							isnotexist = false
						}
					}
					if (isnotexist && device.name != '' && device.name.indexOf('zzZMinga') > -1) {
						this.deviceIdList.push(device)
					}
				} else if (result[0]) {
					const device = result[0]
					if (device.advertisData) {
						device.advertisData = ab2hex(device.advertisData)
					} else {
						device.advertisData = ''
					}
					for (let i = 0; i < this.deviceIdList.length; i++) {
						if (device.deviceId == this.deviceIdList[i].deviceId) {
							isnotexist = false
						}
					}
					if (isnotexist && device.name != '' && device.name.indexOf('zzZMinga') > -1) {
						this.deviceIdList.push(device)
					}
				}
				console.log('new device list has founded', devices.length, devices)
			},
			startBluetoothScan() {
				if (this.searching || this.loginStatus) return
				blue_class.getInstance().ensureBluetoothAdapter().then(() => {
					uni.startBluetoothDevicesDiscovery({
						services: [],
						allowDuplicatesKey: true,
						success: () => {
							console.log('startBluetoothDevicesDiscovery success')
							this.searching = true
						},
						fail: (err) => {
							console.log('startBluetoothDevicesDiscovery fail', err)
							if (err.errCode === -1) {
								this.searching = true
							}
						}
					})
				}).catch(() => {
					uni.showModal({
						title: '权限不足提示',
						content: '请检查小程序是否授予蓝牙权限',
						showCancel: false
					})
				})
			},
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
			clearRescanTimer() {
				if (this.rescanTimer) {
					clearInterval(this.rescanTimer)
					this.rescanTimer = null
				}
			},
			prepareBleConnection(deviceId) {
				return new Promise((resolve) => {
					uni.stopBluetoothDevicesDiscovery({
						complete: () => {
							this.searching = false
							uni.closeBLEConnection({
								deviceId,
								complete: () => {
									setTimeout(resolve, 300)
								}
							})
						}
					})
				})
			},
			rescanDevice(deviceId) {
				return new Promise((resolve, reject) => {
					this.clearRescanTimer()
					blue_class.getInstance().ensureBluetoothAdapter().then(() => {
					uni.startBluetoothDevicesDiscovery({
						services: [],
						allowDuplicatesKey: true,
						success: () => {
							this.searching = true
							let elapsed = 0
							this.rescanTimer = setInterval(() => {
								uni.getBluetoothDevices({
									success: (res) => {
										const found = (res.devices || []).find(item => item.deviceId === deviceId)
										if (found) {
											this.clearRescanTimer()
											uni.stopBluetoothDevicesDiscovery({
												complete: () => {
													this.searching = false
													resolve(found)
												}
											})
										}
									}
								})
								elapsed += 500
								if (elapsed >= 5000) {
									this.clearRescanTimer()
									uni.stopBluetoothDevicesDiscovery({
										complete: () => {
											this.searching = false
											reject({
												errMsg: '未搜索到设备，请确认设备已开机并在附近'
											})
										}
									})
								}
							}, 500)
						},
						fail: (err) => {
							reject(err)
						}
					})
					}).catch(reject)
				})
			},
			showConnectFailModal(content) {
				uni.showModal({
					title: '连接失败',
					content: content || '请确认助眠仪已开机、距离手机较近，并重试',
					showCancel: false
				})
			},
			onBleConnectSuccess(deviceId, item) {
				let app = getApp()
				wx.showToast({
					title: '连接成功',
					icon: 'success',
					duration: 1000
				})
				this.stopBlueTooth()
				app.globalData.deviceId = deviceId
				if (item && item.name) {
					blue_class.getInstance().updateDeviceName(item.name)
				}
				blue_class.getInstance().deviceId = deviceId
				blue_class.getInstance().loginSuccess = true
				this.loginStatus = true
				this.connecting = false
				console.log('connectBluetooth success!:', deviceId)
				this.findingIndex = 0
				uni.getBLEDeviceServices({
					deviceId,
					success: (res) => {
						console.log('getBLEDeviceServices res.services:', res.services)
						for (let i = 0; i < res.services.length; i++) {
							console.log("service:", res.services[i])
							blue_class.getInstance().startValueChange()
							if (res.services[i].isPrimary) {
								this.getBLEDeviceCharacteristics(deviceId, this.service_1)
								this.getBLEDeviceCharacteristics(deviceId, this.service_2)
								this.getBLEDeviceCharacteristics(deviceId, this.service_3)
								this.getBLEDeviceCharacteristics(deviceId, this.service_battery)
								break
							}
						}
					},
					fail: (res) => {
						console.log('getBLEDeviceServices fail:', res)
					}
				})
			},
			doCreateBLEConnection(deviceId, item, retryCount = 0) {
				uni.showLoading({
					title: retryCount > 0 ? `正在重试连接(${retryCount}/${this.maxConnectRetry})...` : '连接蓝牙设备中...',
				})
				uni.createBLEConnection({
					deviceId,
					timeout: 10000,
					success: () => {
						uni.hideLoading()
						this.onBleConnectSuccess(deviceId, item)
					},
					fail: (res) => {
						console.log("connectBluetooth fail: ", res, 'retryCount:', retryCount)
						if ((res.errCode === 10003 || res.errCode === 10012) && retryCount < this.maxConnectRetry) {
							uni.hideLoading()
							this.prepareBleConnection(deviceId).then(() => {
								return this.rescanDevice(deviceId)
							}).then(() => {
								this.doCreateBLEConnection(deviceId, item, retryCount + 1)
							}).catch((err) => {
								this.connecting = false
								uni.hideLoading()
								this.showConnectFailModal(err && err.errMsg)
							})
							return
						}
						if (res.errCode === -1) {
							uni.hideLoading()
							this.onBleConnectSuccess(deviceId, item)
							return
						}
						this.connecting = false
						uni.hideLoading()
						this.showConnectFailModal()
					}
				})
			},

			reconnect() {
				this.startBluetoothScan()
			},
			// 连接蓝牙
			connectBlueToothSleepHandler(item) {
				if (this.loginStatus || this.connecting) return

				let app = getApp()
				let deviceId = item.deviceId
				if (app.globalData.versionCode == 0 && deviceId == 'deviceId') {
					wx.showToast({
						title: '连接成功',
						icon: 'success',
						duration: 1000
					})
					this.stopBlueTooth()
					app.globalData.deviceId = deviceId
					blue_class.getInstance().deviceId = deviceId
					blue_class.getInstance().loginSuccess = true
					this.loginStatus = true
					console.log('connectBluetooth success!:', deviceId)
					uni.switchTab({
						url: "/pages/index/index"
					})
					return
				}
				this.connecting = true
				this.prepareBleConnection(deviceId).then(() => {
					this.doCreateBLEConnection(deviceId, item, 0)
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
	@import '@/common/theme.scss';

	.work-page {
		min-height: 100vh;
		background: $be-bg-page;
		padding-top: var(--menuButtonTop);
	}

	.work-hero {
		background: linear-gradient(160deg, $be-primary-dark, $be-primary);
		margin: 0 32rpx;
		border-radius: $be-radius-lg;
		padding: 40rpx 36rpx;
		box-shadow: $be-shadow-md;
	}

	.work-hero-title {
		font-size: 40rpx;
		font-weight: 700;
		color: $be-text-inverse;
	}

	.work-hero-desc {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.65);
		margin-top: 12rpx;
	}

	.work-body {
		padding: 32rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 600;
		color: $be-text-primary;
	}

	.section-count {
		font-size: 24rpx;
		color: $be-text-muted;
	}

	.empty-state {
		@include be-card;
		margin: 0;
		padding: 64rpx 32rpx;
		text-align: center;
	}

	.empty-icon {
		font-size: 64rpx;
		color: $be-primary-light;
		opacity: 0.5;
		margin-bottom: 16rpx;
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.empty-text {
		display: block;
		font-size: 30rpx;
		color: $be-text-secondary;
		margin-bottom: 8rpx;
	}

	.empty-hint {
		display: block;
		font-size: 24rpx;
		color: $be-text-muted;
	}

	.device-card {
		@include be-card;
		margin: 0 0 20rpx;
		padding: 24rpx 28rpx;
		display: flex;
		align-items: center;
	}

	.device-left {
		width: 80rpx;
		height: 80rpx;
		background: $be-surface-soft;
		border-radius: $be-radius-md;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.device-icon {
		width: 56rpx;
		height: 36rpx;
	}

	.device-info {
		flex: 1;
		min-width: 0;
	}

	.device-name {
		font-size: 30rpx;
		font-weight: 600;
		color: $be-text-primary;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.device-status {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
		font-size: 24rpx;
		color: $be-text-muted;
	}

	.ble-icon {
		width: 20rpx;
		height: 28rpx;
		margin-right: 8rpx;
	}

	.device-connect {
		flex-shrink: 0;
		padding: 16rpx 32rpx;
		background: linear-gradient(135deg, $be-primary-light, $be-primary);
		color: $be-text-inverse;
		font-size: 26rpx;
		font-weight: 500;
		border-radius: $be-radius-pill;
	}

	.device-connect.connected {
		background: $be-success;
	}

	.work-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: $be-surface;
		padding: 24rpx 40rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		display: flex;
		align-items: center;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	}

	.footer-icon {
		width: 28rpx;
		height: 36rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}

	.footer-text {
		font-size: 24rpx;
		color: $be-text-secondary;
		line-height: 1.5;
	}
</style>