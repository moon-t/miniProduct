// pages/createDisk/createDisk.js
import api from '../../utils/api.js'
import netRequest from '../../utils/request.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hostInfo: {},
		diskList:[],
		productList:[],
		showInput:false,
	},

	/**
		 * @desc 获取当前主机信息
		 * @params {number} vmId | 主机_id
		 */
	getHostInfo: function (vmId) {
		let _this = this
		netRequest({
			url: api.host + "/" + vmId,
			method: 'GET',
			success: function (res) {
				if (res.rows && res.rows._id) {
					let _areaId = res.rows.area_id
					// let _lineId = res.rows.line_id
					_this.setData({
						hostInfo: res.rows,
						areaId: _areaId,
						// lineId: _lineId,
					})
					_this.getCreateDataDiskInfo(_areaId)
				}
			},
			failcb: function (res) {
				util.showToast('数据获取失败', 'none')
			}
		})
	},

	/**
	 * @desc 获取可购买的云盘类型
	 * @parma {num} areaId | 数据中心id
	 */
	getCreateDataDiskInfo: function (areaId){
		let _this = this
		netRequest({
			url: api.getCreateDataDiskInfo + "/" + areaId,
			method: 'GET',
			success: function (res) {
				if (res.rows && res.rows[0]) {
					res.rows.map((item) => {
						item.selected = false
					})
					_this.setData({
						diskList: res.rows,
					})
				}
			},
			failcb: function (res) {
				util.showToast('数据获取失败', 'none')
			}
		})
	},

	/**
	 * @desc 云盘类型选中
	 */
	checkDiskChange: function (e) {
		console.log(e)
		let value = e.target.dataset.value
		let _diskList = this.data.diskList
		let _this = this
		let flag = false
		_diskList.map((disk) => {
			if (disk.category_id == value) {
				flag = !disk.selected
				disk.selected = !disk.selected
			} else {
				disk.selected = false
			}
		})

		let chooseDiskProduct = this.data.diskList.filter(it => it.category_id == value).map(it => it.product)
		console.log(chooseDiskProduct[0])
		console.log(chooseDiskProduct[0][0].max_size)
		this.setData({
			diskList: _diskList
		})
		console.log(flag)
		if (flag) {
			let chooseDiskProduct = this.data.diskList.filter(it => it.category_id == value).map(it => it.product)
			_this.setData({
				showInput: true,
				productList: chooseDiskProduct[0]
			})
		} else {
			_this.setData({
				showInput: false,
				productList: [],
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let vmId = options.vmId
		this.setData({
			vmId:vmId
		})
		this.getHostInfo(vmId)
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