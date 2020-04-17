import { request } from "../../request/index.js";

Page({

  data: {
    goods:[],
    //取消按钮是否显示
    isFouce:false,
    //输入框的值
    inputValue:""

  },
  timeId: -1,
  //输入框值改变触发
  handleInput(e){
    //获取输入框的值
    const {value}=e.detail;
    //合法性校验
    if(!value.trim()){
      this.setData({
        goods:[],
        isFouce:false
      })
      return;
    }
    //准备发送请求获取数据
    this.setData({
      isFouce:true
    })
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => { 
      this.qsearch(value);
      },1000)
    
    
  },
  // 发送请求
   async qsearch(query){
     const goods = await request({ url: "/goods/qsearch", data: {query}});
     console.log(goods);
     this.setData({
       goods: goods
     })

  },

  //点击取消按钮
  handleCancel(){
    this.setData({
      inputValue:"",
      isFouce:false,
      goods:[]
    })
  }

})