(function(){
	
	var Sprite=window.Sprite=function(row,col,imageName){
		
		this.row=row;//记录下精灵当前的行
		this.col=col;//记录下精灵当前的列
		
		//接收精灵在R(json)中对应的图片的key值
		this.imageName=imageName;
		
		//判断精灵是否移动的信号量
		this.isMove=false;
		
		//这个是默认的小针数用来检测是否达到该时间然后让移动的信号量发生改变
		this.moveFno=0;
		
		
		//声明小精灵一帧移动的距离
		this.dx=0;
		this.dy=0;
		
		//小精灵是否爆炸的信号量
		this.isBomb=false;
		
		//判断小精灵是否爆炸完毕，完毕则不渲染显示了
		this.isHide = false;
		
		
		//给爆炸自己的时间帧，让时间变慢
		this.bombStep = 0;	//0~8
		
		
		//每个精灵自己在矩阵中的坐标，与自己的宽高
		this.x=game.basex + game.spritewh * col;
		this.y=game.basey + game.spritewh * row;
		this.wh=game.spritewh;
		
	}
	
	//小精灵渲染自己在地图上显示
	Sprite.prototype.render=function(){
		//爆炸完毕就不用再更新了
		if(this.isHide) return;
		
		if(!this.isBomb){
			game.ctx.drawImage(game.R[this.imageName],this.x+2,this.y+2,this.wh-4,this.wh-4);
		}else{
			game.ctx.drawImage(game.R["bomb"],200 * this.bombStep,0,200,200,this.x+2,this.y+2,this.wh-4,this.wh-4);
		}
		
		
		
	}
	
	//小精灵更新自己的数据
	Sprite.prototype.update=function(){
		//爆炸完毕就不用再渲染了
		if(this.isHide) return;
		
		//isMove属性只要为true此时就会让元素移动
		if(this.isMove){
			this.x += this.dx;
			this.y += this.dy;
			//帧编号变小
			this.moveFno--;
		}

		//当小帧号减到0了，此时就停止运动
		if(this.moveFno <= 0){
			this.isMove = false;
		}
		
		//如果在爆炸，此时改变爆炸步骤属性，加1
		if(this.isBomb){
			game.zheng % 2 == 0 && this.bombStep++;
			//验收
			if(this.bombStep > 7){
				//让自己隐藏
				this.isHide = true;
		
				
			}

		}
		
	}
	
	//精灵运动到具体坐标的方法
	Sprite.prototype.moveTo = function(targetRow,targetCol,duringFrames){
		this.isMove = true;

		//计算目标的x、y值：
		var targetX = calcXYbyRowCol(targetRow,targetCol).x;
		var targetY = calcXYbyRowCol(targetRow,targetCol).y;

		//看看差多少
		var distanceX = targetX - this.x;
		var distanceY = targetY - this.y;

		//平均分配到那么多帧里面
		this.dx = distanceX / duringFrames;
		this.dy = distanceY / duringFrames;


		//设置moveFno的值为你要求的帧数
		this.moveFno = duringFrames;
	}
	
	//爆炸函数
	Sprite.prototype.bomb = function(){
		this.isBomb = true;
		
		
			
		
		}
	
	
//来一个辅助函数，计算通过行号、列号，计算x和y和w
	function calcXYbyRowCol(row,col){

		//计算出自己的位置
		return {
			"x" : game.basex + game.spritewh * col,
			"y" : game.basey + game.spritewh * row
		}
	}
	
	
	
	
	
})()
