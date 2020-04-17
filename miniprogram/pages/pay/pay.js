
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"

import { request } from "../../request/index.js";


Page({

  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({ address });
   
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
   
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
    wx.setStorageSync("cart", cart);
  },

  //支付
  async handleOrderPay(){
    //判断缓存中有没有token
    const token=wx.getStorageSync("token")
    console.log(token);
    //判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    //创建订单
    //准备请求头参数 
    //const header = { Authorization: token };
    //准备请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_num:v.num,
      goods_price:v.goods_price
    }))
    const orderParams = { order_price, consignee_addr, goods};
    //准备发送请求 创建订单 获取订单编号
    const {order_number} = await request({ url:"/my/orders/create",method:"post",data:orderParams});

    //准备发起预支付接口
    const {pay} = await request({ url: "/my/orders/req_unifiedorder", method: "post",data:{order_number}});

    //发起微信支付
    await requestPayment(pay);
    

    //查询订单状态
    const res = await request({ url: "/my/orders/chkOrder", method: "post", data: { order_number }})
    await wx.showToast({title: '支付成功'});
    //删除缓存中已经支付了的数据
    let newCart=wx.getStorageSync("cart");
    newCart=newCart.filter(v=>v.checked);
    wx.setStorageSync("cart", newCart);

    //支付成功 跳回订单页面
    wx.navigateTo({
      url: '/pages/order/order',
    });
  } 
})

