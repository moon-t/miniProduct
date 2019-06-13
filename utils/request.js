function netRequest({ url, method = 'POST', data, success, failcb}) {

	let server = "https://10.0.0.118";

	//本地获取存储的xToken
	let xToken = wx.getStorageSync('xToken')

	let _this = this

	if (xToken !== '' && xToken !== null){
		var header = { "X-Xsrf-Token": xToken, 'content-type': 'application/json', }
	}


	wx.request({
		url: server + url,
		method: method,  
		data:  data,
		header: header,
		success: (res) => {
			if(xToken == '' || xToken == null){
				wx.setStorageSync('xToken', res.header['X-Xsrf-Token'])
			}
			let data = res.data;
			res['statusCode'] === 200 ? success(data) : _this.fail();
		},
		fail: function () {
			wx.hideLoading();
			wx.showToast({
				title: '请求超时',
				icon:'loading',
				duration:2000
			})
			return typeof failcb == "function" && failcb(false)

		},

		complete: function(){
			wx.hideLoading();
		}
	});

}

export default netRequest;