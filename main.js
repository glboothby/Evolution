$(document).ready(function () {

	var pcChanceOfEvolving = 2;
	var startColours = [127, 127, 127];
	var waitingTime = 1500;
	var maxEvo = 1;

	var $parent1 = $('div#parent1');
	var $parent2 = $('div#parent2');
	var $child1 = $('div#child1');
	var $child2 = $('div#child2');
	var $child3 = $('div#child3');
	var $child4 = $('div#child4');
	var $child5 = $('div#child5');
	var parent1Colours;
	var parent2Colours;
	var child1Colours;
	var child2Colours;
	var child3Colours;
	var child4Colours;
	var child5Colours;

	var $mPc = $('input#mPc');
	var $mDeg = $('input#mDeg');
	var $tSpan = $('input#tSpan');
	var $predNum = $('input#predNum');
	var $predCol = $('input#predCol');
	var $breedCol = $('input#breedCol');
	var $resetColour = $('input#resetColour');

	$resetColour.change(function () {
			var newColour = HexToRgb($(this).val());
			SetColour($parent1, newColour);
			SetColour($parent2, newColour);
			SetColour($child1, newColour);
			SetColour($child2, newColour);
			SetColour($child3, newColour);
			SetColour($child4, newColour);
			SetColour($child5, newColour);
			SetColour($('div#reference'), newColour);
	});

	SetStartColours();
	Breed();
	
	function ChanceOfEvolving()
	{
		return Number($mPc.val());
	}
	function Evo()
	{
		return Number($mDeg.val());
	}
	function TimeSpan()
	{
		return Number($tSpan.val());
	}
	function Breed()
	{
		GenerateChildren();
		var t = setTimeout(KillChildren, TimeSpan());
	}
	function KillChildren()
	{
		GetChildColours();
		
		var predatorCount = GetPredatorCount();
		var predatorColour = GetPredatorColour();
		var childColours = [child1Colours, child2Colours, child3Colours, child4Colours, child5Colours];
		for(var i = 0; i < predatorCount; i++)
		{
			childColours = RemoveClosestMatch(predatorColour, childColours)[1];
		}

		var breedCol = GetBreedColour();
		var breedMatch1 = RemoveClosestMatch(breedCol, childColours);
		childColours = breedMatch1[1];
		var breedMatch2 = RemoveClosestMatch(breedCol, childColours);

		SetColour($parent1, breedMatch1[0]);
		SetColour($parent2, breedMatch2[0]);

		$child1.hide('fast');
		$child2.hide('fast');
		$child3.hide('fast');
		$child4.hide('fast');
		$child5.hide('fast', function () {
			Breed();
		});
	}
	function RemoveClosestMatch(c, arr)
	{
		var p = 0;
		var closestC = 255 * 3;
		for(var i = 0; i < arr.length; i++)
		{
			var match = MatchColour(c, arr[i]);
			if(match < closestC)
			{
				p = i;
				closestC = match;
			}
		}
		var matchCol = arr[p];
		arr.splice(p, 1);
		return [matchCol, arr];
	}
	function MatchColour(c1, c2)
	{
		var diff = 0;
		for(var i = 0; i < c1.length; i++)
		{
			diff += Math.abs(c1[i] - c2[i]);
		}
		return diff;
	}
	function SetStartColours()
	{
		SetColour($parent1, startColours);
		SetColour($parent2, startColours);
		SetColour($('div#reference'), startColours);
		$mPc.val(pcChanceOfEvolving);
		$mDeg.val(maxEvo);
		$tSpan.val(waitingTime);
	}
	function GenerateChildren()
	{
		GetParentColours();
		GenerateChild($child1);
		GenerateChild($child2);
		GenerateChild($child3);
		GenerateChild($child4);
		GenerateChild($child5);
	}
	function GenerateChild($child)
	{
		var r = GetParentColor(0);
		var g = GetParentColor(1);
		var b = GetParentColor(2);
		SetColour($child, [r, g, b]);
		$child.show('fast');
	}
	function GetParentColor(i)
	{
		var returnValue;
		var rnd = Math.floor(Math.random() * 2);
		if(rnd == 0) { returnValue = parent1Colours[i]; }
		else { returnValue = parent2Colours[i]; }
		return Evolves(returnValue);
	}
	function Evolves(c)
	{
		var rnd = Math.floor(Math.random() * 100) + 1;
		if(rnd > 100 - ChanceOfEvolving())
		{
			var chng = Math.floor(Math.random() * Evo()) + 1;
			rnd = Math.floor(Math.random() * 2);
			if(rnd == 0 && c > 0)
			{
				c = c - chng;
				if(c < 0) { c = 0; }
				
			}
			else if(c < 255)
			{
				c = c + chng;
				if(c > 255) { c = 255; }
			}
		}
		return c;
	}
	function GetColours()
	{
		GetParentColours();
		GetChildColours();
	}
	function GetParentColours()
	{
		parent1Colours = ToColourArray($parent1);
		parent2Colours = ToColourArray($parent2);
	}
	function GetChildColours()
	{
		child1Colours = ToColourArray($child1);
		child2Colours = ToColourArray($child2);
		child3Colours = ToColourArray($child3);
		child4Colours = ToColourArray($child4);
		child5Colours = ToColourArray($child5);
	}
	function SetColour($div, colours)
	{
		$div.find('span.red').text(colours[0]);
		$div.find('span.green').text(colours[1]);
		$div.find('span.blue').text(colours[2]);
		$div.css('background-color', 'rgb(' + colours[0] + ',' + colours[1] + ',' + colours[2] + ')' );
	}
	function ToColourArray($parent)
	{
		var r = Number($parent.find('span.red').text());
		var g = Number($parent.find('span.green').text());
		var b = Number($parent.find('span.blue').text());
		return [ r, g, b ];
	}
	function GetPredatorColour()
	{
		return HexToRgb($predCol.val());
	}
	function GetPredatorCount()
	{
		return Number($predNum.val());
	}
	function GetBreedColour()
	{
		return HexToRgb($breedCol.val());
	}
	function HexToRgb(hex)
	{
		var r = HexToR(hex);
		var g = HexToG(hex);
		var b = HexToB(hex);
    	return [ r, g, b ];
	}
	function HexToR(h) {return parseInt((CutHex(h)).substring(0,2),16)}
	function HexToG(h) {return parseInt((CutHex(h)).substring(2,4),16)}
	function HexToB(h) {return parseInt((CutHex(h)).substring(4,6),16)}
	function CutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
});
