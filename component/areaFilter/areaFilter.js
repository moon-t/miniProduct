// component/filter/filter.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
			propAreaArray:{
				type:Array,
			}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		areaShow: false,
		nowText: '全部地区',//初始内容
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		
		selectToggle: function () {
			console.log(this.data)
			var nowShow = this.data.areaShow;//获取当前option显示的状态
			this.setData({
				areaShow: !nowShow
			})
		},

		//设置内容
		setText: function (e) {
			var nowData = this.properties.propAreaArray;//当前option的数据是引入组件的页面传过来的，所以这里获取数据只有通过			this.properties
			var nowIdx = e.target.dataset.index;//当前点击的索引
			var nowText = nowData[nowIdx].name;//当前点击的内容
			var nowId = e.target.dataset.id;
			this.setData({
				areaShow: false,
				nowText: nowText,
			})
			var nowDate = {
				id: nowIdx,
				name: nowText,
				areaId: nowId,
			}
			this.triggerEvent('myget', nowDate)
		}
	}
})
