// pages/epc/epc.js
import api from '../../utils/api.js'
import netRequest from '../../utils/request.js'

const app = getApp()
const failPng = '../../images/fail.png'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		timer:'',
		vmId:'',
		areaId:'',
		hostIdStr:'',
		epcList:[],
		areaList: [],
		ipList:[],
		groupList:[],
		groupPickerList:[],
		safeGroupList:[],
		option:[],
		statusList: app.globalData.hostStatusList, 
		hostInfo:{},
		index:1,
		show:false,
		pickerDisable:true,
		groupPicker:false,
		safeGroupPicker:false,
		hostId:'',
		scrollHeight:0,
		scrollTop:0,
		scrollBg:'#FFF',
		pageNo:1,
		pageSize:10,
	},

	showPicker_01: function () {
		this.setData({
			pickerDisable: true
		})
	},

/**
 * @desc 确定的回调
 */
	sureCallBack(e) {
		let _this = this
		let data = e.detail
		let _hostId = this.data.hostId;
		let _hostInfo = this.data.hostInfo
		let optionName = e.detail.choosedData[0]
		let _timer = this.data.timer
		console.log(optionName)
		_this.setData({
			pickerDisable: true,
			// picker_data: e.detail.choosedData,
			// picker_index: JSON.stringify(e.detail.choosedIndexArr)
		})
		switch (optionName){
			case '开机':
				_this.startHost(_hostId)
			break;
			case '自动续费':
				_this.confirmAutoRenew(_hostId)
			break;
			case '绑定IP':
				_this.setData({
					pickerDisable:true,
				})
				let param = {
					area_id: _hostInfo.area_id,
					line_id: _hostInfo.line_id
				}
				_timer ? _this.clearIntervalTime() : ''
				wx.navigateTo({
					url: '/pages/bindIP/bindIP?vmId=' + _hostInfo._id,
				})
			break;
			case "解绑IP":
				_this.setData({
					pickerDisable: true,
				})
				_timer ? _this.clearIntervalTime() : ''
				wx.navigateTo({
					url: '/pages/unBindIP/unBindIP?vmId=' + _hostInfo._id,
				})
			break;
			case "新购云盘":
				_this.setData({
					pickerDisable: true,
				})
				_timer ? _this.clearIntervalTime() : ''
				wx.navigateTo({
					url: '/pages/createDisk/createDisk?vmId=' + _hostInfo._id,
				})
			break;
			case "加入共享带宽组":
				_this.initBindBGroup(_hostInfo.area_id,_hostInfo.line_id)
			break;
			case "移除共享带宽组":
				_this.confirmUnbindSBG(_hostId, _hostInfo['group']['group_id'])
			break;
			case "加入安全组":
				_this.initJoinSGroup(_hostId,_hostInfo.area_id)
			break;
			case "移除安全组":
				_this.confirmUnbindSafeGroup(_hostId, _hostInfo['safe_group'][0]['sg_id'])
			break;
			default:
			break;
		}
		
	},

/**
 * @desc 初始化加入共享带宽组
 */
	initBindBGroup: function(areaId,lineId){
		let _this = this
		let params = {
			area_id: areaId,
			line_id: lineId
		}
		netRequest({
			url: api.getBandGroup,
			method:'GET',
			data:params,
			success: function(res){
				if(res.code === 1){
					let _groupPickerList = []
					if(res.rows && res.rows[0]){
						res.rows.map((group) =>{
							_groupPickerList.push({ name: group.group_name, id:group._id})
						})
					}
					_this.setData({
						groupList: res.rows,
						groupPickerList: [_groupPickerList],
						groupPicker:true,
					})
				}else{
					_this.showToast('获取数据失败', 'none', failPng)
				}
			},
			failcb: function(res){
				_this.showToast('获取数据失败', 'none', failPng)
			}
		})
	},


/**
 * @desc 主机加入共享带宽组回调
 */
	joinBGroup: function(e){
		let _this = this 
		let _groupId = e.detail.choosedData[0]['id']
		let vmId = this.data.hostInfo._id
		let params = {
			group_id: _groupId,
			machine:[{vm_id:vmId}]
		}
		netRequest({
			url: api.optionBandGroup,
			method:'POST',
			data:params,
			success: function (res) {
				if(res.code === 1){
					_this.showToast('绑定成功', 'success')
					_this.getHostList(_this.data.areaId)
				}else{
					_this.showToast('绑定失败', 'none', failPng)	
				}
			},
			failcb: function (res) {
				_this.showToast('绑定失败', 'none', failPng)
			}
		})
		this.setData({
			groupPicker: false
		})
	},

