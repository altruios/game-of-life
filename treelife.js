
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const videoResolutions = [{name: "test", height: 1900, width:1500},{name:"1080", height: 1080, width:1920},{name:"4k", height: 2160, width:3840}];
canvas.height = videoResolutions[1].height;
canvas.width =  videoResolutions[1].width;
const bufferMemoryAllocation = cellCount*4; //double the size 4bytes--32bits--per memory slot
const pixelData = new SharedArrayBuffer(bufferMemoryAllocation);
const pixelDataCanvas =  new Uint32Array(pixelData);


const COLORCHART=[
    {color:[255,255,255,1], counter:0,life:true},
    {color:[255,255,255,1], counter:1,life:true},
    {color:[255,255,255,1], counter:2,life:true},
    {color:[255,255,255,1], counter:3,life:true},
    {color:[255,255,255,1], counter:4,life:true},
    {color:[255,255,255,1], counter:5,life:true},
    {color:[255,255,255,1], counter:6,life:true},
    {color:[255,255,255,1], counter:7,life:true},
    {color:[255,255,255,1], counter:8,life:true},
    {color:[255,255,255,1], counter:9,life:true},
    {color:[255,255,255,1], counter:10,life:true},
    {color:[255,255,255,1], counter:11,life:true},
    {color:[255,255,255,1], counter:12,life:true},
    {color:[255,255,255,1], counter:13,life:true},
    {color:[255,255,255,1], counter:14,life:true},
    {color:[255,255,255,1], counter:15,life:true},
    {color:[255,255,255,1], counter:16,life:true},
    {color:[255,255,255,1], counter:17,life:true},
    {color:[255,255,255,1], counter:18,life:true},
    {color:[255,255,255,1], counter:19,life:true},
    {color:[255,255,255,1], counter:20,life:true},
    {color:[255,255,255,1], counter:21,life:true},
    {color:[255,255,255,1], counter:22,life:true},
    {color:[255,255,255,1], counter:23,life:true},
    {color:[255,255,255,1], counter:24,life:true},
    {color:[255,255,255,1], counter:25,life:true},
    {color:[255,255,255,1], counter:26,life:true},
    {color:[255,255,255,1], counter:27,life:true},
    {color:[255,255,255,1], counter:28,life:true},
    {color:[255,255,255,1], counter:29,life:true},
    {color:[255,255,255,1], counter:30,life:true},
    {color:[255,0,0,255], counter:0,life:false},
    {color:[245,0,0,255], counter:1,life:false},
    {color:[235,0,0,255], counter:2,life:false},
    {color:[225,0,0,255], counter:3,life:false},
    {color:[215,0,10,255], counter:4,life:false},
    {color:[195,0,20,255], counter:5,life:false},
    {color:[185,0,30,255], counter:6,life:false},
    {color:[175,0,40,255], counter:7,life:false},
    {color:[165,0,50,255], counter:8,life:false},
    {color:[155,0,60,255], counter:9,life:false},
    {color:[145,0,70,255], counter:10,life:false},
    {color:[135,0,60,255], counter:11,life:false},
    {color:[125,0,50,255], counter:12,life:false},
    {color:[115,0,40,255], counter:13,life:false},
    {color:[105,0,30,255], counter:14,life:false},
    {color:[95,0,20,255], counter:15,life:false},
    {color:[85,0,10,255], counter:16,life:false},
    {color:[75,0,10,255], counter:17,life:false},
    {color:[65,0,10,255], counter:18,life:false},
    {color:[55,0,10,255], counter:19,life:false},
    {color:[45,0,10,255], counter:20,life:false},
    {color:[35,0,10,255], counter:21,life:false},
    {color:[25,0,20,255], counter:22,life:false},
    {color:[15,0,30,255], counter:23,life:false},
    {color:[05,0,40,255], counter:24,life:false},
    {color:[65,0,50,255], counter:25,life:false},
    {color:[155,30,40,255], counter:26,life:false},
    {color:[200,100,30,200], counter:27,life:false},
    {color:[250,175,20,125], counter:28,life:false},
    {color:[255,255,20,125], counter:29,life:false},
    {color:[0,0,0,255], counter:30,life:false},

    

]
function* IDGENERATOR(){
    let id=0;
    while(true){
        yield id++;
    }
}
const IDGEN= IDGENERATOR();
const SPAN = 1920;
function nextPicture(data){
    const picture = new Uint8ClampedArray(data.buffer);
	const img = new ImageData(picture,SPAN);
	ctx.putImageData(img,0,0);

}
class pointArray{
    constructor(height,width){
        this.points = [];
        for(let i=0;i<height;i++){
            for(let j=0;j<width;j++){
                this.points.push(new point(j,i));
            }   
        }
    }
}
class point{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}


