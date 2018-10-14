(function(){
	
	var Map=window.Map=function(){
		
		//这个是随机出现的矩阵，对应不同实例的精灵，通过这个序号来判断他们是否挨着
		this.code = [
			[3,3,3,3,4,5,6],
			[1,2,3,4,5,6,0],
			[1,2,4,5,6,0,1],
			[2,2,5,6,6,1,2],
			[4,5,6,5,6,2,3],
			[5,6,0,5,4,5,4],
			[6,0,1,2,3,6,5],
			[]
		];
		
		//总的精灵的数组
		var spritArr=["i0","i1","i2","i3","i4","i5","i6","i7","i8","i9","i10","i11","i12","i13","i14"];
		
		
		//每次不可能用全部的精灵，所以得在里面找出7个组成新的数组，并且与相应的矩阵数字对上成为精灵的名字从而拿到它的图片
		this.imageNameArr = _.sample(spritArr,game.sprit_rowAndcol);
		
		//"i0","i1","i2","i3","i4","i5","i6"
		//用来记录当前精灵要下落的步数
		this.needToBeDropDown = [[],[],[],[],[],[],[]];
		
		//这里是一个二维的数组里面存放的是精灵的实例
		this.sprites=[[],[],[],[],[],[],[]];
		
		this.createSpritesByCode();
		
	}
	
	//根据code矩阵来创建sprites数组
	Map.prototype.createSpritesByCode = function(){
		for (var i = 0; i < game.sprit_rowAndcol; i++) {
			for (var j = 0; j < game.sprit_rowAndcol; j++) {
				//让真实元素的矩阵，重新按照代码矩阵new出来
				this.sprites[i][j] = new Sprite(i,j,this.imageNameArr[this.code[i][j]]); 
			}
		}
	}
	
	
	//渲染
	Map.prototype.render = function(){
		for (var i = 0; i < game.sprit_rowAndcol; i++) {
			for (var j = 0; j < game.sprit_rowAndcol; j++) {
				this.sprites[i][j].update(); 
				this.sprites[i][j].render(); 
			}
		}
	}
	
	
	//检查是否能消除，返回一个可以消除的位置数组，形如:
	//[{"row":0,"col":0}...]                        原理就是把行和列里面满足连续大于等于三的对应坐标
	//									保存到一个数组里面，数组里面是存放row和col，这些就是要爆炸消除的
	Map.prototype.check = function(){
		var arr = this.code;
		var result = [];//这里存放的是满足条件的每一行中大于等于3的元素对应的行与列，里面存放的是json

		//首先先从每一行开始找每一列
		for(var row=0; row<game.sprit_rowAndcol; row++){//这个算法里面有一个小知识带你数组越界后在列方向因为有元素所以为undefined隐士转为0
				//初始化双指针的位置
				var i=0;
				var j=i+1;
				while(i<game.sprit_rowAndcol){
					if(arr[row][i]==arr[row][j]){
						j++
					}else{
						if(j-i>=3){
							for(var k=i; k<j; k++){	
								result.push({"row":row,"col":k});
							}
						}
						i=j;
						j++;
					}
	
				}
				
			}
		
		/////////
		for(var col=0; col<game.sprit_rowAndcol; col++){
				var i=0;
				var j=i+1;
				while(i<game.sprit_rowAndcol){
					if(arr[i][col]==arr[j][col]){
						j++
					}else{
						if(j-i>=3){
							for(var k=i; k<j; k++){	
								
								var ifTong=false;
								_.each(result,function(item){
									if(item.row==k && item.col==col){
										ifTong=true;
									}
								});
								if(!ifTong){
									result.push({"row":k,"col":col});
								}
							}
						}
						i=j;
						j++;
					}
	
				}
				
			}
		return result;
	}
	
	
	
	
	//消除，接受一个形如[{"row":0,"col":0}...]的一个数组当做参数
	//并且让满足条件
	Map.prototype.bobleAndRemove = function(){
		
		game.score++;
		var self = this;
		
		//把
		_.each(this.check(),function(item){
			//爆炸
			self.sprites[item.row][item.col].bomb();
			
			
			//在code中设置这个位置为""
			self.code[item.row][item.col] = "";
			
			
			
			
			
		});

	
	}
	
	
	//下落方法
	Map.prototype.dropdown = function(){
		//统计所有0到5行的元素应该下落多少行
		for(var row = 0 ; row <= 5 ; row++){
			for(var col = 0 ; col <= 6 ; col++){
				//看看这个元素是不是空，如果是空了，此时不需要下落
				if(this.code[row][col] === ""){
					this.needToBeDropDown[row][col] = 0;
				}else{
					//统计这个元素下面有多少个空
					var count = 0;
					for(var _row = row + 1 ; _row <= 6 ; _row++){
						if(this.code[_row][col] === ""){
							count ++;
						}
					}
					this.needToBeDropDown[row][col] = count;
				}
			}
		}
		console.log(this.needToBeDropDown);
		
		//至此，我们已经统计完毕每一个人应该下落多少行。接下来要发出命令，让他们下落即可。
		for(var row = 5 ; row >= 0 ; row--){//---------------------------这里很重要必须倒着来遍历否则后者会覆盖前者
			for(var col = 0 ; col <= 6 ; col++){
				
				//应该下落的行数
				var needDown = this.needToBeDropDown[row][col];
				//精灵移动
				this.sprites[row][col].moveTo(row + needDown , col , 20);
				
				
				//让数字矩阵也变化 
				this.code[row + needDown][col] = this.code[row][col];
				
				//因为移动到新的位置了所以要把原来的位置设置为空，但是得判断原来它的下落数是否大于0，下落的元素才置为空
				if(this.needToBeDropDown[row][col] !=0) this.code[row][col] = "";
			}
			
		}
		

	}
	
	//补齐已经下落的空位，主要把是""的code矩阵上的位置给new个新的出来
	Map.prototype.buQi = function(){
		var buQiCountArr = [0,0,0,0,0,0,0];
		//遍历当前的矩阵，看看矩阵中每列缺多少个，准备new出来
		for(var col = 0 ; col < game.sprit_rowAndcol ; col++){
			for(var row = 0 ; row < game.sprit_rowAndcol ; row++){
				if(this.code[row][col] === ""){
					buQiCountArr[col]++;
					this.code[row][col] = _.random(0,6);
				}
			}
		}

		//此时我们要先补足code阵
		this.createSpritesByCode();//会全部重新实例化但是原来的code矩阵数字没变所以原来的精灵还是不变
		
		//在补齐之后把它移动到上方的位置待命，然后再调用移动函数让它移动到本该是它的位置
		for(var col = 0 ; col < game.sprit_rowAndcol ; col++){
			for(var row = 0 ; row < buQiCountArr[col] ; row++){
				this.sprites[row][col].y = 10;
				this.sprites[row][col].moveTo(row,col,50);
			}
		}
	}
	
	//交换元素
	Map.prototype.exchangeElem = function(startRow,startCol,targetRow,targetCol){
	
		//命令两个元素向彼此的位置运动
		this.sprites[startRow][startCol].moveTo(targetRow,targetCol,10);
		this.sprites[targetRow][targetCol].moveTo(startRow,startCol,10);
		//当动画在移动的时候通过判断状态码来鉴定点击是否有效
		game.stateCode = "正在动画";

		var self = this;
		//10帧之后改变code矩阵中对应移动以后的位置
		game.startAfterManyFrameDo(10,function(){
			
			
			
			//借助一个中间变量来中转
			var temp = self.code[startRow][startCol];
			self.code[startRow][startCol] = self.code[targetRow][targetCol];
			self.code[targetRow][targetCol] = temp;
			//此时check一下！check是检查能否消行的
			if(self.check().length == 0){
				
				
				//滑动是失败的，是不能消除的
				//再做一个动画，交换回来的动画
				self.sprites[startRow][startCol].moveTo(startRow,startCol,10);
				self.sprites[targetRow][targetCol].moveTo(targetRow,targetCol,10);
				//同时刚刚10帧之前的矩阵的交换，也要再次交换回来，相当于一个撤销。
				var temp = self.code[startRow][startCol];
				self.code[startRow][startCol] = self.code[targetRow][targetCol];
				self.code[targetRow][targetCol] = temp;
				//10帧之后返回原来的静稳状态，而不是动画状态，此刻点击就有效了
				game.startAfterManyFrameDo(10,function(){
					//添加交换音乐
					xiaoguo_music.src="R/music/change.mp3";
				
					xiaoguo_music.load();
					xiaoguo_music.play();
							
					game.stateCode = "静稳";
				});
			}else{
				//如果能够消除，要在物理sprites矩阵上交换两个元素位置
				var temp = self.sprites[startRow][startCol];
				self.sprites[startRow][startCol] = self.sprites[targetRow][targetCol];
				self.sprites[targetRow][targetCol] = temp;
				//改变状态爆炸下落补齐，后面状态就会触发循环而进行动画了
				game.stateCode = "爆炸下落补齐";
			}
		});
	}
	
	
})()