/**
 * @desc 取消主机加入共享带宽组的回调
 */
	cancleJoinBGroup: function(){
		this.setData({
			groupPicker:false
		})
	},
/**
 * @desc 移除共享带宽组确认Modal
 * @param {num} vmId 主机_id 
 * @param {num} groupId 当前主机所在共享带宽组id
 */
	confirmUnbindSBG: function (vmId, groupId){
		let _this = this
		wx.showModal({
			title: '解绑',
			content: '确认从共享带宽组解绑该主机',
			success(res) {
				if (res.confirm) {
					_this.unBindBGroup(vmId, groupId)
				}
			}
		})
	},

/**
 * @desc 解绑共享带宽组
 * @param {num} vmId 主机_id
 * @param {num} groupId 当前主机所在共享带宽组id
 */
	unBindBGroup: function (vmId, groupId){
		let _this = this
		let params = {
			group_id:groupId,
			machine:[{vm_id:vmId}]
		}
		netRequest({
			url: api.optionBandGroup,
			method:'PUT',
			data:params,
			success: function(res){
				if(res.code === 1){
					_this.showToast('解绑成功', 'success')
					_this.getHostList(_this.data.areaId)
				}else{
					_this.showToast('解绑失败', 'none', failPng)
				}
			},
			failcb: function (res) {
				_this.showToast('解绑失败', 'none', failPng)
			}
		})
	},

/**
 * @desc 取消的回调
 */
	cancleCallBack() {
		this.setData({
			pickerDisable: true,
		})
	},

	/**
	 * @desc 显示消息提示框
	 * @parma {string} title | 提示的内容
	 * @parma {string} icon | success/成功 loading/加载 none/不显示图标
	 */
	showToast: function (title,icon,img){
			wx.showToast({
				title: title,
				icon: icon,
				image:img,
				duration: 2000
			})
	},

/**
 * @desc 自动续费确认Modal
 * @parma {num} hostId | 主机_id
 */
	confirmAutoRenew: function (hostId) {
		let _this = this
		wx.showModal({
			title:'自动续费',
			content:'确认开启自动续费',
			success (res) {
				if(res.confirm){
					_this.machineAutoRenew(hostId)
				}
			}
		})
	},

/**
 * @desc 主机自动续费
 * @parma {num} hostId | 主机_id
 */
	machineAutoRenew: function(hostId) {
		let params = {
			action:'enable-auto-renew',
			vm_id_list:[hostId],
		}
		let _epcList = this.data.epcList
		let _this = this
		netRequest({
			url: api.updateMachineRenewStatus,
			method:'PUT',
			data:params,
			success: function(res){
				if (res.code === 1) {
					_this.showToast('自动续费成功', 'success')

					_epcList.map((epc) => {
						if (epc._id === hostId) {
							epc.isAutoRenew = true;
						}
					})
					_this.setData({
						epcList: _epcList,
					})
				}else{
					_this.showToast('自动续费失败', 'none', failPng)
				}		
			},
			failcb: function (res) {
				_this.showToast('自动续费失败', 'none', failPng)
			},
		})
	},

/**
 * @desc 开机操作
 * @parma {num} hostId | 主机_id
 */
	startHost: function (hostId) {
		let _this = this
		let data = {
			action: 'start',
			// instanceList: [hostId],
		}
		netRequest({
			url: api.host,
			method: 'PUT',
			data: data,
			success: function (res) {
				if (res.code === 1) {
					_this.getHostList(_this.data.areaId)
					_this.showToast('开机成功', 'success')
				} else {  
					_this.showToast('开机失败', 'none', failPng)
				}
			},
			failcb: function () {
				_this.showToast('开机失败', 'none', failPng)
			},
		})
	},
   
