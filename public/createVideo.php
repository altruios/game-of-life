
<?php
//is this right?
// must have ffmpeg installed and in the main c or set to a global

$dateString = strtotime("now");
var_dump(shell_exec("which ffmpeg"));
//this doesn't work to automaticly create a video. I would have loved it to, but this is a bit beyond me on how to get ffmpeg to work automaticlly like this on a home server :(
$cmd = "C:/xampp/htdocs/gameOfLife/images/ffmpeg -r 19 -f image2  -i image_%d.png output_t3.mov";
//   C:/xampp/htdocs/gameOfLife/images/ffmpeg -r 25 -f image2  -i image_%d.png -vf scale= 3840x2160 output_25scale.mov

// ffmpeg -r 25 -f image2  -i image_%d.png -vf scale= 3840x2160 output_25scale.mov

$output = [];
$didItRun=0;
exec($cmd, $output, $didItRun);
print("did it run? ".$didItRun);
print("did it run? <br>");
for($i=0;$i<sizeOf($output);$i++)
	{
	print("just testing");	
	print("output? ".$output[$i]);
}

exec("C:/xampp/htdocs/gameOfLife/images/image_1.png",$output, $didItRun);

print("did this run? ".$didItRun);
for($i=0;$i<sizeOf($output);$i++)
	{
	print("just testing");	
	print("output? ".$output[$i]);
}
print("did it run? <br>");

?>