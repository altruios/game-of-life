class HexBoard {
     constructor(size, height,width,ctx){
          this.tiles = [];
          this.ctx=ctx;
          this.height=height;
          this.width=width;
          this.center = {x:height/2,y:width/2}
          this.makeTiles(size)
     }
     makeTiles(size){
          let temp = size;
          while(temp%6!=0){
               temp++
          };
          this.tiles.fill(new Tile(this.ctx), 0,temp);
          this.tiles.forEach((tile,i,arr)=>{
               tile.connect((i+1)%arr.length-1,arr,"top")
               tile.connect((i+2)%arr.length-1,arr,"leftTop")
               tile.connect((i+3)%arr.length-1,arr,"leftBottom")
               tile.connect((i+4)%arr.length-1,arr,"bottom")
               tile.connect((i+5)%arr.length-1,arr,"rightBottom")
               tile.connect((i+6)%arr.length-1,arr,"rightTop")
          });
     }
}
class Tile{
     constructor(ctx){
          this.id;
          this.ctx=ctx;
          this.center={x:0,y:0};
          this.shape={
               corners:[
                    {x:5,y:5},
                    {x:15,y:5},
                    {x:20,y:10},
                    {x:15,y:15},
                    {x:5,y:15},
                    {x:0,y:10},
               ]

          }
          this.size ={
               centerToCorer:10,
          };
          this.connections={
               top:null,
               bottom:null,
               leftTop:null,
               leftBottom:null,
               rightTop:null,
               rightBottom:null
          };
     }
     connect(i,arr,swtch){
          this.connections[swtch]=arr[i];   
     }

     draw(){
          this.ctx.beginPath();
          this.ctx.moveTo(this.center.x+this.shape.corners[0].x,this.center.y+this.shape.corners[0].y);
          this.ctx.lineTo(this.center.x+this.shape.corners[1].x,this.center.y+this.shape.corners[1].y);
          this.ctx.lineTo(this.center.x+this.shape.corners[2].x,this.center.y+this.shape.corners[2].y);
          this.ctx.lineTo(this.center.x+this.shape.corners[3].x,this.center.y+this.shape.corners[3].y);
          this.ctx.lineTo(this.center.x+this.shape.corners[4].x,this.center.y+this.shape.corners[4].y);
          this.ctx.lineTo(this.center.x+this.shape.corners[5].x,this.center.y+this.shape.corners[5].y);
          this.ctx.lineTo(this.center.x+this.shape.corners[0].x,this.center.y+this.shape.corners[0].y);
          this.ctx.stroke();
          this.ctx.endPath();
     }
}