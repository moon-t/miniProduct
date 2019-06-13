// pages/unBindIP/unBindIP.js
import api from '../../utils/api.js'
import netRequest from '../../utils/request.js'
import util from '../../utils/util.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		vmId:'',
		hostInfo:{},
		ipList:[],
		notice:false,
	},


	/**
	 * @desc 获取主机列表
	 * @param {num} vmId | 主机_id
	 */
	getHostInfo: function(vmId){
		let _this = this
		netRequest({
			url: api.host + "/" + vmId,
			method: 'GET',
			success: function (res) {
				if (res.rows && res.rows._id) {
					let _ipList = res.rows.ip
					if(_ipList && _ipList[0]){
						_ipList.map((ip) => {
							ip.selected = false
							ip.canSelected = true
						})
					}
					_this.setData({
						hostInfo: res.rows,
						ipList:_ipList
					})
				}
			},
			failcb: function (res) {
				util.showToast('数据获取失败', 'none')
			}
		})
	},

	/**
	 * @desc ip选中
	 */
	checkboxChange: function (e) {
		let _ipList = this.data.ipList
		let string = "ipList[" + e.target.dataset.index + "].selected"
		this.setData({
			[string]: !this.data.ipList[e.target.dataset.index].selected,
		})
		let chooseIPList = this.data.ipList.filter(it => it.selected).map(it => it.ip_id)
		if (this.data.hostInfo.group.group_id && chooseIPList.length === this.data.ipList.length - 1){
			_ipList.map((item) =>{
				if(!item.selected){
					item.canSelected = false
				}
			})
			this.setData({
				notice:true
			})
		}else{
			_ipList.map((item) => {
					item.canSelected = true
			})
			this.setData({
				notice: false
			})
		}
		this.setData({
			ipList: _ipList
		})
	},

	/**
	 * @desc 点击解绑IP回调
	 */
	comfirUnBindIP: function () {
		let chooseIPList = this.data.ipList.filter(it => it.selected).map(it => it.ip_id)
		let _this = this
		if (chooseIPList && chooseIPList.length > 0) {
			wx.showModal({
				title: '解绑IP',
				content: '确认解绑IP',
				success(res) {
					if (res.confirm) {
						_this.ubBindIP(chooseIPList)
					}
				}
			})
		} else {
			util.showToast('请选择IP', 'none')
		}
	},

	/**
	 * @desc 解绑IP
	 * @param {arr} chooseIPList | 选中解绑ip列表
	 */
	ubBindIP: function (chooseIPList) {
		let _this = this
		let params = {
			bind_id_list: [],
			unbind_id_list: chooseIPList,
			vm_id: _this.data.vmId
		}
		netRequest({
			url: api.updateBindIp,
			method: 'PUT',
			data: params,
			success: function (res) {
				if (res.code === 1) {
					util.showToast('解绑IP成功', 'none')
				} else if (res.code === 1000017 && res.rows[0]) {
					let failIPList = res.rows
					let ipList = _this.data.ipList
					let ip = ''
					failIPIdList.map((ipId) => {
						ipList.map((ip) => {
							if (ipId === ip.ip_id) {
								if (ip !== '') {
									ip = ip.ip_id
								} else {
									ip = ip + ',' + ip.ip_id
								}
							}
						})
					})
					util.showToast('IP:' + ip + '解绑失败', 'none')
				} else {
					util.showToast('解绑IP失败', 'none')
				}
				_this.getHostInfo(_this.data.vmId)
			},
			failcb: function () {
				util.showToast('解绑IP失败', 'none')
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let vmId = options.vmId
		let _this = this;
		_this.setData({
			vmId: vmId,
		})
		_this.getHostInfo(vmId)
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