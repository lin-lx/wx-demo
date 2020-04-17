import { request } from "../../request/index.js";

import { login } from "../../utils/asyncWx.js"
Page({
//获取用户信息
  async handlegetUserInfo(e){
    //获取用户信息
    const { encryptedData, rawData, iv, signature}=e.detail;
    //获取小程序登录成功后的code值
    const {code}=await login();
    const {loginParams} = { encryptedData, rawData, iv, signature,code};
    //发送请求获取用户的token
    const token = await request({ url: "/users/wxlogin", data: loginParams,method:"post" });
    console.log(token)
    //把token存入缓存中，同时跳回上一个页面
    wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
    wx.navigateBack({
      delta:1
    });
  }
})