import { request } from "../../request/index.js";

Page({
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],

  onLoad: function (options) {
    //使用缓存技术
    // 1.判断本地存储中有没有旧数据
    // 2.没有旧数据，直接发送请求
    // 3.有旧数据，同时旧数据没有过期，就使用存储中的数据即可

    //1.获取本地存储的数据
    const Cates=wx.getStorageSync("cates");
    //2. 判断
    if(!Cates){
      //不存在 发送请求获取数据
      this.getCates();
    }else{
      //有旧的数据 定义一个过期时间
      if(Date.now()-Cates.time>1000*10){
        //重新发送请求
        this.getCates();
      }else{
        //可以使用旧的数据
        this.Cates=Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList, rightContent
        })
      }
    }
  },

  //获取分类数据
  async getCates(){
    // request({
    //   url: '/categories' 
    // })
    // .then(res=>{
    //   this.Cates=res.data.message;
    //   //把接口数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    //   //构造左侧的菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品数据
    //   let rightContent=this.Cates[0].children
    //   this.setData({
    //     leftMenuList, rightContent
    //   })
    // })

    //1.使用es7的asnyc await来发送请求
    const res = await request({url: '/categories'});
      this.Cates=res;
      //把接口数据存入到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
      //构造左侧的菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品数据
      let rightContent=this.Cates[0].children
      this.setData({
        leftMenuList, rightContent
      })
  },

  //左侧菜单的点击事件
  handleItemTap(e){
    // 1.获取被点击的标题身上的索引
    const {index}=e.currentTarget.dataset;
     // 2.给data中的currentIndex赋值
     // 3.根据不同的索引渲染右侧商品数据
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
       //重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    })
  } 
})