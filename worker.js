//worker.js



this.onmessage = function(e) 
	{

   e.data.array.forEach((cell) => 
		{
		cell.state = gameOfLife(cell);

	});
   		this.postMessage({array:e.data.array, index:e.data.index});

};

function gameOfLife(cell)
	{
	let sum = Sum(cell.neighbors);
	rState = cell.state;
	if((sum>3 || sum<2) && cell.state==1)
		{
		rState = 0;
	}
	else if(cell.state == 0 && sum==3)
		{
		rState= 1;
	}
	return rState;
}
		
function Sum (array)
	{
	let result = 0;
	array.forEach(x=>result+=x);
	return result;	
	}			