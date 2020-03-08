//acsii parser


//input is:

let inputTESTIS = 
	"............O....................\n"+ 
	"..........OO.O...................\n"+
	"..........OO...O.................\n"+
	"........O...OO.O.....O...........\n"+
	"........OOOO.OO...OOOO.......O.O.\n"+
	"......O......O....OOO.....O.O..O.\n"+
	"......OOOOOOO...O...O....O..O....\n"+
	"...O.O......OO..O...O.O.OO....O..\n"+
	"..OOOOOOOOO.....O..OO........O...\n"+
	".OO..............O.OO.OOOO...O..O\n"+
	"OO....OO.O..........O...O..O.O...\n"+
	".OO....O........OOO......O.O.O..O\n"+
	".........O......OO......O....OO..\n"+
	".OO....O........OOO......O.O.O..O\n"+
	"OO....OO.O..........O...O..O.O...\n"+
	".OO..............O.OO.OOOO...O..O\n"+
	"..OOOOOOOOO.....O..OO........O...\n"+
	"...O.O......OO..O...O.O.OO....O..\n"+
	"......OOOOOOO...O...O....O..O....\n"+
	"......O......O....OOO.....O.O..O.\n"+
	"........OOOO.OO...OOOO.......O.O.\n"+
	"........O...OO.O.....O...........\n"+
	"..........OO...O.................\n"+
	"..........OO.O...................\n"+
	"............O....................";



	function readInput(input)
		{
		console.log('input is', input);	
		let stringArray = input.split("\n");
		console.log("string array is:", stringArray);
		let counterCol = 0;
		let counterRow = 0;
		let objectCount = 0;
		let returnContainer = [];
		stringArray.forEach((stringLine)=>
			{
			console.log('stringLine is',stringLine)
			stringLine = Array.from(stringLine);	
			stringLine.forEach((stringItem)=>
				{
				console.log("stringItem is", stringItem);	
				if(stringItem == 'O')
					{
					objectCount++;

					console.log("making object");	
					let cellObject = {col:counterCol, row:counterRow};
					returnContainer.push(cellObject);
				}
				else{
					console.log("not making object");
				}
				counterRow++;	
			});
			counterRow = 0;
			counterCol++;
		});
	console.log("number of cells to turn on should match the array size", objectCount);	
	return returnContainer;		
	}



console.log(readInput(inputTESTIS));
const puffer = readInput(inputTESTIS);
