import { request } from "../../request/index.js";

Page({
  data: {
    orders:[],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      }, 
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },

  onShow(){
    //授权
    // const token=wx.getStorageSync("token");
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   });
    //   return;
    // }
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    //获取url上的type参数
    const {type}= currentPage.options; 
    //激活选中页面标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type);

  },

  //获取订单列表
  async getOrders(type){
    const res = await request({ url:"/my/orders/all",data:{type}});
    console.log(res);
    this.setData({
      orders:res.orders
    })
  },


  //根据标题索引来激活选中 
  changeTitleByIndex(index){
    //2.修改数组源
    let { tabs } = this.data;
    tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false);
    //3.赋值到data中
    this.setData({
      tabs
    })
  },
  //标题的点击事件 从子组件传递过来的
  handleTabsItemChange(e) {
    //1.获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求
    this.getOrders(index+1);
  },

})