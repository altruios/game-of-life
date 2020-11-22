class BooleanNetwork{
    constructor(height,width, connectionPatternArray,outputDiv,ctx){
        this.ctx=ctx;
        this.cellSize=2;//it is one
          this.trueHeight=height;
          this.trueWidth=width;
        this.width=Math.floor(width/this.cellSize);
        this.height = Math.floor(height/this.cellSize);
        this.saveImageFlag=false;
        this.ruleNumber=0;
        this.maxLines= this.height/this.cellSize;
        this.maxWidth= this.width/this.cellSize
        this.lineNum=0;
        this.ruleLength=10000;
        this.image = new ImageData(this.width,this.height);//scaled image that will be blown up.
        this.image32DATA = new Uint32Array( this.image.data.buffer )
        this.lastImage32Data = new Uint32Array( this.image.data.buffer )
        this.table=[
            [0,0,0,0],
            [0,0,1,0],
            [0,1,0,0],
            [0,1,1,0],
            [1,0,0,0],
            [1,0,1,0],
            [1,1,0,0],
            [1,1,1,0]
        ];
        this.truth = new BinaryCounter();
        this.nodes =[];
        for(let i=0;i<this.width;i++){
            this.nodes.push(new BooleanNode(i))
        }
        for(let i=0;i<this.width;i++){
            this.nodes[i].connect(connectionPatternArray,this.nodes);
        }
        this.outputDiv=outputDiv;        
        this.out=this.out.bind(this);
    }
    setAsMiddle(value){
     let v=value;
     if(v==NaN||v==undefined||v==null||v<0||v>this.width-1){
          v=Math.floor(this.width/2);          
     }
     console.log(v)

     this.nodes[v].setAsMiddle();
   }

    setCellSize(size){
        this.cellSize=size;
    }
    rule(number,debug){
         console.trace(debug);
     console.log(number,"setting binary");

         let num = Number(number);

         if(num ==NaN||num==undefined||num==null){
              num=0;
         }
         console.log(num,"setting num");

         this.ruleNumber=num;
        this.truth.clear();
        this.truth.add(this.ruleNumber);
        this.changeTheTruthTable();
          this.setNewState();
     }
     setNewState(){
          this.nodes.forEach(node=>{
               node.middle?node.lifeState.push(1):node.lifeState.push(0);
               node.middle?node.colorState.push(0xFF505000):node.colorState.push(0xFF0000FF);
          });

     }
    out(){
          const refTime = `out#${this.lineNum}`;
          console.time(refTime);
        this.ctx.fillStyle="#ffffff";
        this.ctx.fillRect(0,0,this.trueWidth,this.trueHeight);
        this.getScreen().then(screen=>this.draw(screen)).then(screen=>this.saveImageFlag?this.saveImage(screen, refTime):console.timeEnd(refTime));
  //      this.saveImage(screen);
    }
     getScreen(){
     const screen = this.nodes.map(node=>node.getScreen(this.height));
     
     screen.forEach((r,x)=>r.forEach((c,y)=> this.image32DATA[y*this.width+x]=c));
     return createImageBitmap(this.image);
     }
     draw(screen){
          if(screen){
               this.ctx.drawImage(screen,0,0,this.trueWidth,this.trueHeight)
               return this.ctx;
          }         
          return this.ctx;
     }
     toggleSave(){
          this.saveImageFlag=!this.saveImageFlag;
     }
    saveImage(newImage,refTime){

          fetch("/saveimage.php",{
               method:"POST",
               headers:{
                    "Content-Type": "application/json"
                 },
               body:JSON.stringify({
                    imageData:newImage.canvas.toDataURL("image/png"),
                    filePath:"/images",
                    count:this.lineNum
               })
          }).then(res=>res.json()).then(data=>console.timeEnd(refTime));
    }
    updateTruth(switchFlag){
          switch(switchFlag){
               case "DOWN":
                    this.truth.value>255? this.truth.set(0): this.truth.countUP();
                    break;
               case "UP":
                    this.truth.value<=0? this.truth.set(255): this.truth.countDOWN();
                    break;
               default:
                    this.truth.value>255? this.truth.set(0): this.truth.countUP();
                    break;
          }
          this.changeTheTruthTable();
     }
    changeTheTruthTable(){
        const newTable = this.table.map((truth,i)=>{
            truth[3]=this.truth.BINARY[i];
            return truth;
        });
        this.table=newTable;
    }
    renderer(infoDiv,speed){
        const that = this;
        return window.setInterval(function(){
          const timeToken =`render${that.lineNum}`;
       console.time(timeToken);
          that.nodes.forEach(node=>node.nextState(that.table));
            that.nodes.forEach(node=>node.setNextState());
            that.out(); 
     
            that.lineNum++;
            infoDiv.innerText = `     lineCount ${that.lineNum } BINARY LIFE ${that.truth.value}`;
            
       console.timeEnd(timeToken);
        },speed)         
    }
    getLastState(){
        return this.nodes.map(node=>node.lastState()?1:0).join("");
    }
    getSecondToLastState(){
        return this.nodes.map(node=>node.secondLastState()?1:0).join("");
    }
    
    update(){
           this.ruleNumber++;
           this.rule(this.ruleNumber, "from update");
    }
}
class BooleanNode{
     constructor(index){
          this.middle=false; 
          this.index=index;
          this.count=0;
          this.lifeState=[];//only ever push new state;
          this.colorState=[];
          this.connectionIndex=[];
          this.selfRulesFlag=false;
          this.ruleState=[];
          this.setRulesFlag=this.setRulesFlag.bind(this);
          this.nextState = this.nextState.bind(this);
          this.connect=this.connect.bind(this);
          this.setNextState=this.setNextState.bind(this);
    }
    connect(pattern,network){
        
          const index1=(((this.index)+pattern[0] )% network.length );
          const index2=(((this.index)+pattern[1] )% network.length );
          const index3=(((this.index)+pattern[2] )% network.length );
          this.connectionIndex.push(network[index1]);
          this.connectionIndex.push(network[index2]);
          this.connectionIndex.push(network[index3]);
    }
    setAsMiddle(){
         this.middle=true;
    }
    setRulesFlag(state){
         this.selfRulesFlag=state;
    }
    nextState(table){
         const connections = this.getConnectors();
         const found = table.find(x=>
               connections[0].lastState().life==x[0]&&
               connections[1].lastState().life==x[1]&&
               connections[2].lastState().life==x[2])
          
          found[3]==this.lastState().life?this.count=this.count+1:this.count=0;
          const rule = Number(found.join(""));
          const color = this.getColor(rule);
          const rObj={
               color:color,
               life:found[3]
          }
          this.index==0?console.log(rObj.color):null;
          this.next = rObj;

            return this.next==null?true:false;
            
          }
     getConnectors(){
          return this.connectionIndex;
     }
     getColor(rule){
          const {color,life} = this.lastState();
          //return life?0xFFFFFFFF:0xFF000000;
          let bitPos;
          if(life==1){
          switch(rule){
               case 0:
                    bitPos=15;
                    break;
               case 1:
                    bitPos=240;
                    break;
               case 2:
                    bitPos=255;
                    break;
               case 3:
                    bitPos=3840;
                    break;
               case 4:
                    bitPos=3855;
                    break;
               case 5:
                    bitPos=4080;
                    break;
               case 6:
                    bitPos=4095;
                    break;
               case 7:
                    bitPos=61440;
                    break;
               default:
                    bitPos=983055
               }
               return Math.min(color+bitPos,0xFFFFFFFF);
          }else{
               switch(rule){
                    case 0:
                         bitPos=61455;
                         break;
                    case 1:
                         bitPos=61680;
                         break;
                    case 2:
                         bitPos=61695;
                         break;
                    case 3:
                         bitPos=65280;
                         break;
                    case 4:
                         bitPos=65295;
                         break;
                    case 5:
                         bitPos=65520;
                         break;
                    case 6:
                         bitPos=65535;
                         break;
                    case 7:
                         bitPos=983040;
                         break;
                    default:
                         bitPos=983280;
                         break;
                    }   
                    return Math.max(color-bitPos,0xFF000000);

               }
        

     }         
     setNextState(){
          this.lifeState.push(this.next.life);
          this.colorState.push(this.next.color);
     }
    lastState(){
         const index = this.lifeState.length-1;
          return {life:this.lifeState[index],color:this.colorState[index]};
    }