/**
 * @desc 获取可加入安全组列表
 * @param {num} areaId 当前主机所在区域area_id
 * @param {num} vmId 主机_id
 */
	initJoinSGroup: function (vmId, areaId){
		let _this = this
		let params = {
			area_id: areaId,
			vm_id:vmId
		}
		netRequest({
			url: api.getSafeGroup,
			method:'GET',
			data:params,
			success: function(res){
				if(res.code === 1){
					let _safeGroupList = []
					if(res.rows && res.rows[0]){
						res.rows.map((item) =>{
							_safeGroupList.push({ name: item.sg_name, id:item.sg_id})
						})
					}
					_this.setData({
						safeGroupList: [_safeGroupList],
						safeGroupPicker: true
					})
				}
			},
			failcb: function(res){
				_this.showToast('获取数据失败', 'none', failPng)
			}
		})
	},

	/**
	 * @desc 确认加入安全组回调
	 */
	joinSafeGroup: function(e){
		console.log(e)
		let _this = this
		let sgId = e.detail.choosedData[0]['id'] 
		let params = {
			machines:[_this.data.hostInfo._id],
			sg_id:sgId
		}
		netRequest({
			url: api.optionSafeGroup,
			method:'POST',
			data:params,
			success: function(res){
				_this.showToast('加入安全组成功','success')
				_this.getHostList(_this.data.areaId)
			},
			failcb: function(res){
				_this.showToast('加入安全组失败', 'none', failPng)
			}
		})
		this.setData({
			safeGroupPicker:false
		})
	},

	/**
	 * @desc 取消加入安全组
	 */
	cancleJoinSafeGroup: function(){
		this.setData({
			safeGroupPicker:false,
		})
	},

/**
 * @desc 确认移除安全组Modal
 * @parma {num} hostId
 * @parma {num} sgId 当前主机所在安全组id sg_id
 */
	confirmUnbindSafeGroup: function (hostId,sgId){
		let _this = this
		wx.showModal({
			title: '移除安全组',
			content: '确认移除安全组',
			success(res) {
				if (res.confirm) {
					_this.unbindSafeGroup(hostId, sgId)
				}
			}
		})
	},

/**
 * @desc 确认移除安全组
 * @parma {num} hostId
 * @parma {num} sgId 当前主机所在安全组id sg_id
 */
	unbindSafeGroup: function (hostId, sgId){
		let _this = this
		let params = {
			machines:hostId,
			sg_id: sgId
		}
		netRequest({
			url: api.optionSafeGroup + '?vm_id=' + hostId + "&sg_id=" + sgId,
			method:'DELETE',
			data:params,
			success: function(res){
				if(res.code === 1){
					_this.showToast('移除安全组成功','success')
					_this.getHostList(_this.data.areaId)
				} else {
					_this.showToast('移除安全组失败', 'none', failPng)				
				}
			},
			failcb: function(res){
				_this.showToast('移除安全组失败', 'none', failPng)			
			}
		})
	},
/**
 * @desc 判断是否可以新购云盘
 */
	canCreateDataDisk: function(hostInfo) {  
		let canCreate = false;
		let dataDiskList = [];
		let constantScenarioCombo = hostInfo['can_update'] === '0' && hostInfo['scene_combo_id'] != null;
		let areaList = this.data.areaList
		for(var j = 0; j < hostInfo.stor.length; j++){
			if (!hostInfo.stor[j]['is_system']){
				dataDiskList.push(hostInfo.stor[j])
			}
		}
	
		if (hostInfo) {
			canCreate = !constantScenarioCombo && !hostInfo['isExpiration'] &&	dataDiskList.length < 5;
		}
		return canCreate;
	},

