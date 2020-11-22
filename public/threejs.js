class Engine{
    constructor(ROOT){
    this.scene= new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.objects = [];
    this.camera.position.z = 5;
    this.animate=this.animate.bind(this);
    ROOT.appendChild(this.renderer.domElement);

}
    testLayerAdd(fn){
        const layer = fn?fn():new Layer(300,300,0,null,0.1,this);
        layer.l.forEach(row=>row.forEach(cell=>{
            this.scene.add(cell.object);
        }));
        this.objects.push(layer);

    }
    animate() {
        console.time("animation time");
        
        console.log("starting animation");
        requestAnimationFrame( this.animate );
        this.testLayerAdd(this.objects[this.objects.length-1].NextLayer);
        this.renderer.render( this.scene, this.camera );
        console.timeEnd("animation time");
    }
}
class Layer{
    constructor(height,width,zPos,pattern,scale,engine){
        this.height=height;
        this.width=width;
        this.zPos=zPos;
        this.scale;
        this.engine=engine;
        this.l=[];
        this.NextLayer=this.NextLayer.bind(this);

        for(let x=0;x<width+2;x++){
            this.l.push([]);
            for(let y=0;y<height+2;y++){
                this.l[x].push(
                    new Cell(
                        pattern?pattern[x][y]:Math.random()>0.5?(
                            x==0||y==0||x==width+1||y==height+1
                        )?false:true:false,
                        this.engine,
                        this.zPos+1, 
                        scale));
            }
        }
        this.l.forEach((row,x,arr)=>{
            if(x!=0&&x!=arr.length-1)
                row.forEach((cell,y,rowArr)=>{
                    if(y!=0&&y!=rowArr.length-1)
                        cell.populateNeighbors(arr,x,y);
                })
            });
    }
  
    NextLayer(){
        const pattern = this.l.map(row=>row.map(cell=>cell.nextState()));
        return new Layer(this.height,this.width,this.zPos+1,pattern);
    }
}
class Cell{
    constructor(life,engine,posZ,size){
        this.life=life;
        this.color=this.getColor();
        this.geometry = new THREE.BoxBufferGeometry(size,size,size);
        this.material = new THREE.MeshBasicMaterial({color:this.color});
        this.object = new THREE.Mesh(this.geometry,this.material);
        this.position = this.object.position;
        this.position.z=posZ;
        this.neighbors=[];
    }
    populateNeighbors(layer,x,y){
        this.neighbors=[ 
            layer[x+0][y-1],
            layer[x+1][y-1],
            layer[x+1][y+0],
            layer[x+1][y+1],
            layer[x+0][y+1],
            layer[x-1][y+1],
            layer[x-1][y+0],
            layer[x-1][y-1]
        ].filter(x=>x!=null);
    }
    getColor(){
       return this.life?"#000000":"#ffffff";
    }
    nextState(){
        const nVal = this.neighbors.reduce((count,cell)=>{
            return count+=cell.life?1:0;
        },0)
        return this.life?(nVal<3&&nVal>1)?1:0:nVal==3?1:0;
    }
}


const E = new Engine(ROOT);

E.testLayerAdd();
E.animate();

