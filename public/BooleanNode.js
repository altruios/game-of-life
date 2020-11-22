
class BooleanNode{
     constructor(state,index){
         this.middle=false; 
         this.index=index;
         this.state=[state];//only ever push new state;
         this.connectionIndex=[];
         this.nextState = this.nextState.bind(this);
         this.connect=this.connect.bind(this)
     }
     connect(pattern,network){

       const index1=(((this.index)+pattern[0] ) % network.length );
       const index2=(((this.index)+pattern[1] ) % network.length );
       const index3=(((this.index)+pattern[2] ) % network.length );
       
         this.connectionIndex.push(network[index1]);
         this.connectionIndex.push(network[index2]);
         this.connectionIndex.push(network[index3]);
      
     }
     getImageData(length){
         return  this.state.filter((life,y,arr)=>arr.length-1-y<=length).map(x=>Number(x));
         
     }
     setAsMiddle(){
          this.middle=true;
     }
     nextState(table, override){
           const found = table.find(x=>
             x[0]==this.connectionIndex[0].lastState()&&
             x[1]==this.connectionIndex[1].lastState()&&
             x[2]==this.connectionIndex[2].lastState())
             override?this.middle==true?1:0:found?this.state.push(found[3]):console.error(this.index,"could not add");
     
             }
     lastState(){
           return this.state[this.state.length-1];
     }
     secondLastState(){
         return this.state[this.state.length-2]||this.state[this.state.length-1];
         
     }
 }