<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title=''></z-nav-bar>
	<view class="main">
		<view class="select-part" :style="menuStyle">
			<view class="border">

				<view class="title">选择助眠模式</view>
				<view class="flex space-round">
					<image @click="selectMode(1)" mode="widthFix" class="icon2" :src="timeIndex==1?fiveSelected:five">
					</image>
					<image @click="selectMode(2)" mode="widthFix" class="icon2" :src="timeIndex==2?tenSelected:ten">
					</image>
					<image @click="selectMode(3)" mode="widthFix" class="icon2"
						:src="timeIndex==3?twentySelected:twenty">
					</image>
				</view>
			</view>
		</view>
		<view class="" style="text-align: center;">
			上次选择手法:{{hand_name}}
		</view>
		<view class="info-part">
			<view class="info-second-part">
				<view class="item flex">
					<view class="flex1">
						<view class='desc1'>平补平泻手法</view>
						<view class='desc2'>新手建议模式，本手法非常舒适</view>
					</view>
					<switch :checked="mode_one" @change="(v)=>{
						closeOthers()
						mode_one = v.detail.value
						hand_name = '平补平泻.qzd'
					}"></switch>
				</view>
				<view class="item flex">
					<view class="flex1">
						<view class='desc1'>补法</view>
						<view class='desc2'>适合失眠多梦阳气失衡的用户</view>
					</view>
					<switch :checked="mode_two" @change="(v)=>{
						closeOthers()
						mode_two = v.detail.value;
						hand_name = '补法.qzd'
					}"></switch>
				</view>
				<view class="item flex">
					<view class="flex1">
						<view class='desc1'>泻法</view>
						<view class='desc2'>适合盗汗气虚怕冷体质的用户</view>
					</view>
					<switch :checked="mode_three" @change="(v)=>{
						closeOthers()
						mode_three = v.detail.value
						hand_name = '泻法.qzd'
					}"></switch>
				</view>
				<view class="item flex">
					<view class="flex1">
						<view class='desc1'>专业浅针师手法</view>
						<view class='desc2'>享受中国浅针大师的独特手法</view>
					</view>
					<switch :checked="mode_four" @change="(v)=>{
						closeOthers()
						mode_four = v.detail.value
						hand_name = '手法z.qzs'
					}"></switch>
				</view>
			</view>

		</view>
		<view class="opt-part">
			<view class="opt-btn opt-btn-top" @click="nextStepHandle">
				<label>下一步</label>
			</view>
		</view>



	</view>

</template>

