import { request } from "../../request/index.js";

Page({

  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[],
    //总页数
    totalPages:1

  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();

    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 5000)
    
  },

  //获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    //获取总条数
    const total=res.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      //拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
  
  
  //标题的点击事件 从子组件传递过来的
  handleTabsItemChange(e){
   //1.获取被点击的标题索引
   const {index} =e.detail;
   //2.修改数组源
   let {tabs}=this.data;
   tabs.forEach((v,i)=>i==index?v.isActive=true:v.isActive=false);
   //3.赋值到data中
   this.setData({
     tabs
   })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom(){
   //1.判断还有没有下一页数据
    //没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages){
      wx.showToast({
        title: '没有下一页数据了'
      })
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
   //1.重置数组
   this.setData({
     goodsList:[]
   })
   //2.重置页码
   this.QueryParams.pagenum=1;
   //3.重新发送请求
   this.getGoodsList();
  }

})