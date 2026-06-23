<template>
	<view class="mine-page">
		<view class="mine-hero">
			<view class="user-card">
				<view class="avatar-wrap">
					<image v-if="hasLogin" class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'"
						@click="navTo('/pages/my/set/userInfo')"></image>
					<image v-else class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'"
						@click="clickWxLogin"></image>
				</view>
				<view class="user-meta">
					<view v-if="nickNameInputFlag">
						<text class="username">{{ userInfo.nickName || '点此登录' }}</text>
						<text class="user-hint" v-if="!hasLogin">登录后同步积分数据</text>
					</view>
					<view v-else>
						<input class="username-input" type="text" placeholder="请输入新的昵称" @blur="inputClose()"
							v-model="newNickName" />
					</view>
				</view>
			</view>
		</view>
		<view class="mine-body">
			<view class="score-card">
				<view class="score-left">
					<image class="score-icon" src="../../static/score/SY_13_IconJF.png"></image>
					<view class="score-info">
						<text class="score-label">我的积分</text>
						<text class="score-value">{{score}}</text>
					</view>
				</view>
				<view class="be-btn-accent score-btn" @click="go2Use">去使用</view>
			</view>
			<view class="rules-card">
				<view class="rules-title">积分活动规则</view>
				<view class="desc">
				<view class="popup__body">
					会员积分是眠加小程序商城针对会员购物、参加会员活动等情况而给予的奖励，积分可在“眠加小程序商城”和“眠加活力健康检测”中使用。您可在眠加会员中心（ 我的> 会员中心>
					积分）查看所获得的积分。具体的积分获取、使用规则详见如文规定。<br>
					<text>\n</text>
					一、积分获取规则：<br><br>
					<text>\n</text>
					1. 注册积分：在眠加小程序商城完成注册，送200初始积分；<br>
					2. 消费积分：会员在眠加小程序商城消费时，每消费1元可获得1积分，积分可累计；<br>
					3. 签到积分：会员每天签到可获得1积分，每月签到次数不超过31次；<br>
					4. 积分回馈的数量以订单完成时的商品实付金额和比例为准，且仅计取整数。例如购买1000.9元的商品，发放1000个积分。<br>
					<text>\n</text>
					二、积分兑换规则：<br><br>
					<text>\n</text>
					1. 适用范围：积分仅可在“眠加小程序商城”和“眠加活力健康检测”中使用，可用于商品购买、健康检测、礼品兑换、活动抽奖等；<br>
					2. 购物积分抵扣：会员可使用积分抵扣购物金额，每20积分可抵扣1元，最高可抵扣订单总金额的40%；<br>
					3. 健康检测积分抵扣：60积分可进行健康检测一次，健康检测无次数限制；<br>
					4. 积分兑换礼品：会员可使用积分兑换眠加小程序商城指定的礼品，兑换所需积分以具体兑换礼品为准；<br>
					5. 订单内全部商品确认收货后，且7天内未发生退货的情况下，所发放积分才可使用；<br>
					6. 若使用现金+积分购买商品，所使用积分不享受积分回馈权益，只有使用的现金享受积分回馈权益，且单个商品不能连续15次用积分购买；<br>
					7. 若使用优惠券购买商品，则优惠券折扣部分不享受积分回馈；<br>
					8. 支付订单一经提交则该笔订单中所使用的积分将会预扣处理，如您最终取消付款，所使用的积分将在一定时间内返还到您的眠加帐号；<br>
					9. 积分使用后无法退还，兑换所需要的积分数量可能发生变动，具体以实际兑换所需积分数量为准；<br>
					10. 积分不可兑现、转让、售卖或跨帐号使用，使用积分抵扣商品金额的部分作为销售折扣在发票上单独列示，使用积分抵扣全部金额的则不开发票；<br>
					11. 可使用积分抵扣的金额可能会根据情况相应调整，具体请以实际页面提示为准。<br><br>
					<text>\n</text>
					三、特别声明：<br><br>
					<text>\n</text>
					1. 眠加小程序商城对本规则拥有最终解释权，保留对细则进行变更，解释，及终止权利；<br>
					2. 如用户注销眠加小程序商城帐号，所获的积分将被清空并作废；<br>
					3. 当订单已完成，发生增值税发票更换普通发票情况时，不补发对应积分；发生普通发票更换增值税发票情况时，则需要扣减该笔订单发放的积分；<br>
					4.凡以违反积分规则的方式或采用不正当手段（包括但不限于作弊、恶意刷分、扰乱/破坏系统、恶意利用系统或者规则漏洞）获取、使用积分，我们有权根据其行为恶劣程度决定扣除您帐号内所有或部分积分，对于已使用积分，有权要求您返还已抵扣的订单金额或所兑换的礼品或权益；<br>
					5. 以上积分规则自2024年8月13日生效。<br>
				</view>
			</view>
			</view>
		</view>
		<uni-popup class="m-popup" ref="popup" type="center">
			<view class="popup__main">
				<scroll-view class="popup_content" scroll-y='true'>
					<view class="rule-title">积分活动规则</view>
					<view class="popup__body">
						<text>会员积分是眠加小程序商城针对会员购物、参加会员活动等情况而给予的奖励，积分可在“眠加小程序商城”和“眠加活力健康检测”中使用。您可在眠加会员中心（ 我的> 会员中心>
							积分）查看所获得的积分。具体的积分获取、使用规则详见如文规定。

							一、积分获取规则：

							1. 注册积分：在眠加小程序商城完成注册，送200初始积分；
							2. 消费积分：会员在眠加小程序商城消费时，每消费1元可获得1积分，积分可累计；
							3. 签到积分：会员每天签到可获得1积分，每月签到次数不超过31次；
							4. 积分回馈的数量以订单完成时的商品实付金额和比例为准，且仅计取整数。例如购买1000.9元的商品，发放1000个积分。

							二、积分兑换规则：

							1. 适用范围：积分仅可在“眠加小程序商城”和“眠加活力健康检测”中使用，可用于商品购买、健康检测、礼品兑换、活动抽奖等；
							2. 购物积分抵扣：会员可使用积分抵扣购物金额，每20积分可抵扣1元，最高可抵扣订单总金额的40%；
							3. 健康检测积分抵扣：60积分可进行健康检测一次，健康检测无次数限制；
							4. 积分兑换礼品：会员可使用积分兑换眠加小程序商城指定的礼品，兑换所需积分以具体兑换礼品为准；
							5. 订单内全部商品确认收货后，且7天内未发生退货的情况下，所发放积分才可使用；
							6. 若使用现金+积分购买商品，所使用积分不享受积分回馈权益，只有使用的现金享受积分回馈权益，且单个商品不能连续15次用积分购买；
							7. 若使用优惠券购买商品，则优惠券折扣部分不享受积分回馈；
							8. 支付订单一经提交则该笔订单中所使用的积分将会预扣处理，如您最终取消付款，所使用的积分将在一定时间内返还到您的眠加帐号；
							9. 积分使用后无法退还，兑换所需要的积分数量可能发生变动，具体以实际兑换所需积分数量为准；
							10. 积分不可兑现、转让、售卖或跨帐号使用，使用积分抵扣商品金额的部分作为销售折扣在发票上单独列示，使用积分抵扣全部金额的则不开发票；
							11. 可使用积分抵扣的金额可能会根据情况相应调整，具体请以实际页面提示为准。

							三、特别声明：

							1. 眠加小程序商城对本规则拥有最终解释权，保留对细则进行变更，解释，及终止权利；
							2. 如用户注销眠加小程序商城帐号，所获的积分将被清空并作废；
							3. 当订单已完成，发生增值税发票更换普通发票情况时，不补发对应积分；发生普通发票更换增值税发票情况时，则需要扣减该笔订单发放的积分；
							4.凡以违反积分规则的方式或采用不正当手段（包括但不限于作弊、恶意刷分、扰乱/破坏系统、恶意利用系统或者规则漏洞）获取、使用积分，我们有权根据其行为恶劣程度决定扣除您帐号内所有或部分积分，对于已使用积分，有权要求您返还已抵扣的订单金额或所兑换的礼品或权益；
							5. 以上积分规则自2024年8月13日生效。

						</text>
					</view>
				</scroll-view>
				<view class="health-btn" @click="go2Use">健康检测</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		autoLogin
	} from '@/utils/miniapp.js'
	export default {
		data() {
			return {
				title: 'Hello12123',
				hasLogin: false,
				nickNameInputFlag: true,
				score: 0,
				userInfo: {
					avatar: ''
				}
			}
		},
		onShow() {
			let curPages = getCurrentPages()[0]
			if (typeof curPages.getTabBar === 'function' && curPages.getTabBar()) {
				curPages.getTabBar().setData({
					selected: 2
				});
			}

			this.refreshInfo();
		},
		methods: {
			detailhandler() {
				this.$refs.popup.open()
			},
			go2Use() {
				// const url =
				// 	'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1ac2da77b1e55f42&redirect_uri=https://sleep.zsyl.cc/sleeph5&response_type=code&scope=snsapi_userinfo&state=STATE';
				// const url2 = 'https://mp.weixin.qq.com/s/tsSJqende7UKJf2xZExZ7Q?token=1386691342&lang=zh_CN'

				// const url3 =
				// 	'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkyMDQ5NTk0OQ&scene=124#wechat_redirect';
				const url5 = 'https://sleep.zsyl.cc/sleeph5/miniIndex.html'
				const navtitle = '健康检测'
				console.log('go2use:', url5)
				wx.navigateTo({
					// 跳转到webview页面
					url: `/pages/mine/webview?url=${url5}&nav=${navtitle}`,
				});
			},
			clickWxLogin() {
				autoLogin((res) => {
					console.log('success', res);
					console.log(uni.getStorageSync('userInfo'))
					this.hasLogin = true;
					this.refreshInfo();
				})
			},
			refreshInfo() {
				let userInfo = uni.getStorageSync('userInfo')
				if (userInfo && userInfo.token) {
					this.score = userInfo.score;
					this.userInfo = userInfo;
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/theme.scss';

	.mine-page {
		min-height: 100vh;
		background: $be-bg-page;
		padding-bottom: calc(#{$be-tabbar-height} + env(safe-area-inset-bottom));
	}

	.mine-hero {
		background: linear-gradient(160deg, $be-primary-dark, $be-primary 70%);
		padding: 120rpx 40rpx 80rpx;
	}

	.user-card {
		display: flex;
		align-items: center;
	}

	.avatar-wrap {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.3);
		overflow: hidden;
		margin-right: 28rpx;
		flex-shrink: 0;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.user-meta {
		flex: 1;
	}

	.username {
		font-size: 36rpx;
		font-weight: 600;
		color: $be-text-inverse;
		display: block;
	}

	.user-hint {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.55);
		margin-top: 8rpx;
		display: block;
	}

	.username-input {
		font-size: 32rpx;
		color: $be-text-inverse;
		background: rgba(255, 255, 255, 0.15);
		border-radius: $be-radius-sm;
		padding: 12rpx 20rpx;
	}

	.mine-body {
		margin-top: -40rpx;
		padding: 0 32rpx;
	}

	.score-card {
		@include be-card;
		margin: 0 0 24rpx;
		padding: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.score-left {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.score-icon {
		width: 56rpx;
		height: 52rpx;
		margin-right: 20rpx;
	}

	.score-info {
		display: flex;
		flex-direction: column;
	}

	.score-label {
		font-size: 26rpx;
		color: $be-text-secondary;
	}

	.score-value {
		font-size: 48rpx;
		font-weight: 700;
		color: $be-primary;
		line-height: 1.2;
	}

	.score-btn {
		flex-shrink: 0;
		font-size: 28rpx;
	}

	.rules-card {
		@include be-card;
		margin: 0;
		padding: 32rpx;
	}

	.rules-title {
		font-size: 32rpx;
		font-weight: 600;
		color: $be-text-primary;
		margin-bottom: 24rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #EDF2F7;
	}

	.desc {
		font-size: 26rpx;
		color: $be-text-secondary;
		line-height: 1.8;
		max-height: calc(100vh - 680rpx);
		overflow: scroll;

		.rule-title {
			display: none;
		}
	}

	.health-btn {
		background: $be-primary;
		padding: 20rpx;
		color: white;
		line-height: 50rpx;
		text-align: center;
		border-radius: $be-radius-md;
		margin-top: 24rpx;
	}

	.m-popup {
		.popup__main {
			box-sizing: border-box;
			padding: 50rpx 32rpx 40rpx;
			width: 620rpx;
			height: 870rpx;
			background-color: $be-surface;
			border-radius: $be-radius-xl;
			color: $be-primary-dark;
			font-size: 26rpx;
			line-height: 1.6;
		}

		.popup_content {
			width: 100%;
			height: 100%;
			overflow-y: scroll;
		}

		.rule-title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 600;
			padding-bottom: 32rpx;
			color: $be-text-primary;
		}

		.popup__body {
			text-align: justify;
			padding: 0 8rpx;
			color: $be-text-secondary;
		}
	}
</style>