//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

		wx.request({
			url: 'http://10.0.0.118/api/v1/webservices/verifycode',
			success: (res) => {
				// console.log(res)
				if (res.header['Pic_verify_key']) {
					this.globalData.validateData = res.header['Pic_verify_key']
				}
			}
		})
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
		hostStatusList: [{
				number: "0",
				name: "关机",
				color: "#F5222D",
			}, {
				number: "1",
				name: "运行中",
				color:"#6ac22d",
			}, {
				number: "2",
				name: "启动中",
				color: "#efb239",
			}, {
				number: "3",
				name: "重启中",
				color: "#efb239",
			}, {
				number: "4",
				name: "关机中",
				color: "#efb239",
			}, {
				number: "5",
				name: "系统安装中",
				color: "#efb239",
			}, {
				number: "6",
				name: "销毁中",
				color: "#F5222D",
			}, {
				number: "7",
				name: "安装失败",
				color: "#F5222D",
			}, {
				number: "8",
				name: "创建失败",
				color: "#F5222D",
			}, {
				number: "9",
				name: "升配中",
				color: "#efb239",
			}, {
				number: "10",
				name: "系统重装中",
				color: "#efb239",
			}, {
				number: "11",
				name: "已开机，获取状态失败",
				color: "#efb239",
			}, {
				number: "12",
				name: "异常",
				color: "#F5222D",
			}, {
				number: "13",
				name: "未知",
				color: "#F5222D",
			}],
		// validateData:null
	
  }
})