/**
 * @desc 判断是否可以云盘扩容
 */
	canExtensionDisk: function (hostInfo) {
		let canExtension = false;
		let constantScenarioCombo = hostInfo['can_update'] === '0' && hostInfo['scene_combo_id'] != null;

		if (hostInfo) {
			canExtension = !!hostInfo.stor[0] && !hostInfo['isExpiration'] && !constantScenarioCombo;
		}
		return canExtension;
	},

	/**
	 * @desc 判断是否可以进行绑定IP操作
	 * @param {object} 主机信息 | can_update | scene_combo_id 应用场景id | can_bind_ip_count 可绑定ip数 | isExpiration true/false 过期/未过期
	 */
	canBindIP: function (hostInfo) {
		let canBind = false;
		let constantScenarioCombo = hostInfo['can_update'] === '0' && hostInfo['scene_combo_id'] != null;
		canBind = !constantScenarioCombo &&
			!!hostInfo['can_bind_ip_count'] && !hostInfo['isExpiration'];
		return canBind
	},

	/**
	 * @desc 判断是否可以进行解绑ip操作
	 * @param {object} 主机信息 | can_update | scene_combo_id 应用场景id | ip 已绑定ip列表 | isExpiration true/false 过期/未过期
	 */
	canUnbindIP: function (hostInfo) {
		let canUnbind = false;
		let constantScenarioCombo = hostInfo['can_update'] === '0' && hostInfo['scene_combo_id'] != null;
		canUnbind = !!hostInfo.ip[0] && !hostInfo['isExpiration'] && !constantScenarioCombo;
		return canUnbind
	},
	
	/**
	 * @desc 判断是否可以进行购买单机带宽操作
	 * @param {object} 主机信息 | can_update | scene_combo_id 应用场景id | is_in_group 是否在共享带宽组中 true/false 在/不在 | isExpiration true/false 过期/未过期
	 */
	canExtensionBandwidth: function (hostInfo) {
		let canExtension = false;
		let constantScenarioCombo = hostInfo['can_update'] === '0' && hostInfo['scene_combo_id'] != null;
		canExtension = !hostInfo['is_in_group'] && !hostInfo['isExpiration'] && !constantScenarioCombo;
		return canExtension
	},

	/**
	 * @desc 判断是否可以加入共享带宽组操作
	 * @param {object} 主机信息 | ip 已绑定ip列表 | is_in_group 是否在共享带宽组中 true/false 在/不在 | isExpiration true/false 过期/未过期
	 */
	canJoinShareGroup: function (hostInfo) {
		let canJoin = false;
		canJoin = !hostInfo['is_in_group'] && !!hostInfo.ip[0] && !hostInfo['isExpiration']
		return canJoin
	},

	/**
	 * @desc 判断是否可以移除共享带宽组操作
	 * @param {object} 主机信息 | is_in_group 是否在共享带宽组中 true/false 在/不在 | isExpiration true/false 过期/未过期
	 */
	canUnbindShareBG: function (hostInfo) {
		let canUnbind = false;
		canUnbind = !!hostInfo['is_in_group'] && !hostInfo['isExpiration'];
		return canUnbind
	},


