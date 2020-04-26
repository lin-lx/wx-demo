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
    //楼层数据取出的query值
    queryUrl: []
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
    var queryUrl=new Array();
    var navigatorUrl;
    request({
        url: "/home/floordata"
      })
      .then(result => {
        this.setData({
          floorList: result
        });
        let product_list = result.map(v => v.product_list);
        product_list.forEach(item => {
          item.forEach(item => {
            let navigator_url = item.navigator_url;
            let navigatorUrlOne = (navigator_url).substring(0, 17);
            let query = navigator_url.substring(17);
            navigatorUrl = navigatorUrlOne + "/goods_list" + query;
            queryUrl.push(navigatorUrl);
          })        
        });
        this.setData({
          queryUrl
        })

      })

  },
})