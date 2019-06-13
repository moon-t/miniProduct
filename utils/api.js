const api = {
	login: '/api/v1/webservices/account/login',//登录
	getVerifyImg:'/api/v1/webservices/verifycode',//获取图片验证
	host:'/api/v1/webservices/host',//获取Epc列表
	getAreaList:'/api/v1/webservices/area',//获取区域列表
	getMachineStatus:'/api/v1/webservices/host/status',//获取主机状态
	updateMachineRenewStatus:'/api/v1/webservices/host/auto-renew-state',//主机自动续费
	getLineListByArea:'/api/v1/webservices/network/area',//通过区域id获取线路列表
	getIpListByArea:'/api/v1/webservices/network/ip/available',//通过lineId、areaId获取可绑定ip列表
	updateBindIp:'/api/v1/webservices/network/machine/ip',//绑定IP
	getCreateDataDiskInfo:'/api/v1/webservices/storage/buy-disk-info',//获取可购买的数据盘类型
	getDiskPriceArea:'/api/v1/webservices/storage/price',//获取云盘价格
	optionBandGroup: '/api/v1/webservices/bandwidth/group/machine',//解绑共享带宽组|绑定主机到共享带宽组
	getBandGroup:'/api/v1/webservices/bandwidth/group-machine-can-join',//获取可绑定共享带宽组列表
	getSafeGroup:'/api/v1/webservices/network/machine/safe-groups-joinable',//获取可绑定安全组列表
	optionSafeGroup:'/api/v1/webservices/network/safe-groups/machines',//安全组操作
}
export default api;