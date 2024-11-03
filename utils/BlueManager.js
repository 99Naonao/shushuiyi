import {
	object2Query,
	handPillowFrontState,
	handlePillowDelayState,
	hexStringToArrayBuffer,
	ab2hex,
	hand1Shake,
	write2tooth,
	changeAdjustMode,
	handPillowSideState,
	str2ab,
	parsePillowState
} from '@/common/util.js'
class blue_class {
	static instance = null; // 静态属性，用于存储单例  
	// 私有构造函数，防止外部通过 new 关键字创建实例  
	pillowHeight = 1;
	pillowSideHeight = 2;
	pillowPower = 0;
	chargingStatus = 0; // 0--空闲，1--充电中，2--充电完成

	service_1 = '0001FFE7-6865-6F6E-652D-7A732D717A10';
	service_charactor1 = '0001FFE7-6865-6F6E-652D-7A732D717A11';
	service_charactor2 = '0001FFE7-6865-6F6E-652D-7A732D717A12';
	service_charactor3 = '0001FFE7-6865-6F6E-652D-7A732D717A13';
	service_charactor4 = '0001FFE7-6865-6F6E-652D-7A732D717A14';
	service_2 = '0001FFE7-6865-6F6E-652D-7A732D717A50';
	service2_charactor1 = '0001FFE7-6865-6F6E-652D-7A732D717A51';
	service2_charactor2 = '0001FFE7-6865-6F6E-652D-7A732D717A52';
	service2_charactor4 = '0001FFE7-6865-6F6E-652D-7A732D717A54';
	service_3 = '0001FFE7-6865-6F6E-652D-7A732D717A30';
	service_3_charactor1 = '0001FFE7-6865-6F6E-652D-7A732D717A31';
	service_3_charactor2 = '0001FFE7-6865-6F6E-652D-7A732D717A32';
	service_3_charactor3 = '0001FFE7-6865-6F6E-652D-7A732D717A33';

	constructor() {
		// 初始化蓝牙相关的状态或变量  
		this.bluetoothStatus = null; // 蓝牙状态  
		this.isNotify = false; //用于防止重复启动notify功能
		this.notifyCount = 0; //用于判断启动了几次notify功能
		this.serviceId = '';
		this.deviceName = ''; // 设备名称
		this.version = 0; // 版本号
		this.characteristicId = '6E400004-B5A3-F393-E0A9-E50E24DCCA9E';
		this.deviceId = ''; // 连接的蓝牙id
		this.loginSuccess = false; // 连接成功
	}
	// 静态方法，用于获取蓝牙管理器的实例  
	static getInstance() {
		if (!blue_class.instance) {
			// 如果没有实例，则创建一个新的实例  
			blue_class.instance = new blue_class(); // 注意这里使用了 private constructor  
		}
		return blue_class.instance;
	}


	setPillowCharging(value) {
		this.chargingStatus = value;
		console.log('PillowCharging:', this.chargingStatus)
	}

	getPillowCharging() {
		return this.chargingStatus
	}

	setPillowHeight(value) {
		this.pillowHeight = value;
		console.log('setPillowHeight:', this.pillowHeight)
	}

	getPillowHeight() {
		console.log('getPillowHeight:', this.pillowHeight)
		return this.pillowHeight;
	}

	setPillowSideHeight(value) {
		this.pillowSideHeight = value;
	}

	getPillowSideHeight() {
		return this.pillowSideHeight;
	}
	setPillowPower(value) {
		this.pillowPower = value;
		uni.$emit('update_pillow_info')
	}

	getPillowPower() {
		return this.pillowPower;
	}

	// 初始化蓝牙适配器  
	// 注意：这个方法应该是公开的，但不应该在构造函数中调用  
	initBluetoothAdapter() {
		// 这里使用uni.openBluetoothAdapter等API来初始化蓝牙适配器  
		uni.openBluetoothAdapter({
			success: (res) => {
				console.log('蓝牙适配器初始化成功', res);
				this.bluetoothStatus = 'open'; // 更新蓝牙状态  
			},
			fail: (err) => {
				console.error('蓝牙适配器初始化失败', err);
				this.bluetoothStatus = 'error'; // 更新蓝牙状态  
			}
		});
	}

