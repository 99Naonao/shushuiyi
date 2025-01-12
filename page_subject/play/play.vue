<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title=''></z-nav-bar>
	<view class="container">
		<view class="top-part" :style="menuStyle">
			<image mode="widthFix" class="cover" :src="poster"></image>
			<view class="sound-name">{{soundName}}</view>
			<view class="sound-sub-name">{{authName}}</view>
			<view class="play-part ">
				<view class="flex align-center">
					<view class="time-left">{{currentTime}}</view>
					<view class="progress-box flex1">
						<progress :percent="progress" activeColor="#E24F36" stroke-width="3" />
					</view>
					<view class="time-full">{{duration}}</view>
				</view>
				<view class="flex space-round align-center" style="margin-top: 10rpx;">
					<image class="circle-mode" mode="widthFix" :src="'../static/SMY_06_play04.png'">
					</image>
					<image class="play-back" mode="widthFix" :src="'../static/SMY_06_play05.png'">
					</image>
					<image class="play-mode pause-icon" mode="widthFix" @click="playHandle"
						v-if="(audio&&paused == true)" :src="'../static/SMY_06_playA.png'">
					</image>
					<image class="play-mode pause-icon" mode="widthFix" @click="pauseHandle"
						v-if="(audio&&paused == false)" :src="'../static/SMY_06_playB.png'">
					</image>
					<image class="next-mode" mode="widthFix" :src="'../static/SMY_06_play06.png'">
					</image>
					<image class="list-mode" @click="listHandle" mode="widthFix" :src="'../static/SMY_06_play07.png'">
					</image>
				</view>
			</view>
		</view>
		<view class="center-part">
			<view class="border">
				<view class="title">
					如何使用音乐和热敷?
				</view>
				<view class="flex just-center align-center" style="padding: 20rpx;position: relative;">
					<view class="tips1">长按3秒开启眼罩蓝牙<br>
						耳机，在手机设置中连<br>
						接Minga耳机<br>
						<br>
					</view>
					<image class="tip-img" mode="widthFix" :src="'../static/SMY_06_RF01.png'"></image>
					<view class="tips">需要热敷<br>
						时请长按此<br>
						按钮3秒开启<br>
					</view>
				</view>
			</view>
		</view>
		<view class="opt-part">
			<view class="opt-btn opt-btn-top" @click="tipsHandle">
				<label>如何连接眠加耳机</label>
			</view>
			<view class="opt-btn opt-btn-top" @click="nextStepHandle">
				<label>下一步</label>
			</view>
		</view>

		<uni-popup ref="popupSave" type="bottom" background-color="#fff" border-radius="10px 10px 0 0"
			:mask-click="false">
			<view class="popup-container">
				<view class="flex align-center" style="padding: 30rpx;padding-top: 90rpx;">
					<text class="icon-text">曲目列表</text>
				</view>
				<view>
					<view v-for="(item,index) in SleepMusicInfo" :key="index" @click="changeMusic(item, index)">
						<view class="list-item flex center-part align-center">
							<view class="num">{{item.id}}</view>
							<view>
								<image class="item" :src="item.png"></image>
							</view>
							<view class="title">
								{{item.name}}
							</view>
						</view>
					</view>
				</view>
				<image class="close-btn" src="../../static/adjust/SY_05_buttonCOLa.png" mode="widthFix"
					@click="closeList">
				</image>
			</view>
		</uni-popup>
		<uni-popup class="m-popup" ref="popuptips" type="center">
			<view class="popup__main">
				<scroll-view class="popup_content" scroll-y='true'>
					<view class="rule-title">手机系统连接眠加蓝牙耳机教程</view>
					<view class="popup__body">
						<view class="sub1"><text>1. 安卓手机连接蓝牙耳机\n\n</text></view>
						<text>1. 打开蓝牙</text>
						• 打开手机的“设置”应用。<br>
						• 在设置菜单中，找到并点击“蓝牙”选项。<br>
						• 开启蓝牙开关，确保蓝牙处于可发现模式。<br>

						2. 进入蓝牙耳机配对模式<br>

						• 将打开眠加助眠仪,蓝牙耳机置于配对模式。通常情况下，按住耳机的电源按钮3秒钟，直到耳机指示灯开始闪烁，表示进入配对模式。<br>

						3. 在安卓手机上选择Minga蓝牙耳机<br>

						• 在蓝牙设置界面，等待几秒钟，直到你的耳机出现在设备列表中。<br>
						• 点击耳机名称进行配对。<br>


						4. 完成配对<br>

						<text>• 配对成功后，耳机指示灯将停止闪烁，进入稳定连接状态。此时，你就可以通过耳机聆听助眠音乐啦。\n\n</text>

						<view class="sub1"><text>2. iOS设备连接蓝牙耳机\n\n</text></view>
						1. 打开蓝牙<br>
						• 打开“设置”应用。<br>
						• 滑动屏幕并找到“蓝牙”选项，点击进入。<br>
						• 开启蓝牙开关，确保蓝牙处于开启状态。<br>
						2. 进入蓝牙耳机配对模式<br>
						• 按照蓝牙耳机的使用说明，将耳机置于配对模式，通常是长按电源按钮，直到指示灯闪烁。<br>
						3. 在iPhone或iPad上选择Minga蓝牙耳机<br><br>
						• 在蓝牙设置页面下方，找到显示的蓝牙设备列表。<br>
						4. 完成配对<br>
						<text>• 配对成功后，耳机指示灯将稳定，表明已连接。此时，你就可以通过耳机聆听助眠音乐。\n\n</text>

						<view>
							<view class="sub1"><text>常见问题\n\n</text></view>
							• 耳机未显示在列表中？<br>
							确保耳机处于配对模式并离手机较近。可以尝试关闭蓝牙并重新开启，或者重新启动耳机。<br>
							• 配对失败怎么办？<br>
							确认耳机没有与其他设备连接，并确保设备的蓝牙版本兼容。如果仍无法配对，可以尝试重置蓝牙耳机。<br>

							通过以上步骤，你就可以轻松地在安卓或iOS设备上连接蓝牙耳机了！<br>

						</view>
					</view>
				</scroll-view>
				<view class="health-btn" @click="closeHandler">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import blue_class from '../../utils/BlueManager';
	import {
		addLog
	} from '../../utils/miniapp';
	import {
		formatTime
	} from '@/common/util.js'
	const audio = uni.getBackgroundAudioManager({})
	export default {
		computed: {

		},
		data() {
			return {
				pauseIcon: '../static/SMY_06_playB.png',
				playIcon: '../static/SMY_06_playA.png',
				audio: null,
				paused: true,
				duration: "00:00",
				currentTime: "00:00",
				progress: 0,
				soundName: '选择曲目',
				SleepMusicInfo: [],
				poster: '',
				currentIndex: 0,
				authName: '未知',
				menuStyle: {}
			}
		},
		mounted() {

		},
		onShow() {
			this.start();
			const app = getApp();
			// if (this.audio) {
			// 	try {
			// 		this.audio.pause();
			// 		this.audio.destroy()
			// 		this.audio = null
			// 	} catch (e) {
			// 		//TODO handle the exception
			// 	}
			// }

			this.refreshInfo()
			console.log('this.currentIndex:', this.currentIndex)
			console.log('this.poster:', this.poster)
			console.log('this.soundName:', this.soundName)
			console.log('this.authName:', this.authName)

			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 50) + 'px');

			this.audio = audio
			// console.log('audio:', this.audio)
			// audio.src = "https://jinqiu.bytedance.com/sounds/bgm.mp3"
			// audio.src = "https://sleepfu.oss-cn-fuzhou.aliyuncs.com/music/mp3/Carlab.mp3"
			// audio.loop = true;
			// audio.volume = 1;
			audio.onPlay(() => {
				console.log('play!:')
				this.paused = false;
			})
			audio.onError(() => {
				console.log('onError!:')
			})
			audio.onPause(() => {
				console.log('onPause!:')
				this.paused = true;
			})

			audio.onEnded(() => {
				console.log('onPause!:')

				this.changeMusic(this.SleepMusicInfo[this.currentIndex], this.currentIndex);
			})
			audio.onTimeUpdate(() => {
				this.currentTime = formatTime(audio.currentTime)
				this.progress = audio.currentTime * 100 / audio.duration
				// console.log('onTimeUpdate!:', this.progress, audio.currentTime, audio.duration)
			})
			audio.onCanplay(() => {
				const app = getApp();
				let intervalID = setInterval(() => {
					if (audio.duration !== 0) {
						clearInterval(intervalID); // 清除定时器
						console.log("音频时长", audio.duration);
						this.duration = formatTime(audio.duration)
						app.globalData.duration = this.duration;
					}
				}, 500);
			})
		},
		methods: {
			refreshInfo() {
				const app = getApp();
				this.currentIndex = app.globalData.currentIndex ? app.globalData.currentIndex : 0;
				this.poster = app.globalData.poster ? app.globalData.poster : '';
				this.soundName = app.globalData.soundName ? app.globalData.soundName : '选择曲目';
				this.authName = app.globalData.authName ? app.globalData.authName : '未知';
				this.duration = app.globalData.duration ? app.globalData.duration : '00:00';
				// audio.src = app.globalData.src ? app.globalData.duration : '';
				this.paused = audio.paused;
			},
			async changeMusic(data, index) {
				audio.autoplay = true;
				audio.loop = true;
				audio.volume = 1;
				audio.title = data.name;
				audio.singer = data.auth;
				audio.coverImgUrl = data.png;
				audio.src = data.mp3;

				const app = getApp();

				app.globalData.currentIndex = index;
				app.globalData.poster = data.png;
				app.globalData.soundName = data.name;
				app.globalData.authName = data.auth;
				app.globalData.src = data.mp3;
				this.refreshInfo();
				this.closeList()



				addLog({
					'time': 0,
					'handStyle': blue_class.getInstance().getHandStyle(),
					'battery': blue_class.getInstance().getBattery(),
					'press': blue_class.getInstance().getPress(),
					'streath': blue_class.getInstance().getStrength(),
					'music': this.soundName
				});
			},
			async start() {
				let url = 'https://sleep1.oss-rg-china-mainland.aliyuncs.com/sleepmusic.json?v=' + Math.random()
				let that = this;
				wx.request({
					url: url,
					header: {
						'content-type': 'application/json'
					},
					success: function(res) {
						console.log(res.data)
						let result = res.data;
						let music = result.sleepmusic;
						let SleepMusic = music.SleepMusic;
						let SleepMusicInfo = SleepMusic.SleepMusicInfo;
						that.SleepMusicInfo = SleepMusicInfo;

						// that.changeMusic(that.SleepMusicInfo[0], 0);
					}
				})

				// uni.downloadFile({
				// 	url: url,
				// 	success: (res) => {
				// 		if (res.statusCode === 200) {
				// 			console.log('下载成功');
				// 			console.log(res)
				// 		}
				// 	},
				// 	fail: (res) => {
				// 		uni.showToast({
				// 			title: '加载失败'
				// 		})
				// 	}
				// })
			},
			listHandle() {
				this.$refs.popupSave.open('bottom');
			},
			closeList() {
				this.$refs.popupSave.close()
			},
			closeHandler() {
				this.$refs.popuptips.close()
			},
			playHandle() {
				if (audio && audio.paused) {
					audio.play()
					this.paused = false;
				} else {
					audio.pause()
					this.paused = true;
				}
				this.paused = audio.paused;
				console.log('playHandle...', audio.paused)
			},
			pauseHandle() {
				if (audio && audio.paused) {
					audio.play()
					this.paused = true;
				} else {
					audio.pause()
				}
				this.paused = audio.paused;
				console.log('pauseHandle...', audio.paused)
			},
			nextStepHandle() {
				uni.navigateTo({
					url: "/page_subject/step/step"
				})
			},
			tipsHandle() {
				this.$refs.popuptips.open('center');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: rgb(221, 224, 226);

		width: 100%;
		height: 100%;



		.list-item {
			background-color: #f0f2f7;
			border-radius: 20rpx;
			padding: 20rpx;
			margin: 20rpx;

			.item {
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				margin: 20rpx;
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


		.top-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.cover {
				width: 164rpx;
				height: 164rpx;
				border-radius: 50%;
				background: #3D3D3D;
				margin: 0 auto;
				display: block;
			}

			.pause-icon {
				width: 86rpx;
				height: 86rpx;
				display: block;
			}

			.sound-name {
				font-weight: 400;
				font-size: 24rpx;
				color: #3D3D3D;
				text-align: center;
				padding: 10rpx;
			}

			.sound-sub-name {
				font-weight: 400;
				font-size: 24rpx;
				color: #828282;
				text-align: center;
				padding: 10rpx;
			}

			.play-part {
				margin-left: 20rpx;
				margin-right: 20rpx;
				height: 120rpx;

				.time-left {
					width: 125rpx;
					font-size: 22rpx;
					color: #E24F36;
					text-align: center;
				}

				.time-full {
					text-align: center;
					width: 125rpx;
					font-size: 22rpx;
					color: #828282;
				}

				.circle-mode {
					width: 38rpx;
					display: block;
				}

				.play-back {
					width: 24rpx;
					display: block;
				}

				.next-mode {
					width: 24rpx;
					display: block;
				}

				.list-mode {
					width: 36rpx;
					display: block;
				}
			}
		}

		.center-part {
			.border {
				background-color: #eff2f6;
				border-radius: 38rpx;

				margin: 32rpx;

				.tip-img {
					width: 349rpx;
				}

				.tips1 {
					width: 300rpx;
					position: absolute;
					font-family: YouYuan;
					font-weight: 400;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 34rpx;
					margin-left: -50%;
				}

				.tips {
					font-family: YouYuan;
					font-weight: 400;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 34rpx;
					position: absolute;
					right: 30rpx;
				}

				.title {
					font-family: YouYuan;
					font-weight: 400;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 50rpx;
					text-align: center;
					padding-top: 20rpx;
				}
			}
		}

		.m-popup {
			.popup__main {
				box-sizing: border-box;
				padding: 50rpx 32rpx 40rpx;
				width: 578rpx;
				height: 870rpx;
				background-color: rgb(254, 254, 254);
				background-size: 100% auto;
				background-position: center top;
				background-repeat: no-repeat;
				border-radius: 50rpx;
				color: #003C71;
				font-size: 26rpx;
				line-height: 150%;
				text-align: justify;

			}

			.popup_content {
				width: 100%;
				height: 100%;
				overflow-y: scroll;
			}

			.rule-title {
				margin: 0 auto;
				text-align: center;
				font-size: 35rpx;
				line-height: 40rpx;
				padding-bottom: 50rpx;
			}

			.popup__t1 {
				padding-top: 20rpx;
				font-weight: bold;
			}

			.popup__body {
				width: 100%;
				line-height: 40rpx;
				white-space: pre-wrap;
				word-break: break-all;
				word-wrap: break-word;
			}

			.popup__close {
				position: absolute;
				right: 20rpx;
				top: 50rpx;
				width: 56rpx;
				height: 56rpx;

				/* background-image: url('https://quancode-scan-jdb-prod.oss-cn-beijing.aliyuncs.com/hxnhxp/close-btn.png'); */
				background-size: 100% auto;
				background-position: center top;
				background-repeat: no-repeat;
			}
		}

		.opt-part {
			display: flex;
			justify-content: space-between;
			margin-top: 42rpx;
			margin-bottom: 42rpx;
			margin: 42rpx;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 100rpx;

			.opt-btn {
				width: 300rpx;
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

		}

		.sub1 {
			font-weight: bold;
		}

		.health-btn {
			background-color: #003C71;
			padding: 15rpx;
			color: white;
			line-height: 50rpx;
			text-align: center;
			border-radius: 10rpx;
		}
	}
</style>