class Board{
    constructor()
        {
        this.height=height;
        this.width=width;
        this.root = new QuadNode(new pointArray(this.width,this.height),this);
    }
}
class quadNode{
    constructor(posArr, parent){
        this.center=this.findCenter(posArr);
        this.parent=parent;
        if(posArr.length > 1)
            {
            const [LT,LB,RT,RB] = this.quadSplit(posArr);
            this.LeftTop= LT;
            this.LeftBottom=LB;
            this.RightTop=RT;
            this.RightBottom=RB;
        }
        else{
            this.cell = new Cell(this.center, this);
        }
        this.changed=false;

    }
    findCenter(range){
        if(range.length==1){
            return range[0];
        }
        const leftTop = range.sort((a,b)=>{return a.x<b.x&&a.y<b.y})[0];
        const rightBottom = range[range.length-1]
        return range.find(x=>x.x==((rightBottom.x+leftTop.x)/2)&&x.y==((rightBottom.y+leftTop.y)/2));
    }
    quadSplit(range){
        const TL=    range.filter((x)=>x.x<this.center.x&&x.y<this.center);
        const TR=    range.filter((x)=>x.x>this.center.x&&x.y<this.center);
        const BL=    range.filter((x)=>x.x<this.center.x&&x.y<this.center);
        const BR=    range.filter((x)=>x.x>this.center.x&&x.y<this.center);
        return [TL,BL,LR,BR];
    }

}



class Cell{
    constructor(pos,ref){
        this.id= IDGEN.next().value;
        this.pos=pos;

        this.life=0;
        this.nextState;
        this.lastState;
        this.changed=true;
        this.neighbors=[];
        this.nVal=0;
        this.color=[0,0,0,1];
        this.counter=0;
        this.dead=false;
        this.boardRef=ref;
        this.picRef=picRef;
    }
    findCenter(rangeArray){

    }
    update(){
        this.changed=false;
        if(!this.zone.life&&this.dead){
            return;//
        }
        this.setNVal();
        this.nextState=(this.life)?(this.nVal>1&&this.nVal<4)?1:0:this.nVal==3?1:0;
        this.changed=this.life!=this.nextState;
        this.lastState=this.life;//save life value
        this.life=this.nextState;//set life value to new state
        // i think i can get this down to bigo(3N) by doing everything in one update?
        this.setCounter();
        this.determinColor();
        this.sendPicRef();
    }
    setZoneLife(){
        this.zone.life=this.neighbors.some(neighbor=>neighbor.some(n=>n.changed&&neighbor.id!=this.id));
    }
    setNVal(){
        this.nVal= this.neighbors.reduce((count,cell)=>{return count+cell.changed?cell.lastState:cell.life},0)
    }
    getNVal(){
        return this.nVal;
     }
     setCounter(){
         this.counter=this.changed?0:this.counter+1;
     }
     determinColor(){
         this.color= COLORCHART.find(x=>x.counter==this.counter&&x.life==this.life);
     }
  
     sendPicRef(){
         this.picRef[this.arrPos]=this.color;
     }


    
}