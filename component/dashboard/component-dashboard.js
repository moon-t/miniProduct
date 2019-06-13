// component/dashboard/component-dashboard.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		list:[
			{
				text:'EPC',
				iconName:'iconfont icondaohang--wuliyunzhuji',
				pagePath:'/pages/epc/epc',
			},
			{
				text: '硬盘',
				iconName: 'iconfont icondaohang--kuaicunchu',
				pagePath: '/pages/epc/epc',
			},
			{
				text: '弹性公网',
				iconName: 'iconfont icondaohang--tanxinggongwangIP',
				pagePath: '/pages/epc/epc',
			},
			{
				text: 'NAT',
				iconName: 'iconfont icondaohang--NATwangguan',
				pagePath: '/pages/epc/epc',
			},
			{
				text: 'VPC',
				iconName: 'iconfont icondaohang--zhuanxianwangluo',
				pagePath: '/pages/epc/epc',
			},
		]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		navigateTo(e) {
			console.log(e)
			wx.navigateTo({
				url: e.currentTarget.dataset['pagepath'],
			})
		} 
	}
})
