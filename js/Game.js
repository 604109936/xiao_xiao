(function(){
	
	var Game=window.Game=function(){
		this.myCanvas=document.querySelector("canvas");
		this.ctx=this.myCanvas.getContext("2d");
		this.timer=null;//定时器
		this.R=null;//图片的资源管理
		this.zheng=0;
		
		this.dengJi=1;
		this.score=0;
		this.time=60;
		
		this.lianJiCount=0;
		this.lianjiTime=10;
		
		//这里是精灵的行和列的个数，一改全改
		this.sprit_rowAndcol=7;
		
		
		this.callbacks_obj={};//这里面会动态的添加json里面是存放的是多少帧以后执行的函数
		
		this.stateCode="检查";//设置状态码，首先进来显示的状态码是检查状态，然后判断看是进入静稳状态还是，爆炸下落补齐
		
		
		
		//适配手机屏幕大小,设置画布的宽高，必须先设置在计算显示矩阵的矩阵的相关数据
		this.mobilScreen();
		
		
		//计算显示的矩阵相关的数据
		this.basex = 6; 			//矩阵的初始与背景的X值
		this.paddingBottom = 70; 	//矩阵与背景图底部的数据
		this.spritewh =  (this.myCanvas.width - this.basex * 2) / this.sprit_rowAndcol; //（精灵的宽高）宽度、高度，因为是正方形所以一样，
		this.basey = this.myCanvas.height - this.spritewh * this.sprit_rowAndcol - this.paddingBottom;  //矩阵的初始与背景的y值
			
		//备份
		var self=this;
		
		//加载图片，及加载完成后回调函数开启游戏
		this.alreadyLoad(function(){
			

			//实例化地图类
			self.map=new Map();
			
			//实例化场景管理类 ,并且一开始就进入开始界面0场景
			self.scene=new Scene();

			//实例化小球的管理类
			self.manage=new Manage();
			
			self.scene.enter(0);
			
			game.startAfterManyFrameDo(100,function(){
				console.log("我是每100帧之后要执行的内容");
			});
			
			//以及游戏开始
			self.start();
			
		});
	}
	
	//适配手机端屏幕的方法
	Game.prototype.mobilScreen=function(){
		this.myCanvas.width=document.documentElement.clientWidth>420 ? 420 : document.documentElement.clientWidth;
		this.myCanvas.height=document.documentElement.clientHeight>760 ? 760 : document.documentElement.clientHeight;
	}
	
	//加载游戏资源方法
	Game.prototype.alreadyLoad=function(callback){
			
			var R={};
			
			var R_music={};
			var readCount=0;
			var allAmount=0;
			var xhr=new XMLHttpRequest();
			
			var self=this;
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					var obj=JSON.parse(xhr.responseText);
//					console.log(obj);
					allAmount=obj.images.length;
					for(var i=0; i<obj.images.length; i++){
						var arr=obj.images;
						R[arr[i].name]=new Image();
						R[arr[i].name].src=arr[i].url;
					}
					
					//一开始先显示第一张图片
					//设置绘制文本字体及颜色
					self.ctx.fillStyle="red";
		    		self.ctx.font="16px 宋体";
					self.ctx.textAlign="center";
					self.ctx.fillText("当前游戏资源正在加载第"+readCount+"个/"+allAmount,self.myCanvas.width/2,self.myCanvas.height*0.314);
					
					for(key in R){
						R[key].onload=function(){
							readCount++;
							self.ctx.clearRect(0,0,self.myCanvas.width,self.myCanvas.height);
							self.ctx.textAlign="center";
							self.ctx.fillText("当前游戏资源正在加载第"+readCount+"个/"+allAmount,self.myCanvas.width/2,self.myCanvas.height*0.314);
							
							if(readCount==allAmount){	
								self.R=R;
								callback();
							}
						}
					}
				}
			}
			xhr.open("get","R.json",true);
			xhr.send();
	}
	//显示针在屏幕上的方法
	Game.prototype.showZheng=function(){
		this.ctx.fillStyle="red";
		this.ctx.font="20px 宋体";
		this.ctx.textAlign="center";
		this.ctx.fillText(this.zheng,50,50);
	}

	//渲染底层背景图片的方法
	Game.prototype.rend_back_ori=function(){
		this.ctx.drawImage(game.R.first_1,0,0,this.myCanvas.width,this.myCanvas.height);
		this.ctx.drawImage(game.R.score,50,20,this.myCanvas.width,54);
		
		
		game.ctx.fillStyle="white";
		game.ctx.font="14px 宋体";
		game.ctx.textalign="center"
		
		game.ctx.fillText("等级",160,45);
		game.ctx.fillText(this.dengJi,160,58);
		
		game.ctx.fillText("剩余时间",260,40);
		game.ctx.fillText(this.time,260,55);
		
		game.ctx.fillText("分数",360,45);
		game.ctx.fillText(this.score,360,58);
		
	}
	
	
	//清除画布的方法
	Game.prototype.clear=function(){
		this.ctx.clearRect(0,0,this.myCanvas.width,this.myCanvas.height);
	}

	//这个地方是启动多少帧之后执行功能函数的声明部分
	Game.prototype.startAfterManyFrameDo=function(num,callback){
		this.callbacks_obj[num+this.zheng]=callback;
	}
	
		//游戏开启的方法
		Game.prototype.start=function(){
		var self=this;
		this.timer=setInterval(function(){
			//让针跑起来
			self.zheng++;
			
			//清屏
			self.clear();

			
			//调用场景类的渲染更新方法，在那个里面判断不同的场景进行不同的更新与渲染
			self.scene.renderAndUpdate();
			
			
			//针显示的动画
//			self.showZheng();
			
			
			//实时检测有没有满足当前帧情况的函数要执行
			
			if(self.callbacks_obj[self.zheng]){
				self.callbacks_obj[self.zheng]();
			}
			
			//时间减少
			if(self.zheng%50==0){
				
				game.time--;
				game.lianjiTime--;
			}

			if(game.lianjiTime<0){
				game.lianjiTime=10;
				game.lianJiCount=0;
			}
			if(game.scene.enterCase==1){
				//如果时间没有了进入下一个场景
				if(game.time==0){
					game.scene.enter(2);
				}

			}		
		},20)
	}
	Game.prototype.timeGo=function(){
		this.time-=10;
	}
	
})()
