const app = getApp()
Component({
	lifetimes: {
		attached() {
			this.setData({
				selected: app.globalData.tabIndex || 0
			})
		}
	},
	data: {
		selected: 0,
		color: "#A0AEC0",
		selectedColor: "#4A7FD4",
		list: [{
				pagePath: "/pages/index/index",
				text: "首页",
				icon: "home"
			},
			{
				pagePath: "/pages/help/help",
				text: "帮助",
				icon: "help"
			},
			{
				pagePath: "/pages/mine/mine",
				text: "我的",
				icon: "mine"
			}
		]
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			app.globalData.tabIndex = data.index
			wx.switchTab({
				url
			})
		}
	}
})
