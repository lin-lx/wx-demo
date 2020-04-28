import {
  request
} from "../../request/index.js";

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    //导航数组
    catesList: [],
    //楼层数据
    floorList: [],
  },
  //页面开始加载，就会触发
  onLoad(options) {
    //发送异步请求获取轮播图数据
    // wx.request({
    // url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    // success: (result) => {
    //   console.log(result.data.message)
    //   this.setData({swiperList:result.data.message})
    // }
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图数据
  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })


  },
  //获取导航数据
  getCateList() {
    request({
        url: "/home/catitems"
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },

  //获取楼层数据
  getFloorList() {
    let navigatorUrl;
    request({
        url: "/home/floordata"
      })
      .then(result => {
        let product_list = result.map(v => v.product_list);
        product_list.forEach(item => {
          item.forEach(item => {
            let navigator_url = item.navigator_url;
            let query = navigator_url.substring(17);
            navigatorUrl = "/pages/goods_list/goods_list" + query;
            item.navigator_url = navigatorUrl;
          })
        });
        //将楼层数据放入appData中
        this.setData({
          floorList: result
        });

      })
  },
})