     secondLastState(){
          const index = Math.max(this.lifeState.length-2,0);
          console.assert(this.lifeState.length==this.colorState.length,"w... the arrays don't match")
     return {life:this.lifeState[index],color:this.colorState[index]};
     }
    getScreen(length){
         const endIndex = (this.colorState.length-1);
         const startIndex = this.colorState.length-1-length;
         let workingSlice=[];
         if(startIndex<0){
              workingSlice= this.colorState.slice();
         }
         workingSlice= this.colorState.slice(startIndex,endIndex);
       return workingSlice //will return working slice faster if we calculate first. instead of look at it laters;
    }
    getRuleState(){

      return this.ruleState;
     }
}
class BinaryCounter{
    constructor(value,speed,direction){
        this.value = value;
        if(!value){
            this.value=0;
            this.BINARY=[0,0,0,0,0,0,0,0]//we initialize to that size. 8-bit?
        }
        this.padSize=8;
        this.value = Math.floor(this.value);
        this.BINARY=this.getBinary();
        this.counter= null;
        this.setCounterSpeedAndDir(speed,direction)
    }
    getBinary(){
        return this.PAD(Array.from(this.value.toString(2)).reverse().map(x=>Number(x)),this.padSize);
    }
    PAD(array, padSize){
        while(array.length<padSize){
            array.push(0);
        }
        return array;
    }
    countUP(){
        this.add(1);
    }
    countDOWN(){
        this.subtract(1);
    }
    Calculator(fun, value){
     let safe=false;
     if(value==NaN||value==undefined||value==null){
         value = Number(value);
         if(value ==NaN||value==undefined||value==null){
             console.error("could not add");
         }else{
             safe=true;
         }
     }else{
         safe=true;
     }
     if(safe){
         this.value = fun(this.value, value);
         this.value = Math.floor(this.value);
         this.BINARY=this.getBinary();
     }else{
         return false
     }
 }
    add(value){
        this.Calculator(this._add, value);
    }
    _add(a,b){
        return a+b;
    }
    subtract(value){
        this.Calculator(this._substract,value)
    }
    _substract(a,b){
        a-b<0?console.error("can not subtract less than zero"):null;
        return a-b<0? 0:a-b;
    }
    multiply(value){
        this.Calculator(this._multiply,value);
    }
    _multiply(a,b){
        return a*b;
    }
    divid(value){
        this.Calculator(this._divide,value);
    }
    _divide(a,b){return a/b;}

    read(number){
        return number?this.BINARY[number]:this.BINARY;
    }
    outputBinAsStr(){
         return this.BINARY.join("");
    }
    set(value){
        if(value==NaN|| value==undefined){
            return; 
        }
       
        this.value=Math.floor(this.value);
        this.BINARY=this.getBinary();
    }
    setCounterSpeedAndDir(time,dir){
        if(time==null||dir==null){
            return null;
        }
        const that = this;
        this.counter = window.setInterval(function(){
            dir?dir=="up"?that.countUP():that.countDOWN():that.countUP();
            if(that.value==0&& dir=="down"){
                that.clear()
            }
    },time)
    }
    start(speed,dir){
        this.setCounterSpeedAndDir(speed,dir);
    }
    clear(){
        this.BINARY= this.BINARY.map(x=>0);
        this.value=0;
        window.clearInterval(this.counter);
    }
}