<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#1A202C' transparentFixedFontColor='#1A202C'
		title='手动调整'></z-nav-bar>
	<view class="flow-page">
		<view class="flow-content" :style="menuStyle">
			<view class="be-card time-card">
				<view class="be-card-title">选择助眠时长</view>
				<view class="be-time-grid">
					<view class="be-time-pill" :class="{active: timeIndex==1}" @click="selectMode(1)">
						<text class="be-time-num">5</text>
						<text class="be-time-unit">分钟</text>
					</view>
					<view class="be-time-pill" :class="{active: timeIndex==2}" @click="selectMode(2)">
						<text class="be-time-num">10</text>
						<text class="be-time-unit">分钟</text>
					</view>
					<view class="be-time-pill" :class="{active: timeIndex==3}" @click="selectMode(3)">
						<text class="be-time-num">20</text>
						<text class="be-time-unit">分钟</text>
					</view>
				</view>
			</view>
			<view class="last-style" v-if="styleName">上次选择：{{styleName}}</view>
			<view class="be-card mode-card">
				<view class="be-card-title">选择助眠手法</view>
				<view class="mode-list">
					<view class="be-list-item">
						<view class="flex1">
							<view class='mode-name'>平补平泻手法</view>
							<view class='mode-desc'>新手建议模式，本手法非常舒适</view>
						</view>
						<switch color='#4A7FD4' :checked="mode_one" @change="(v)=>{
							closeOthers()
							mode_one = v.detail.value
							hand_name = '平补平泻.qzd'
						}"></switch>
					</view>
					<view class="be-list-item">
						<view class="flex1">
							<view class='mode-name'>补法</view>
							<view class='mode-desc'>适合失眠多梦阳气失衡的用户</view>
						</view>
						<switch color='#4A7FD4' :checked="mode_two" @change="(v)=>{
							closeOthers()
							mode_two = v.detail.value;
							hand_name = '补法.qzd'
						}"></switch>
					</view>
					<view class="be-list-item">
						<view class="flex1">
							<view class='mode-name'>泻法</view>
							<view class='mode-desc'>适合盗汗气虚怕冷体质的用户</view>
						</view>
						<switch color='#4A7FD4' :checked="mode_three" @change="(v)=>{
							closeOthers()
							mode_three = v.detail.value
							hand_name = '泻法.qzd'
						}"></switch>
					</view>
					<view class="be-list-item">
						<view class="flex1">
							<view class='mode-name'>专业浅针师手法</view>
							<view class='mode-desc'>享受中国浅针大师的独特手法</view>
						</view>
						<switch color='#4A7FD4' :checked="mode_four" @change="(v)=>{
							closeOthers()
							mode_four = v.detail.value
							hand_name = '手法z.qzs'
						}"></switch>
					</view>
				</view>
			</view>
		</view>
		<view class="flow-footer">
			<view class="be-btn-primary flow-btn" @click="nextStepHandle">下一步</view>
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
	import {
		addLog
	} from '../../utils/miniapp'
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
				timeIndex: 2,
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
				time: 10 * 60,
				loginStatus:false //助眠仪蓝牙连接状态
			}
		},
		computed: {
			styleName() {
				if (this.hand_name) {
					if (this.hand_name.includes('.', 0)) {

						return this.hand_name.split('.')[0]
					} else {
						return ''
					}

				} else {
					return '';
				}
				return hand_name;
			}
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
			uni.$on('update_handstyle', this.handleStyleChange);
			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 20) + 'px');
			console.log('app.globalData.top:', app.globalData)

			this.handleStyleChange()
		},
		onUnload() {
			console.log('adjust on onUnload!')

			uni.$off('xx', this.handleMessage);
		},
		onHide() {
			console.log('adjust on hide!')

			uni.$off('xx', this.handleMessage);
			uni.$off('update_handstyle', this.handleStyleChange);
		},
		methods: {
			handleStyleChange() {
				// 更新手法模式
				let last_hand_name = blue_class.getInstance().getHandStyle();
				this.hand_name = last_hand_name;
				this.closeOthers();
				console.log('handleStyleChange:', this.hand_name, this.hand_name.length, this.hand_name.trim());
				if (this.hand_name.includes('平补平泻.qzd', 0)) {
					this.mode_one = true;
					console.log('handleStyleChange 1:', this.hand_name);
				} else if (this.hand_name.includes('补法.qzd', 0)) {
					this.mode_two = true;
					console.log('handleStyleChange 2:', this.hand_name);
				} else if (this.hand_name.includes('泻法.qzd', 0)) {
					this.mode_three = true;
					console.log('handleStyleChange 3:', this.hand_name);
				} else if (this.hand_name.includes('手法z.qzs', 0)) {
					this.mode_four = true;
					console.log('handleStyleChange 4:', this.hand_name);
				} else {
					// 默认
					this.hand_name = '平补平泻.qzd'
					this.mode_one = true;
					console.log('handleStyleChange 5:', this.hand_name);
				}
				console.log('handleStyleChange:', this.mode_one, this.mode_two, this.mode_three, this.mode_four)
			},
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
					if(!blue_class.getInstance().loginSuccess){
						uni.showModal({
							title:"未连接设备提示",
							content:"请检查设备是否已连接",
							showCancel:false
						});
						return;
					}
					uni.navigateTo({
						url: "/page_subject/step/step"
					})

					blue_class.getInstance().changePlayFile(this.hand_name, () => {
						blue_class.getInstance().changeMode('start', this.time);
						addLog({
							'time': this.time,
							'handStyle': this.hand_name,
							'battery': blue_class.getInstance().getBattery(),
							'press': blue_class.getInstance().getPress(),
							'streath': blue_class.getInstance().getStrength(),
							'music': ''
						});
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
			},
			parsePillowStatus(arraybuffer) {

			},
			// 调低枕头
			adjustLowSleepHandler() {

			},
			stopAdjustHighHandler() {

			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/theme.scss';

	.flow-page {
		@include be-page-base;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.flow-content {
		flex: 1;
		padding-top: var(--menuButtonTop);
		padding-bottom: 160rpx;
	}

	.time-card, .mode-card {
		margin: 24rpx 32rpx;
	}

	.last-style {
		text-align: center;
		font-size: 26rpx;
		color: $be-text-muted;
		margin: -8rpx 32rpx 16rpx;
	}

	.mode-list {
		padding: 0 8rpx;
	}

	.mode-name {
		font-size: 30rpx;
		font-weight: 500;
		color: $be-text-primary;
		line-height: 1.4;
	}

	.mode-desc {
		font-size: 24rpx;
		color: $be-text-secondary;
		margin-top: 6rpx;
		line-height: 1.5;
	}

	.flow-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 24rpx 48rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		background: $be-surface;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	}

	.flow-btn {
		width: 100%;
	}

	::v-deep(.input-part) {
		bottom: 0 !important;
	}

	.selected {
		background-color: #1c4485;
	}
</style>
