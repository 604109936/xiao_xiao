(
	function(){
		var Manage=window.Manage=function(){
			
			this.init();
			this.ball_arr=[];//用来管理小球的实例的
			
			
			//画布与页面之间的距离
			this.top=0;
			this.left=0;
			
			this.addBindEvent();
			
			
			this.ball_r=10;//设置小球默认的半径
			
			this.start();
		}
		
		Manage.prototype={
			
			init:function(){
				this.canvas=document.getElementById("canvas");
				this.canvas.width=game.myCanvas.width;
				this.canvas.height=game.myCanvas.height;
				this.ctx=canvas.getContext("2d");
			},
			
			addBindEvent:function(){
				var self=this;
				this.canvas.onmousemove=function(event){
					var event=event || window.event;
					
					var ball_x=event.clientX;
					var ball_y=event.clientY;
					
					new Ball(ball_x,ball_y,self.ball_r);

				}
				
			},
			
			start:function(){
				var self=this;
				var i=0;
				setInterval(function(){
						self.clear_screen();
						self.man_render_ball();
						self.man_change_small_ball();
						if(i%5==0){
							self.change_x_y();
						}
						
				},100)
			},
			
			man_render_ball:function(){
				_.each(this.ball_arr,function(item){
						
						item.render_ball();
					});
			},
			
			//让别的类调用这个方法来使实例放到Manage类中的数组里面
			add_ball_instance:function(ball){
				this.ball_arr.push(ball);
			},
			
			clear_screen:function(){
				this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			},
			
			man_change_small_ball:function(){
				var self=this;
				_.each(this.ball_arr,function(item){
					item && item.change_small_ball();
				})
			},
			change_x_y:function(){
				var self=this;
				_.each(this.ball_arr,function(item){
					if(item)
					item.x+=item.index_move;
				})
			},
			
		}
		
	}
)()
