(
	function(){
		
		var Ball=window.Ball=function(x,y,r){
			this.x=x;
			this.y=y;
			this.r=r;
			this.color=["red","orange","green","white","skyblue"];
			this.init();
			
			this.index_move=_.random(0,0);
		}
		
		Ball.prototype={
			init:function(){
				
				
				game.manage.add_ball_instance(this);
			},
			
			render_ball:function(){
				game.manage.ctx.beginPath();
				var color_index=_.random(0,this.color.length-1)
				game.manage.ctx.strokeStyle=this.color[color_index];
				
				game.manage.ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
				game.manage.ctx.fillStyle=this.color[color_index];
				game.manage.ctx.fill();
				game.manage.ctx.stroke();
				
				
			},
			
			change_small_ball:function(){
				if(this.r<5){
					game.manage.ball_arr.splice(game.manage.ball_arr.indexOf(this),1);
				}else{
					
//					_	this.index_move+=this.index_move;
						this.r-=0.5;
					}

				}
			
		}
		
	}
	
)()
