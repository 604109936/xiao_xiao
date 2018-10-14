(function(){
	
	var Scene=window.Scene=function(){
		//进入场景的case情况,默认为0场景
		this.enterCase=0;

		this.addBindEvent();
		
		this.arrCheck=[];
		
//		this.if_xiaoqiu=true;
	}
	
	//这里是给绑定的事件分场景来处理
	Scene.prototype.addBindEvent=function(){
		var self=this;
		switch(this.enterCase){
			case 0:
				game.myCanvas.onclick=function(event){
					var event=event || window.event;
					var x=event.clientX;
					var y=event.clientY;
					
					if(
						x>(game.myCanvas.width-140)/2 && x<(game.myCanvas.width-140)/2+140
						&& y>game.myCanvas.height-3*60-30 && y<game.myCanvas.height-3*60-30+60
					  )
					{
						game.scene.enter(1);
						
					}else if(
						x>(game.myCanvas.width-140)/2 && x<(game.myCanvas.width-140)/2+140
						&& y>game.myCanvas.height-2*60-30 && y<game.myCanvas.height-2*60-30+60
						
					){
						
						if(ifMusic==true){
							music.play();
							ifMusic=!ifMusic;
						}else{
							ifMusic=!ifMusic;
							music.pause();
						}
						
						
					}else if(
						x>(game.myCanvas.width-140)/2 && x<(game.myCanvas.width-140)/2+140
						&& y>game.myCanvas.height-1*60-30 && y<game.myCanvas.height-1*60-30+60
						
					){
						window.location="http://www.4399.com";
					}
					
				}
			break;
			
			case 1:
//				console.log("我被点了");
				var self = game;
				game.myCanvas.onmousedown = function(event){
					
					
					
					
					
					
					//如果分数大于10就进入下一关
					
//					if(game.score==10){
//						if(game.score<20){
//							game.dengJi=2;
//							game.time=50;
//						}else if(game.score<30){
//							
//						}
//					}
					

				switch(game.score){
					case 10:
						game.dengJi=2;
						game.time=50;
					break;
					
					case 20:
						game.dengJi=3;
						game.time=40;
//					break;
					
					case 30:
						game.dengJi=4;
						game.time=30;
//					break;
					
					case 40:
						game.dengJi=5;
						game.time=20;
					break;
				}
					
					
					
					
					
					
					
					//如果当期那的状态机不是静稳状态，那么点击是无效的
//					console.log("我真的北点le");
//					console.log(self.stateCode);
					if(self.stateCode =="正在动画") return;
		
					var x = event.offsetX;
					var y = event.offsetY;
					//判断当前的鼠标点在了哪个元素身上
					//先根据鼠标的x值来决定点击到了第几列上，两边padding是12，精灵宽度是7分之一的屏幕宽度。
					//看x中蕴含了多少个精灵宽度，就是点击到了第几列
					var startCol = parseInt(x / self.spritewh);
					var startRow = parseInt((y - self.basey) / self.spritewh);
		
					//验收
					if(startCol < 0 || startCol > 6 || startRow < 0 || startRow > 6){
						return;
					}
		
					self.myCanvas.onmousemove = function(event){
						var x = event.offsetX;
						var y = event.offsetY;
						//终点元素
						var targetCol = parseInt(x / self.spritewh);
						var targetRow = parseInt((y - self.basey) / self.spritewh);
						//验收
						if(targetCol < 0 || targetCol > 6 || targetRow < 0 || targetRow > 6){
							self.myCanvas.onmousemove = null;
							return;
						}
		
						//等待鼠标移动到旁边的元素上
						//要么行号一样，列号差1；要么列号一样，行号差1。
						if(
							startRow == targetRow && Math.abs(targetCol - startCol) == 1
							||   //这是一个或者符号
							startCol == startCol && Math.abs(targetRow - startRow) == 1
						){
							self.myCanvas.onmousemove = null;
							//调用交换函数
							self.map.exchangeElem(startRow,startCol,targetRow,targetCol);
						}
					}
				}
				
				
		
				game.myCanvas.onmouseup = function(){
					self.myCanvas.onmousemove = null;
				}
					
			break;	
			
				
			case 2:
				

				game.manage.canvas.onclick=function(event){
					var event=event || window.event;
//					440 480
//					console.log(event.clientY);
					var x=event.clientX;
					var y=event.clientY;
					
					if(
						x>(game.myCanvas.width-53) && x<(game.myCanvas.width-33)
						&& y>440&& y<480
					  )
					{
						game.score=0;
						game.time=60;
						game.dengJi=1;
						game.scene.enter(0);
						
					}
					
				}

			break;
		}
	}
	
	
	//这里是给渲染以及更新的函数来分场景处理
	Scene.prototype.renderAndUpdate=function(){
		
		
			switch(this.enterCase){
				
				case 0:
				
					
					game.ctx.drawImage(game.R.first_1,0,0,game.myCanvas.width,game.myCanvas.height);
					game.ctx.drawImage(game.R.first_2,0,0,game.myCanvas.width,game.myCanvas.height);
					game.ctx.drawImage(game.R.first_3,0,0,game.myCanvas.width,160);	
					game.ctx.drawImage(game.R.first_4,0,0,140,60,(game.myCanvas.width-140)/2,game.myCanvas.height-3*60-30,140,60);	
					game.ctx.drawImage(game.R.first_4,0,0,140,60,(game.myCanvas.width-140)/2,game.myCanvas.height-2*60-30,140,60);
					game.ctx.drawImage(game.R.first_4,0,0,140,60,(game.myCanvas.width-140)/2,game.myCanvas.height-1*60-30,140,60);
					
					game.ctx.fillStyle="white";
					game.ctx.font="25px 宋体";
					game.ctx.fillText("开始游戏",(game.myCanvas.width-140)/2+70,game.myCanvas.height-3*60);
					game.ctx.fillText("音乐打开",(game.myCanvas.width-140)/2+70,game.myCanvas.height-2*60);
					game.ctx.fillText("更多游戏",(game.myCanvas.width-140)/2+70,game.myCanvas.height-1*60);

					break;
				
				
				//这种情况进入消消乐的主界面
				case 1:

					
					//渲染最底层动画，因为这个背景没有动作所以不用封装类了
					game.rend_back_ori();
					
					//在这里调用渲染分数
					
					
					//让地图类渲染精灵
					game.map.render();//这不是异步语句不用管它
					
					
					/*
					 
					game.map.check();
					
					
					game.map.bobleAndRemove(game.map.check());//16帧
					game.map.dropdown();//20帧
					game.map.buQi();//20帧
					*/
					
					
					//根据状态码进入不同的情况
					
					
					switch(game.stateCode){
						case "检查":
							this.arrCheck=game.map.check();
							console.log(this.arrCheck);
							
							if(this.arrCheck.length!=0){
								game.stateCode="爆炸下落补齐"
							}else{
								game.stateCode="静稳";
							}

						break;
						
						case "静稳":
							console.log("进入静稳状态，等待点击交换");
							
							game.stateCode="无状态";
						break;
						
						case "爆炸下落补齐"://这个状态之后回到检查状态
						
							game.map.bobleAndRemove(this.arrCheck);//爆炸
							
							game.lianJiCount++;
			
							console.log("连击"+game.lianJiCount);
							
							switch(game.lianJiCount){
								case 1:
									game.startAfterManyFrameDo(5,function(){
										xiaoguo_music.src="R/music/e1.mp3";
										xiaoguo_music.load();
										xiaoguo_music.play();
									})
								break;
								
								case 2:
									game.startAfterManyFrameDo(5,function(){
										xiaoguo_music.src="R/music/e2.mp3";
										xiaoguo_music.load();
										xiaoguo_music.play();
									})
								break;
								
								case 3:
									game.startAfterManyFrameDo(5,function(){
										xiaoguo_music.src="R/music/e3.mp3";
										xiaoguo_music.load();
										xiaoguo_music.play();
									})
								break;
								
								case 4:
									game.startAfterManyFrameDo(5,function(){
										xiaoguo_music.src="R/music/e4.mp3";
										xiaoguo_music.load();
										xiaoguo_music.play();
									})
								break;
								
								case 5:
									game.startAfterManyFrameDo(5,function(){
										xiaoguo_music.src="R/music/e5.mp3";
										xiaoguo_music.load();
										xiaoguo_music.play();
									})
								break;
								
								case 6:
									game.startAfterManyFrameDo(5,function(){
										xiaoguo_music.src="R/music/e6.mp3";
										xiaoguo_music.load();
										xiaoguo_music.play();
									})
								break;
							}
							
							
							game.startAfterManyFrameDo(20,function(){//下落
								game.map.dropdown();
								
								
							});
							game.startAfterManyFrameDo(50,function(){//补齐
								game.map.buQi();
								
							});
							
							game.startAfterManyFrameDo(100,function(){//补齐之后回到检查状态
									this.arrCheck=game.map.check();
									if(this.arrCheck.length!=0){
										game.stateCode="爆炸下落补齐"
									}else{
										game.stateCode="静稳";
									}
//									game.stateCode="无状态";
							});
						game.stateCode="正在动画";	
						break;
				
					}
					
				break;
				
				case 2:
//					game.ctx.drawImage(game.R.pause,0,0,game.myCanvas.width,game.myCanvas.height);
					
					game.ctx.fillStyle="black";
					game.ctx.fillRect(0,0,game.myCanvas.width,game.myCanvas.height);
					
					game.ctx.drawImage(game.R.gameover,20,150,game.myCanvas.width-40,400);
					
					game.ctx.fillStyle="white";
					game.ctx.font="25px 宋体";
					game.ctx.fillText("最终等级："+game.dengJi,(game.myCanvas.width-140)/2+70,game.myCanvas.height/4);
					game.ctx.fillText("最终得分："+game.score,(game.myCanvas.width-140)/2+70,game.myCanvas.height/3);
					
					
				break;
			}
			
			
			
	}
	
	
	Scene.prototype.enter=function(num){
		this.enterCase=num;
		
		if(num==0){
			
			game.lianJiCount=0;
//			console.log(1);
			game.manage.canvas.height=game.myCanvas.height-3*60-30,140,60;
			
			
			game.map.code = [
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6),_.random(0,6)],
			[]
		];
		
		
		
				game.map.createSpritesByCode();
			
			
			
			
			
			
		}else if(num==1)
		{
			game.myCanvas.onclick=null;
			game.manage.canvas.height=game.myCanvas.height - game.spritewh * game.sprit_rowAndcol - game.paddingBottom;
			game.time=60;
			
			
		}else if(num=2){
			game.manage.canvas.height=game.myCanvas.height;
		}
		
		
		this.addBindEvent();
		
		
		
	}
	
	
})()

