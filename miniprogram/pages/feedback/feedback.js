
Page({

  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    //被选中的图片路径数组
    chooseImgs:[],
    //文本域的内容
    textValue:""

  },

//图片数组
imgs:[],

  //标题的点击事件 从子组件传递过来的
  handleTabsItemChange(e) {
    //1.获取被点击的标题索引 
    const { index } = e.detail;
    //2.修改数组源
    let { tabs } = this.data;
    tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false);
    //3.赋值到data中
    this.setData({
      tabs
    })

  },

  //点击加号选择图片
  handleChooseImg(){

    //调用小程序内置选择图片api
    wx.chooseImage({
      //同时选中的图片数量
      count:9,
      //图片格式 原图 压缩
      sizeType:['original','compressed'],
      //图片的来源
      sourceType:['album','camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          //图片数组拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
    })


  },

  //
  handleRemoveImg(e){
    //获取被点击的所以
    const {index}=e.currentTarget.dataset;
    //获取data中的图片数组
    let {chooseImgs}=this.data;
    //删除元素
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },

  //文本域的输入事件
  handleTextInput(e){
   this.setData({
     textValue:e.detail.value
   });
  },

  //提交按钮事件
  handleFormSubmit(){
    //获取文本域的内容 图片数组
    const { textValue, chooseImgs}=this.data;
    //合法性校验
    if(!textValue.trim()){
      wx.showToast({
        title: '输入不合法',
        icon:'none',
        mask:true
      });
      return;
    }

    //显示正在上传图标
    wx.showLoading({
      title: "正在上传中",
      mask:true
    });

    //判断有没有需要上传的图片 
    if (chooseImgs.length!=0){

    //准备上传图片到服务器
    chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        //图片上传到哪里
        url: 'https://images.ac.cn/Home/Index/UploadAction',
        //被上传文件的路径
        filePath: v,
        //上传文件的名称
        name: "file",
        success:(result)=>{
          console.log(result);
          let url=JSON.parse(result.data).url;
          this.imgs.push(url);
          if (i === chooseImgs.length-1){

            wx.hideLoading();
            //文本域和图片都提交到后台

            //重置页面
            this.setData({
              textValue:"",
              chooseImage:[]
            })
            // 返回上一个页面
            wx.navigateBack({
              delta:1
            })

          
          }
        }
      });
    })  
    } else{
      console.log("只是提交了文本")
      wx.hideLoading();
      wx.navigateBack({
        delta:1 
      });
    }
  }  
})