/**
  * @desc 判断是否可以加入安全组
	* @param {object} | safe_group 安全组列表 | isExpiration true/false 过期/未过期
 */
	canJoinSafeGroup : function (hostInfo) {
		let canJoin = false;
		canJoin = !hostInfo['safe_group'][0] && !hostInfo['isExpiration'];
		return canJoin
	},

	/**
	 * @desc 判断是否可以移除安全组
	 * @param {object} | safe_group 安全组列表  | isExpiration true/false 过期/未过期
	 */
	canUnbindSafeGroup : function (hostInfo) {
		let canUnbind = false;
		canUnbind = !!hostInfo['safe_group'][0] && !hostInfo['isExpiration'];
		return canUnbind;
	},

	/**
	 * @desc 点击操作btn设置当前操作主机的id
	 */
	onOptionHost : function(e) {
		var _option = [];
		let hostInfo = e.target.dataset.hostinfo;
		let status = hostInfo.status;
		switch (status) {
			case '0':
				_option = this.getOptionListStatus0(hostInfo);
				break;
			default:
				break;
		}
		this.setData({
			option:[_option],
			hostId: hostInfo._id,
			hostInfo: hostInfo,
			pickerDisable:false,
		})
		return _option;
	},

	/**
	 * @desc 主机状态为0的操作列表
	 * @param {object} hostInfo 当前主机信息
	 * @return {array} _optionList 
	 */
	getOptionListStatus0 : function (hostInfo) {
		var _optionList = ['开机']
		hostInfo['isExpiration'] && !hostInfo['isAutoRenew'] ? _optionList.push('续费') : _optionList = _optionList
		!hostInfo['isAutoRenew'] ? _optionList.push('自动续费') : _optionList = _optionList
		this.canBindIP(hostInfo) ? _optionList.push('绑定IP') : _optionList = _optionList
		this.canUnbindIP(hostInfo) ? _optionList.push('解绑IP') : _optionList = _optionList
		this.canCreateDataDisk(hostInfo) ? _optionList.push('新购云盘') : _optionList = _optionList
		this.canExtensionDisk(hostInfo) ? _optionList.push('云盘扩容') : _optionList = _optionList
		this.canExtensionBandwidth(hostInfo) ? _optionList.push('购买单机带宽') : _optionList = _optionList
		this.canJoinShareGroup(hostInfo) ? _optionList.push('加入共享带宽组') : _optionList = _optionList
		this.canUnbindShareBG(hostInfo) ? _optionList.push('移除共享带宽组') : _optionList = _optionList
		this.canJoinSafeGroup(hostInfo) ? _optionList.push('加入安全组') : _optionList = _optionList
		this.canUnbindSafeGroup(hostInfo) ? _optionList.push('移除安全组') : _optionList = _optionList
		_optionList.push('服务器初始登录账号/密码')
		console.log(_optionList)
		return _optionList;
	},

	/**
	 * @desc 判断是否可以关机
	 */

	/**
	 * @desc 点击区域筛选之后的回调
	 */
	getDate: function (e) {
		let _areaId = e.detail.areaId
		this.getHostList(_areaId)
		this.setData({
			areaId: _areaId
		})
	},

	/**
	 * @desc 获取主机列表
	 */
	getHostList: function (areaId) {
		let _this = this;
		let params = {
			page_no:_this.data.pageNo,
			page_size:_this.data.pageSize,
		}
		if(areaId){
			params.area_id = areaId
		}
		netRequest({
			url: api.host,
			method: 'GET',
			data:params,
			success: function (res) {
				if (res.code === 1) {
					wx.hideLoading();
					let _epcList = []
					let _vmId = ''
					if (res.rows.instanceList && res.rows.instanceList[0]) {
						res.rows.instanceList.map((instance) => {
							if(_vmId){
								_vmId = _vmId + "," +instance._id
							}else{
								_vmId = _vmId + instance._id
							}
						})
					}
					_this.setData({
						epcList: res.rows.instanceList,
						hostIdStr: _vmId,
					})
				}
			},
			failcb: function (res) {
				_this.showToast('加载数据失败', 'none', failPng)
			},
		})
		//定时获取主机状态
		// if (_this.data.timer === '') {
		// 	_this.setData({
		// 		timer: setInterval(function () {
		// 			_this.getMachineStatus()
		// 		}, 5000)
		// 	})
		// }
	},

	/**
	 * @desc 获取主机状态
	 */
	getMachineStatus: function () {
		let _hostIdStr = this.data.hostIdStr;
		let _this = this
		if (_hostIdStr){
			let params = {
				vm_id: _hostIdStr
			}
			netRequest({
				url: api.getMachineStatus,
				method: 'GET',
				data: params,
				success: function (res) {
					if (res.code === 1) {
						// wx.hideLoading();
						let _epcList = _this.data.epcList
						let machineList = res && res.rows ? res.rows : [];
						if(res.rows && res.rows[0]){
							for (var i = 0; i < _epcList.length; i++) {
								let id = _epcList[i]._id
								_epcList[i].status = machineList[id].state;

							}
						}
						_this.setData({
							epcList: _epcList,
						})
					}
				},
				failcb: function (res) {
					_this.showToast('加载数据失败', 'none', failPng)
				},
			})
		}
	},

	/**
	 * @desc 清除查询主机状态定时器
	 */
	clearIntervalTime: function(){
		if(this.data.timer){
			clearInterval(this.data.timer)
			this.setData({
				timer:''
			})
		}
	},

	/**
	 * @desc 点击购买btn回调
	 */
	createEpc: function(){
		wx.navigateTo({
			url:  '/pages/createEpc/createEpc',
		})
	},

	/**
	 * 滑动到底部加载后续数据
	 */
	bindDownLoad: function(event) {
		console.log("laodingmore")
	},

	onPullDownRefresh: function() {
		console.log("fresh")
	},


	topLoad: function() {
		console.log('shangla ')
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中',
		})
		let _this = this;
		wx.getSystemInfo({
			success: function(res) {
				let _scrollHeight = res.windowHeight - 50 
				_this.setData({
					scrollHeight: _scrollHeight
				});
			},
		})

		_this.getHostList();
		netRequest({
			url: api.getAreaList,
			method:'GET',
			success: function (res) {
				if(res.code === 1){
					let areaObj = {
						area_id : '',
						name:'全部',
					}
					res.rows.push(areaObj)
					_this.setData({
						areaList:res.rows,
					})
				}
			}
		})
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
		this.getHostList();
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
		this.clearIntervalTime()
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