	// ArrayBuffer转16进度字符串示例
	ab2hex(buffer) {
		const hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join('')
	}

	//监听设备发送数据
	onBLECharacteristicValueChange() {
		uni.onBLECharacteristicValueChange((res) => {
			let arrayBuffer = new Uint8Array(res.value);
			console.log('[接收到数据]', this.ab2hex(res.value), arrayBuffer.length)
			// var resData = this.ab2hex(sjRes.value);
			uni.$emit('xx', res);
		})
	}
	updateDeviceName(dname) {
		this.deviceName = dname;
	}
	updateVersion(v) {
		this.version = v;
	}
	startValueChange() {
		this.onBLECharacteristicValueChange();
	}
	// 启用 notify 功能
	startNotice(uuid) {
		// 预防重复启动
		if (this.isNotify) {
			console.log('已经启用过 notify 功能');
		} else {
			this.onBLECharacteristicValueChange();
			uni.notifyBLECharacteristicValueChange({
				state: true, // 启用 notify 功能
				deviceId: uuid.deviceUUID,
				serviceId: uuid.serviceUUID,
				characteristicId: uuid.notifyUUID,
				success: (res) => {
					// store.state.notyfiyFlagList.push(uuid);
					console.log('成功启用 notify 功能', uuid);
					this.isNotify = true;
					// 启动一次notify，就加1
					this.notifyCount = this.notifyCount + 1;
					this.serviceId = uuid.serviceUUID;
					this.deviceId = uuid.deviceUUID;

				},
				fail: (res) => {
					console.log('启用 notify 功能失败', res)
				}
			});
		}
	}
	write2tooth(buffer) {
		let deviceId = this.deviceId;
		let serviceId = this.serviceId;
		let characteristicId = this.characteristicId;
		console.log('write2tooth,deviceId:,', deviceId, ',serviceId:,' + serviceId,
			',characteristicId:,' + characteristicId, 'arraybuffer:', this.ab2hex(buffer))
		// 向蓝牙设备发送一个0x00的16进制数据
		uni.writeBLECharacteristicValue({
			// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
			deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId,
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId,
			// 这里的value是ArrayBuffer类型
			value: buffer,
			writeType: 'write',
			success(res) {
				// resolve(res)
				console.log('writeBLECharacteristicValue success', res)
			},
			fail() {
				console.log('writeBLECharacteristicValue fail')
				// reject()
			}
		})
	}
	// 更改强度
	changeStrongMode(status) {
		let status_arraybuffer = str2ab(status);
		console.log("[changeStrongMode]", status, str2ab(status))
		// 更改播放模式
		uni.writeBLECharacteristicValue({
			deviceId: blue_class.getInstance().deviceId,
			serviceId: this.service_2,
			characteristicId: this.service2_charactor4,
			value: status_arraybuffer,
			success: (res) => {
				console.log('更改强度值成功:', status, res)
				uni.writeBLECharacteristicValue({
					characteristicId: this.service2_charactor4,
					deviceId: blue_class.getInstance().deviceId,
					serviceId: this.service_2,
					value: str2ab(time),
					success: (res2) => {
						console.log('更改强度值成功:', res2)
					}
				})
			},
			fail: (res) => {
				console.log('更改强度值失败:', status, res)
			}
		})
	}
	// 更改压力值
	changeStressMode(status) {
		let status_arraybuffer = str2ab(status);
		console.log("[changeStressMode]", status, str2ab(status))
		// 更改播放模式
		uni.writeBLECharacteristicValue({
			deviceId: blue_class.getInstance().deviceId,
			serviceId: this.service_3,
			characteristicId: this.service3_charactor3,
			value: status_arraybuffer,
			success: (res) => {
				console.log('更改压力值成功:', status, res)
				uni.writeBLECharacteristicValue({
					characteristicId: this.service3_charactor3,
					deviceId: blue_class.getInstance().deviceId,
					serviceId: this.service_3,
					value: str2ab(time),
					success: (res2) => {
						console.log('更改压力值成功:', res2)
					}
				})
			},
			fail: (res) => {
				console.log('更改压力值失败:', status, res)
			}
		})
	}
	// 更改模式
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
	}
}
export default blue_class;