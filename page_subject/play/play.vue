<template>
	<z-nav-bar backState="1000" type='transparentFixed' fontColor='#000' transparentFixedFontColor='#000'
		title=''></z-nav-bar>
	<view class="container">
		<view class="top-part" :style="menuStyle">
			<image mode="widthFix" class="cover" :src="'../static/SMY_06_playMAC.png'"></image>
			<view class="sound-name">In a time Lastpast</view>
			<view class="sound-sub-name">时光飞逝</view>
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
					<image class="list-mode" mode="widthFix" :src="'../static/SMY_06_play07.png'">
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
	</view>
</template>

<script>
	import {
		formatTime
	} from '@/common/util.js'
	const audio = uni.createInnerAudioContext({
		useWebAudioImplement: true
	})
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
				menuStyle: {}
			}
		},
		mounted() {

		},
		onShow() {
			if (this.audio) {
				try {
					this.audio.pause();
					this.audio.destroy()
					this.audio = null
				} catch (e) {
					//TODO handle the exception
				}
			}

			setInterval(() => {
				console.log("audio.paused:", audio.paused)
			}, 1000)

			let app = getApp();
			this.$set(this.menuStyle, '--menuButtonTop', (app.globalData.top + 50) + 'px');

			this.audio = audio
			console.log('audio:', this.audio)
			audio.src = "https://jinqiu.bytedance.com/sounds/bgm.mp3"
			audio.loop = true;
			audio.volume = 1;
			audio.onPlay(() => {
				console.log('play!:')
			})
			audio.onError(() => {
				console.log('onError!:')
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

		.top-part {
			background-color: rgb(221, 224, 226);
			padding-top: var(--menuButtonTop);

			.cover {
				width: 164rpx;
				border-radius: 50%;
				margin: 0 auto;
				display: block;
			}

			.pause-icon {
				width: 86rpx;
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

				.time-left {
					width: 95rpx;
					font-size: 22rpx;
					color: #E24F36;
					text-align: center;
				}

				.time-full {
					text-align: center;
					width: 65rpx;
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