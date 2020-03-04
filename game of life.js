//conways game of life


//rules 1 
//rule 2
//rule 3
//rule 4
const ctx = canvas.getContext('2d');

let cell = function(state, position, neighbors)
	{
	this.state = state;
	this.neighbors = neighbors;
	this.x = position.x;
	this.y = position.y;
}
let board = function(height, width)
	{
	const = gameArray = [];	
	for(let i = 0; i < height; i++)
		{
		for(let j=0; j< width; j++)
			{	
			let position = {x:i,y:j};
			let neighbors = gameArray.filter((x)=>
				{
				if(x.x == position.X-1 || x.x == position.X+ 1)
					{
					return true;
				}
				else if(x.y == position.y-1 || x.y == position.y + 1)
					{
					return true;	
				}
				else 
					{
					return false;
				}
			});	
			letNeightborStateArray = neighbors.map(x=>x.state);
			let GameCell = cell(0, position, letNeightborStateArray);
			gameArrray.push(gameCell);
		}
	}
}