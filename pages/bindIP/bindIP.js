// pages/bindIP/bindIP.js
import api from '../../utils/api.js'
import netRequest from '../../utils/request.js'
import util from '../../utils/util.js'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hostInfo:{},
		ipList:[],
		lineList:[],
		showLine:false,
		showIP:false,
	},

	/**
	 * @desc 获取当前主机信息
	 * @params {number} vmId | 主机_id
	 */
	getHostInfo: function (vmId) {
		let _this = this
		netRequest({
			url:api.host+"/"+vmId,
			method:'GET',
			success: function (res) {
				if (res.rows && res.rows._id) {
					let _areaId = res.rows.area_id
					let _lineId = res.rows.line_id
					_this.setData({
						hostInfo: res.rows,
						areaId:_areaId,
						lineId:_lineId,
					})
					if (_lineId && _lineId !== 0){
						_this.setData({
							showIp:true
						})
						_this.getIpListByArea(_areaId,_lineId)
					} else {
						_this.setData({
							showLine: true
						})
						_this.getLineListByArea(_areaId)
					}
				}
			},
			failcb: function (res) {
				util.showToast('数据获取失败', 'none')
			}
		})
	},
	
	/**
	 * @desc 获取IP列表 
	 */
	getIpListByArea: function (areaId, lineId){
		let _this = this
		let param = {
			area_id: areaId,
			line_id: lineId
		}
		netRequest({
			url: api.getIpListByArea,
			method: 'GET',
			data: param,
			success: function (res) {
				if (res.code === 1) {
					let _ipList = []
					if (res.rows[0]){
						res.rows.map((item) => {
							let itemObj = {
								value:item.ip_id,
								title:item.ip,
								selected:false,
							}
							_ipList.push(itemObj)
						})
					}
					console.log(_ipList)
					_this.setData({
						ipList: _ipList
					})
				} else {
					util.showToast('数据获取失败', 'none')
				}
			},
			failcb: function (res) {
				util.showToast('数据获取失败', 'none')
			},
		})
	},

	/**
	 * @desc 获取线路列表
	 */
	getLineListByArea: function (areaId) {
		let _this = this
		netRequest({
			url:api.getLineListByArea+"/"+areaId+"/line",
			method:'GET',
			data: areaId,
			success: function (res) {
				if (res.code === 1) {
					let _lineList = []
					if (res.rows[0]) {
						res.rows.map((item) => {
							let itemObj = {
								value: item._id,
								title: item.name,
								selected: false,
							}
							_lineList.push(itemObj)
						})
					}
					_this.setData({
						lineList: _lineList,
					})
				} else {
					util.showToast('数据获取失败', 'none')
				}
			},
			failcb: function (res) {
				util.showToast('数据获取失败', 'none')
			},
		})
	},

	/**
	 * @desc 线路选中
	 */
	checkLineChange: function(e){
		let value = e.target.dataset.value
		let _lineList = this.data.lineList
		let _this = this
		let flag = false
		_lineList.map((line) => {
			if (line.value === value){
				flag = !line.selected
				line.selected = !line.selected
			}else{
				line.selected = false
			}
		})
		this.setData({
			lineList:_lineList
		})
		console.log(flag)
		if(flag){
			_this.getIpListByArea(_this.data.areaId, value)
			_this.setData({
				showIp:true,
				lineId:value
			})
		} else {
			_this.setData({
				showIp: false,
				lineId:''
			})
		}
	},

	/**
	 * @desc ip选中
	 */
	checkIPChange: function(e) {
		let string = "ipList[" + e.target.dataset.index + "].selected"
		this.setData({
			[string]: !this.data.ipList[e.target.dataset.index].selected
		})
	},

	/**
	 * @desc 点击绑定IP回调
	 */
	comfirBindIP: function(){
		let chooseIPList = this.data.ipList.filter(it => it.selected).map(it => it.value)
		let _this = this
		if(chooseIPList && chooseIPList.length > 0){
			wx.showModal({
				title: '绑定IP',
				content: '确认绑定IP',
				success (res) {
					if(res.confirm){
						_this.bindIP(chooseIPList)
					}
				}
			})
		}else{
			util.showToast('请选择IP', 'none')
		}
	},


/**
 * @desc 绑定IP
 */
	bindIP: function (chooseIPList){
		let _this = this
		let params = {
			bind_id_list: chooseIPList,
			unbind_id_list: [],
			vm_id: this.data.vmId
		}
		netRequest({
			url: api.updateBindIp,
			method: 'PUT',
			data: params,
			success: function (res) {
				if (res.code === 1) {
					util.showToast('绑定IP成功', 'none')
					_this.getHostInfo(_this.data.vmId)
				} else if (res.code === 1000017 && res.rows[0]) {
					let failIPList = res.rows
					let ipList = _this.data.ipList
					let ip = ''
					failIPIdList.map((ipId)=>{
						ipList.map((ip) => {
							if (ipId === ip.ip_id){
								if(ip !== ''){
									ip = ip.ip_id
								}else{
									ip = ip + ',' + ip.ip_id
								}
							}
						})
					})
					util.showToast('IP:' + ip+'绑定失败', 'none')
				} else {
					util.showToast('绑定IP失败', 'none')
				}
				_this.getIpListByArea(_this.data.areaId, _this.data.lineId)
			},
			failcb: function () {
				util.showToast('绑定IP失败', 'none')
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let _this = this
		let data = {}
		// let areaId = options.areaId
		_this.setData({
			// areaName :options.areaName,
			// areaId: options.areaId,
			// lineId: options.lineId,
			// instance: options.instance,
			vmId: options.vmId
		})
		console.log(options)
		_this.getHostInfo(options.vmId)
		// if (options.lineId && options.lineId !== '0'){
		// 	_this.setData({
		// 		showIp:true,
		// 	})
		// 	_this.getIpListByArea(options.areaId,options.lineId)
		// }else{
		// 	_this.setData({
		// 		showLine:true
		// 	})
		// 	_this.getLineListByArea(options.areaId)
		// }
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})