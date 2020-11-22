
	//this is a photographer worker
	// it takes in a refference to the pixelData Array.
let imageData;
let offScreen;
let offscreenCtx;
let data; 
let pixelDataCanvas;
let span;
let count;

function setWorker(e)
	{
	offScreen = e.data.offScreen;
/*	offScreen.height= 1900;
	offScreen.width= 1520;*/
	
	offscreenCtx = offScreen.getContext('2d');
	imageData = new Uint32Array(e.data.imageData);
	count = e.data.count;
	pixels = new Uint8Array(e.data.imageData);	//from shared memory
	data = new Uint8Array(pixels.length); //not shared memory
	span  = e.data.span;

}
function ripDataToImg()
	{
	const tA = new Uint8ClampedArray(data.buffer);
	for(let i=0;i<tA.length;i++)
		{
		tA[i]=pixels[i];	//can't ini with shared, so we rip shared data.
	}
	const img = new ImageData(tA, span);
	return img;
}
function drawToBackground(img)
	{
	offscreenCtx.putImageData(img,0,0);
}
this.onmessage = function(e) 
	{	
	console.time("photo");
	console.log("yay received message!");	

	setWorker(e);
	let img = ripDataToImg();
	drawToBackground(img);
	let returnObject = 
		{
		message:"rendered",
		offScreen:offScreen,
		count:count
	}

	console.timeEnd("photo");
	this.postMessage(returnObject, [offScreen]);	
	



};
