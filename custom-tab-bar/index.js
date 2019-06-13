// component/custom-tab-bar.js
Component({
	/**
	 * 组件的属性列表
	 */
	/**
	 * 组件的初始数据
	 */
	data: {
		selected:0,
		color:'#7A7E83',
		selectedColor:'#a6b0dc',
		list:[
			{
				pagePath: "/pages/dashboard/dashboard",
				iconPath: "/images/home.png",
				selectedIconPath: "/images/home-selected.png",
				text: "控制台"
			},
			{
				pagePath: "/pages/vvcloud/vvcloud",
				iconPath: "/images/fire.png",
				selectedIconPath: "/images/fire-selected.png",
				text: "热点"
			},             
			{
				pagePath: "/pages/user/user",
				iconPath: "/images/user.png",
				selectedIconPath: "/images/user-selected.png",
				text: "我的"
			}
		],
	},

	attached() {
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			console.log("coming" + data.path)
			wx.switchTab({
				url:url
				})
			this.setData({
				selected: data.index
			})
		}
	}
})
