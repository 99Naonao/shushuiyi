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
					如何使用热敷?
				</view>
				<view class="flex just-center align-center" style="padding: 20rpx;">
					<image class="tip-img" mode="widthFix" :src="'../static/SMY_06_RF01.png'"></image>
					<view class="tips">需要热敷时<br>
						请开启这个按钮</view>
				</view>
			</view>
		</view>
		<view class="opt-part">
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
	</view>
</template>

<script>
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
				soundName: '',
				SleepMusicInfo: [],
				poster: '',
				currentIndex: 0,
				authName: '',
				menuStyle: {}
			}
		},
		mounted() {

		},
		onShow() {
			this.start();
			if (this.audio) {
				try {
					this.audio.pause();
					this.audio.destroy()
					this.audio = null
				} catch (e) {
					//TODO handle the exception
				}
			}

			let app = getApp();
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

				this.changeMusic(that.SleepMusicInfo[this.currentIndex], this.currentIndex);
			})
			audio.onTimeUpdate(() => {
				this.currentTime = formatTime(audio.currentTime)
				this.progress = audio.currentTime * 100 / audio.duration
				console.log('onTimeUpdate!:', this.progress, audio.currentTime, audio.duration)
			})
			audio.onCanplay(() => {
				let intervalID = setInterval(() => {
					if (audio.duration !== 0) {
						clearInterval(intervalID); // 清除定时器
						console.log("音频时长", audio.duration);
						this.duration = formatTime(audio.duration)
					}
				}, 500);
			})
		},
		methods: {
			async changeMusic(data, index) {
				audio.autoplay = true;
				audio.loop = true;
				audio.volume = 1;
				audio.title = data.name;
				audio.singer = data.auth;
				audio.coverImgUrl = data.png;
				audio.src = data.mp3;

				this.currentIndex = index;
				this.poster = data.png;
				this.soundName = data.name;
				this.authName = data.auth;
				this.closeList()
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

						that.changeMusic(that.SleepMusicInfo[0], 0);
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

				.tips {
					font-family: YouYuan;
					font-weight: 400;
					font-size: 28rpx;
					color: #3D3D3D;
					line-height: 34rpx;
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

		.opt-part {
			display: flex;
			justify-content: space-around;
			margin-top: 42rpx;
			margin-bottom: 42rpx;

			.opt-btn {
				width: 484rpx;
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
	}
</style>