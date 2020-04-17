import { request } from "../../request/index.js";

Page({
  data: {
    goodsObj:{},
    //商品是否被收藏过
    isCollect:false
  },

  GoodsInfo:{},



  onShow: function () {
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id); 

  },

  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id }});
    this.GoodsInfo=goodsObj;
    //获取缓存中的商品收藏数组
    let collet = wx.getStorageSync("collect") || [];
    //判断当前商品是否被收藏
    let isCollect = collet.some(v => v.goods_id === this.GoodsInfo); 
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //iphone 部分手机不识别webp图片格式
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect    
    })
  },
  //点击图片放大预览
  handlePreviewImage(e){
    //先构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    //接收传递过来的url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    })
  },
  //点击加入购物车
  handleCartAdd(){
   
    //1.获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    //2.判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id==this.GoodsInfo.goods_id);
    if(index===-1){
      //不存在，第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //已经存在购物车中，执行num++
      cart[index].num++;
    }
    //把购物车重新添加回缓存中
    wx.setStorageSync("cart",cart);
    //弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon:'success',
      //防止用户一直点击
      mask:true
    });
  },

  //点击商品收藏图标
  handleCollect(){
    let isCollect=false;
    //获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //当index不等于-1，表示已收藏过
    if(index!==-1){
      //已经收藏过，在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消收藏成功',
        icon:'success',
        mask:true
      });
    }else{ 
      //没有被收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    //把数组存入缓存中
    wx.setStorageSync("collect", collect);
    //修改data中的属性
    this.setData({
      isCollect
    });
  }

})