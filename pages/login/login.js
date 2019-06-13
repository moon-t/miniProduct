// //index.js
// //获取应用实例
const app = getApp()

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function () {
		//登录
		wx.request({
			url: 'https://10.0.0.118/api/v1/webservices/account/login',
			method: 'POST',
			data: {
				login_type: "2",
				password: "55422ef75fb65485e715b11aa6d2997189e70c2bfb3538ecbddadec7bf13a707",
				pic_verify_code: 0,
				pic_verify_key: app.globalData.validateData,
				user_name: "18280065360",
			},
			success: (res) => {
				console.log(res)
				wx.setStorageSync('xToken', res.header['X-Xsrf-Token'])
				wx.switchTab({
					url: '/pages/index/index',
				})
			}
		})
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	getUserInfo: function (e) {
		console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	}
})