<script>
	import blue_class from '../../utils/BlueManager'
	import {
		object2Query,
		parsePillowRealState,
		handPillowStatus,
		handPillowSideState,
		handPillowFrontState,
		handlePillowDelayState,
		hexStringToArrayBuffer,
		ab2hex,
		resetPillow,
		uploadDataRequest,
		initPillow,
		changeAdjustMode,
		changeSaveAdjustMode,
		hand1Shake,
		write2tooth,
		parsePillowState
	} from '@/common/util.js'
	import {
		version
	} from 'vue'
	import {
		appAnswer,
		restartPillow
	} from '../../common/util'
	export default {
		components: {},
		data() {
			return {
				five: '../static/adjust/SMY_05_Icon5Ma.png',
				fiveSelected: '../static/adjust/SMY_05_Icon5Mb.png',
				ten: '../static/adjust/SMY_05_Icon10Mb.png',
				tenSelected: '../static/adjust/SMY_05_Icon10Ma.png',
				twenty: '../static/adjust/SMY_05_Icon20Mb.png',
				twentySelected: '../static/adjust/SMY_05_Icon20Ma.png',
				mode_one: true,
				mode_two: false,
				mode_three: false,
				mode_four: false,
				hand_name: '空',
				timeIndex: 0,
				menuStyle: {},
				inputName: '模式',
				pillowVersion: '固件版本:0.1',
				pillowStatus: '未连接',
				pillowStatusNum: 0, // 枕头状态
				saveOptions: {},
				showMeasure: false, // 是否显示信息
				touchingDown: false,
				touchingUp: false,
				deviceId: '', // 连接的蓝牙id
				serviceId: '', // 连接的服务id
				time: 0,
			}
		},
		computed: {

		},
		onLoad(options) {
			console.log('options:', options)
			this.pillowName = decodeURIComponent(options.pillowName || '')
			this.deviceId = options.deviceId || ''
			this.serviceId = options.serviceId || ''

			this.saveOptions = options;
			blue_class.getInstance().updateDeviceName(this.pillowName);
			uni.setNavigationBarTitle({
				title: this.pillowName
			})
		},
		onShow() {
			// 监听低功耗蓝牙设备的特征值变化事件.必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
			// uni.onBLECharacteristicValueChange(this.handleMessage)
			uni.$on('xx', this.handleMessage);
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 20) + 'px');
			console.log('app.globalData.top:', app.globalData)

			let last_hand_name = blue_class.getInstance().getHandStyle();
			this.hand_name = last_hand_name;

			if (this.hand_name == '平补平泻.qzd') {
				this.mode_one = true;
			} else if (this.hand_name == '补法.qzd') {
				this.mode_two = true;
			} else if (this.hand_name == '泻法.qzd') {
				this.mode_three = true;
			} else if (this.hand_name == '手法z.qzs') {
				this.mode_four = true;
			} else {
				this.hand_name = '空'
			}

			this.time = 0;
		},
		onUnload() {
			console.log('adjust on onUnload!')

			uni.$off('xx', this.handleMessage);
		},
		onHide() {
			console.log('adjust on hide!')

			uni.$off('xx', this.handleMessage);
		},
		methods: {
			closeOthers() {
				this.mode_four = false;
				this.mode_three = false;
				this.mode_two = false;
				this.mode_one = false;
			},
			modeChange(value) {
				console.log('value:', value)
			},
			nextStepHandle() {
				if (this.time == 0) {
					uni.showToast({
						title: '先选择时长'
					})
					return;
				}
				if (this.mode_one || this.mode_four || this.mode_three || this.mode_two) {
					uni.navigateTo({
						url: "/page_subject/play/play"
					})

					blue_class.getInstance().changePlayFile(this.hand_name, () => {
						blue_class.getInstance().changeMode('start', this.time);
					});
				} else {
					uni.showToast({
						title: '请选择手法'
					})
				}
			},
			selectMode(index) {
				// 选择模式
				if (index == 1) {
					this.time = 5 * 60;
					this.timeIndex = 1;
				} else if (index == 2) {
					this.time = 10 * 60;
					this.timeIndex = 2;
				} else if (index == 3) {
					this.time = 20 * 60
					this.timeIndex = 3;
				}
				console.log('timeIndex', index)
			},
			uploadDataHandle() {
				let upload_data = uploadDataRequest(5)
				blue_class.getInstance().write2tooth(upload_data)
			},

			// 请求枕头状态
			requestStatus() {
				let shake1 = handPillowStatus()
				blue_class.getInstance().write2tooth(shake1)
			},

			// 关闭
			closeSave() {
				this.$refs.popupSave.close();
			},
			saveHandler() {
				let changeAdjust = changeSaveAdjustMode();
				blue_class.getInstance().write2tooth(changeAdjust);
				uni.showToast({
					title: '保存中',
					success() {
						uni.switchTab({
							url: '/pages/status/status'
						})
					}
				})
				// uni.navigateBack()
			},
			handleMessage(res) {
				// console.log(`value:`, res.value)
				let arrayBuffer_res = new Uint8Array(res.value);
				// let arrayBuffer_DateView = new DataView(arrayBuffer_res);
				let mark = arrayBuffer_res[0];
				console.log('handleMessage 接收到数据 mark:', parseInt(mark))
				let length = arrayBuffer_res[1];
				console.log('handleMessage 接收到数据 length:', parseInt(length))
				let arrayBuffer = new ArrayBuffer(length);
				let receive_dataView = new DataView(arrayBuffer);
				for (var index = 0; index < arrayBuffer.byteLength; index++) {
					receive_dataView.setUint8(index, arrayBuffer_res[index + 2])
				}
				console.log('handleMessage adjust 接收到数据', ab2hex(res.value), mark, arrayBuffer.length);
				switch (parseInt(mark)) {
					case 1:
						let result = receive_dataView.getUint8(0)
						switch (parseInt(result)) {
							case 0:
								console.log("[调整模式成功]")
								break;
							case 1:
								console.log("[调整模式参数非法]")
								break;
							case 2:
								console.log("[不支持的指令]")
								break;
						}
						break;
					case 2:
						break;
					case 4:
						let result4 = receive_dataView.getUint8(0)
						switch (parseInt(result4)) {
							case 0:
								console.log("[调整枕头成功]")
								break;
							case 1:
								console.log("[调整模式参数非法]")
								break;
							case 2:
								console.log("[不支持的指令]")
								break;
						}
						break;
					case 5:
						this.parsePillowSleepData(arrayBuffer)
						break;
					case 6:
						this.parsePillowStatus(arrayBuffer)
						break;
					case 88:
						break;
				}
				return;
				// 如果收到数据是4个字节,虽然发的是8个字节，但是只有后4个字节有数据
				if (arrayBuffer.length == 4) {
					let receive16 = ab2hex(res.value);
					let ask = receive16.slice(0, 2);
					let len = receive16.slice(2, 4);
					let result = receive16.slice(4, 6);
					let mark = receive16.slice(6, 8);

					console.log('数据长度:', len, result, ('0x' + result).toString(10), mark)
					//指令应答
					if (mark == '33') {
						switch (parseInt(ask)) {
							case 1:
								console.log('33 => 1:', result);
								break;
							case 4:
								console.log('33 => 4:', result);
								break;
						}
					}
				} else if (arrayBuffer.length == 2) {
					let receive16 = ab2hex(res.value);
					let mark = receive16.slice(2, 4)
					let len = receive16.slice(0, 2)
					console.log('接收到回复数据:', mark, len)
					if (mark == '55') {
						console.log('接收到回复数据', ab2hex(res.value))
						console.log('校验长度', parseInt('0x' + len))
						console.log('握手成功可以发送ssid了')
						write2tooth(this.deviceId, this.serviceId, this.characteristicStringId,
							hexStringToArrayBuffer('jimlee'))
					} else if (mark == '66') {
						console.log('握手成功可以发送ssid密码了')
						// 发送wifi密码
						write2tooth(this.deviceId, this.serviceId, this.characteristicStringId,
							hexStringToArrayBuffer('lijiming'))
					} else if (mark == 'aa') {
						console.log('发送成功了ssid了')
					} else if (mark == '33') {
						console.log('收到成功调整枕头')
						console.log('8个字节指令的校验和', parseInt('0x' + len))
					}
				} else if (arrayBuffer.length == 8) {
					// //默认是枕头状态 5s收到一次
					let receive16 = ab2hex(res.value);
					// （0：0--空闲，1--平躺，2--侧卧；1：（备用）2：头部气囊高度值；3：颈部气囊高度值；4:固件版本； 5是否校准；6~7：电池电压值）
					let status = receive16.slice(0, 2);
					let status1 = '0x' + status;

					let status10 = parseInt(status1);
					switch (status10) {
						case 0:
							console.log('枕头空闲状态')
							break;
						case 1:
							console.log('枕头平躺状态')
							break;
						case 2:
							console.log('枕头侧卧状态')
							break;
					}
					let headHeight = receive16.slice(4, 6);
					let headHeight10 = parseInt('0x' + headHeight);
					let neckHeight = receive16.slice(6, 8);
					let neckHeight10 = parseInt('0x' + neckHeight);
					let vesrion = receive16.slice(8, 10);
					let vesrion10 = parseInt('0x' + vesrion);
					let isright = receive16.slice(10, 12);
					let isright10 = parseInt('0x' + isright);
					let press = receive16.slice(12, 14);
					let press10 = parseInt('0x' + press);

					this.head = headHeight10;
					this.neck = neckHeight10;
				}
			},
			parsePillowStatus(arraybuffer) {
				// //默认是枕头状态 5s收到一次
				let receive16 = ab2hex(arraybuffer);
				// （0：0--空闲，1--平躺，2--侧卧；1：（备用）2：头部气囊高度值；3：颈部气囊高度值；4:固件版本； 5是否校准；6~7：电池电压值）
				let status = receive16.slice(0, 2);
				let status1 = '0x' + status;

				let status10 = parseInt(status1);
				this.pillowStatusNum = status10;
				switch (status10) {
					case 0:
						console.log('枕头空闲状态');
						this.pillowStatus = '枕头空闲状态';
						this.selectIndex = 1;
						break;
					case 1:
						console.log('枕头平躺状态')
						this.pillowStatus = '枕头平躺状态';
						this.selectIndex = 1;
						break;
					case 2:
						console.log('枕头侧卧状态')
						this.pillowStatus = '枕头侧卧状态';
						this.selectIndex = 2;
						break;
				}

				let detail_status_16 = receive16.slice(2, 4);
				let detail_status = '0x' + detail_status_16;
				let n1 = (detail_status & 0x03);
				// 0--空闲，1--充电中，2--充电完成
				switch (n1) {
					case 0:
						console.log('枕头在空闲状态');
						break;
					case 1:
						console.log('枕头在充电中状态');
						break;
					case 2:
						console.log('枕头在充电完成状态');
						break;
				}
				let n2 = (detail_status >> 2) & 0x01;
				console.log('泵1电流:', n2);
				let n3 = (detail_status >> 3) & 0x01;
				console.log('泵2电流:', n3);
				let n4 = (detail_status >> 4) & 0x01;
				console.log('气囊1升高超时:', n4);
				let n5 = (detail_status >> 5) & 0x01;
				console.log('气囊2升高超时:', n5);
				let n6 = (detail_status >> 6) & 0x01;
				console.log('气囊1气压超高:', n6);
				let n7 = (detail_status >> 7) & 0x01;

				let headHeight = receive16.slice(4, 6);
				let headHeight10 = parseInt('0x' + headHeight);
				let neckHeight = receive16.slice(6, 8);
				let neckHeight10 = parseInt('0x' + neckHeight);
				let vesrion = receive16.slice(8, 10);
				let vesrion10 = parseInt('0x' + vesrion);
				let isright = receive16.slice(10, 12);
				let isright10 = parseInt('0x' + isright);
				let press = receive16.slice(12, 16);
				let press10 = parseInt('0x' + press);
				blue_class.getInstance().setPillowCharging(n1)
				blue_class.getInstance().setPillowHeight(headHeight10)
				blue_class.getInstance().setPillowSideHeight(neckHeight10)
				blue_class.getInstance().setPillowPower(press10)
				console.log('adjust12 =>', status, headHeight, neckHeight, vesrion, isright, press)
				console.log('adjust12 mm=>', status10, headHeight10 + 'mm', neckHeight10 + 'mm', 'v:' + vesrion10,
					isright10,
					press10)
			},
			// 调低枕头
			adjustLowSleepHandler() {
				this.touchingDown = true
				let action = 2
				let arraybuffer
				// 如果选择的仰卧
				if (this.selectIndex == 1) {
					// 如果选择的是调整头枕
					if (this.selectHead) {
						// this.head -= 1
						if (this.head <= 0) {
							this.head = 0
						}
					} else {
						// this.neck -= 1
						if (this.neck <= 0) {
							this.neck = 0
						}
					}
					arraybuffer = handPillowFrontState(action, this.selectHead)
					console.log('调低仰卧:', this.selectHead ? '调整头部' : '调整颈部', action, ab2hex(arraybuffer))
				} else {
					// 如果选择的侧卧
					if (this.selectHead) {
						// this.sideHead -= 1
						if (this.sideHead <= 0) {
							this.sideHead = 0
						}
					} else {
						// this.sideNeck -= 1
						if (this.sideNeck <= 0) {
							this.sideNeck = 0
						}
					}
					arraybuffer = handPillowFrontState(action, this
						.selectHead)
					console.log('调低侧卧:', action, ab2hex(arraybuffer))
				}
				// console.log('调低:', ab2hex(arraybuffer))
				blue_class.getInstance().write2tooth(arraybuffer)
			},
			stopAdjustHighHandler() {
				this.touchingDown = false;
				this.touchingUp = false;
				// 停止调节枕头
				// 如果选择的仰卧
				let action = 0
				let arraybuffer = null;
				if (this.selectIndex == 1) {
					if (this.selectHead) {
						// this.head += 1
						if (this.head >= 100) {
							this.head = 100
						}
					} else {
						// this.neck += 1
						if (this.neck >= 100) {
							this.neck = 100
						}
					}
					arraybuffer = handPillowFrontState(action, this.selectHead)
					console.log('停止调节仰卧:', action, ab2hex(arraybuffer))
				} else {
					if (this.selectHead) {
						// this.sideHead += 1
						if (this.sideHead >= 100) {
							this.sideHead = 100
						}
					} else {
						// this.sideNeck += 1
						if (this.sideNeck >= 100) {
							this.sideNeck = 100
						}
					}
					// 如果选择的侧卧
					arraybuffer = handPillowFrontState(action, this
						.selectHead)
					console.log('停止调节侧卧:', action, ab2hex(arraybuffer))
				}
				// console.log('调高:', ab2hex(arraybuffer))
				blue_class.getInstance().write2tooth(arraybuffer)
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep(.input-part) {
		bottom: 0 !important;
	}

	.selected {
		background-color: #1c4485;
	}

	.unselect-btn {
		background-color: #d5e0f7 !important;
		color: #354D5B !important;
	}

	.version {
		width: 100%;
		text-align: center;
		font-size: 18rpx;
	}

	.icon-border {
		border: #003C71 2px solid;
		border-radius: 50%;
	}

	.select-btn {
		background-color: rgb(28, 68, 133);
		width: 284rpx;
		height: 90rpx;
		border-radius: 20rpx;
		color: white;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.icon1 {
			width: 61rpx;
			height: 36rpx;
		}

	}

	.icon2 {
		width: 141rpx;
		height: 141rpx;
	}

	.normal-btn {
		background-color: rgb(255, 255, 255);
		width: 284rpx;
		height: 90rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.icon1 {
			width: 61rpx;
			height: 36rpx;
		}

		.icon2 {
			width: 61rpx;
			height: 41rpx;
		}

	}

	.resetbtn {
		padding: 5rpx;
		color: white;
		background-color: rgb(109, 0, 1);
	}

	.main {
		background-color: rgb(221, 224, 226);

		width: 100%;
		height: 100%;

		.select-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.border {
				background-color: #eff2f6;
				border-radius: 38rpx;

				margin: 32rpx;

				.title {
					padding: 20rpx;
					text-align: center;
					width: 100%;
				}
			}

		}

		.info-part {
			background-color: #eff2f6;
			border-radius: 38rpx;

			margin: 32rpx;
			padding-bottom: 20rpx;
			padding-top: 16rpx;

			.info-second-part {
				position: relative;
				margin: 0 auto;
				width: 634rpx;
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				// padding: 18rpx;
				color: #5B7897;
				background-color: #eff2f6;

				.item {

					padding-bottom: 16rpx;
					padding-top: 16rpx;
					margin-left: 16rpx;
					margin-right: 16rpx;
					border-bottom: #dde0e2 1px solid;
				}

				.bo {
					width: 128rpx;
					height: 76rpx;
					background-color: rgb(77, 127, 201);
					color: white;
					text-align: center;
					line-height: 76rpx;
					border-radius: 30rpx 30rpx;
				}

				.bo-left {
					position: absolute;
					left: 55rpx;
					top: 193rpx;
					z-index: 10;
				}

				.bo-right {
					z-index: 10;
					position: absolute;
					right: 130rpx;
					top: 193rpx;
				}

				.select {
					background-color: white;
					color: rgb(28, 68, 133);
				}

				.bzb-icon {
					position: absolute;
					left: 66rpx;
					top: 60rpx;
					width: 358rpx;
					height: 139rpx;
				}

				.tzb-icon {
					position: absolute;
					right: 66rpx;
					top: 60rpx;
					width: 327rpx;
					height: 125rpx;
				}

				.human-icon {
					position: absolute;
					right: -30rpx;
					top: -60rpx;
					width: 476rpx;
					height: 271rpx;
				}

				.desc1 {
					font-size: 30rpx;
					color: #3D3D3D;
					line-height: 40rpx;
					z-index: 11;
				}

				.desc1size {
					font-size: 36rpx;

					position: absolute;
					color: #003C71;
					right: 388rpx;
					top: 18rpx;
					z-index: 11;
				}

				.desc2 {
					color: #547896;
					font-size: 26rpx;
					line-height: 35rpx;
					z-index: 11;
				}

				.desc2size {
					font-size: 36rpx;
					color: #003C71;
					position: absolute;
					right: 37rpx;
					top: 43rpx;
					z-index: 11;
				}

				.main-icon {
					width: 644rpx;
					height: 292rpx;
					position: relative;
					z-index: 10;
				}

				.up-icon {
					width: 24rpx;
					height: 76rpx;
					position: absolute;
					left: 0rpx;
					top: 190rpx;
					z-index: 12;
				}

				.down-icon {
					width: 24rpx;
					height: 77rpx;
					position: absolute;
					right: 27rpx;
					top: 190rpx;
					display: block;
					z-index: 12;
				}

				@-webkit-keyframes downEffect {
					0% {
						transform: translateY(0);
						opacity: 0.3;
					}

					30% {
						transform: translateY(120);
						opacity: 1;

					}

					100% {
						transform: translateY(0);
						top: 70px;
						opacity: 1;
					}
				}

				@keyframes downEffect {
					0% {
						transform: translateY(0);
						opacity: 0.3;
					}

					30% {
						transform: translateY(120);
						opacity: 1;

					}

					100% {
						transform: translateY(0);
						top: 70px;
						opacity: 1;
					}
				}


				.down-icon-effect {
					animation: 1s linear 0s infinite downEffect;
					-webkit-animation: 1s linear 0s infinite downEffect;
				}

				@-webkit-keyframes upEffect {
					0% {
						opacity: 0.3;
						top: 50px;
					}

					30% {
						opacity: 1;
					}

					100% {
						top: 20px;
						opacity: 1;
					}
				}

				@keyframes upEffect {
					0% {
						opacity: 0.3;
						top: 50px;
					}

					30% {
						opacity: 1;
					}

					100% {
						top: 20px;
						opacity: 1;
					}
				}

				.up-icon-effect {
					animation: 1s linear 0s infinite upEffect;
					-webkit-animation: 1s linear 0s infinite upEffect;
				}
			}
		}




		.opt-part {
			display: flex;
			justify-content: space-around;
			margin-top: 42rpx;
			margin-bottom: 42rpx;

			.opt-tips-con {
				display: flex;
				justify-content: space-around;
				position: relative;
			}

			.opt-tip1 {

				top: 95rpx;
				left: 50rpx;
				text-align: center;
				color: #676767;
			}

			.opt-tip2 {

				top: 95rpx;
				right: 50rpx;
				text-align: center;
				color: #676767;
			}

			.opt-btn {
				width: 284rpx;
				height: 90rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				background-color: rgb(28, 68, 133);
				border-radius: 30rpx;
				line-height: 56rpx;
				color: white;
			}

			.opt-btn-top {
				background-color: rgb(79, 128, 191);
			}


			.icon {
				width: 56rpx;
				height: 56rpx;
			}
		}
	}

	.popup-container {
		position: relative;
		margin: 20rpx;

		.titleimg {
			width: 106rpx;
			height: 95rpx;
			position: absolute;
			left: 50%;
			top: -50rpx;
			margin-left: -53rpx;
		}

		.send-btn {
			background-color: #ff8000;
			margin: 20rpx;
			color: white;
			line-height: 80rpx;
			padding-left: 50rpx;
			padding-right: 50rpx;
			border-radius: 15rpx;
			text-align: center;
		}

		.close-btn {
			width: 26rpx;
			height: 27rpx;
			right: 30rpx;
			top: 20rpx;
			position: absolute;
		}

		.icon {
			width: 42rpx;
			height: 42rpx;
		}

		.input-area {
			margin-left: 20rpx;
			letter-spacing: 2rpx;
			background-color: #DEDEDE;
			padding: 20rpx;
			color: rgba(91, 120, 151, 1)
		}

		.icon-text {
			// line-height: 42rpx;
			margin-left: 20rpx;
			letter-spacing: 5rpx;
		}
	}

	.bottom-part {
		background-color: white;
		height: 300rpx;
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		border-radius: 50rpx 50rpx 0rpx 0rpx;

		.save {
			width: 670rpx;
			height: 102rpx;
			background-color: rgb(28, 68, 133);
			margin: 0 auto;
			line-height: 102rpx;
			text-align: center;
			color: white;
			margin-top: 80rpx;
			border-radius: 50rpx;

		}
	}
</style>