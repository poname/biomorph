var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {

	$scope.Math = window.Math
    
    var totalSamples = 9;
    $scope.items = [];
    $scope.width = 4;
    $scope.height = 4;

    var cellPerWidth = 32;
    var cellPerHeight = 32;

    init();

    function init() {
    	console.log('init called');
    	generateSamples(totalSamples);
    	console.log($scope.items);
    }

    function generateSamples(number) {
    	for (var i = 0; i < number; i++) {
    		$scope.items.push({
    			color: randomColor(),
    			data: conservedData(cellPerWidth, cellPerHeight),
    			height: 16,
    			width: 16
    		});
    	}
    }

    function duplicateGenome(genome) {
    	// body...
    	var duplicatedGenome = [];
    	for (var i = 0; i < genome.length; i++) {
    		duplicatedGenome[2*i] = [];
    		duplicatedGenome[2*i + 1] = [];
    		for (var j = 0; j < genome[i].length; j++) {
    			duplicatedGenome[2*i][2*j] = genome[i][j];
    			duplicatedGenome[2*i][2*j + 1] = genome[i][j];
    			duplicatedGenome[2*i + 1][2*j] = genome[i][j];
    			duplicatedGenome[2*i + 1][2*j + 1] = genome[i][j];
    		}
    	}
    	return duplicatedGenome;
    }

    function randomData(perWidth, perHeight) {
    	var data = [];
    	for (var i = 0; i < perHeight; i++) {
    		data[i] = []
    		for (var j = 0; j < perWidth/2; j++) {
    			data[i][j] = Math.random() * 10;
    		}
    	}
    	return data;
    }

    function conservedData(perWidth, perHeight) {
    	var data = [];
    	for (var i = 0; i < perHeight; i++) {
    		data[i] = []
    		for (var j = 0; j < perWidth/2; j++) {
    			data[i][j] = 0;
    		}
    	}

    	mutatePoint(data, 20, Math.floor(Math.random() * perHeight), 0, perHeight, perWidth/2);

    	return data;

    }

    function mutatePoint(genome, steps, x, y, width, height) {
    	console.log(steps, x, y, width, height);
    	if (steps == 0) {
    		return genome;
    	}

    	if (x>=0 && y>=0 && x<width && y<height) {
    		genome[x][y] = 6;
    	} else {
    		x = Math.abs(x);
    		y = Math.abs(y);
    	}

    	var chance = Math.floor(Math.random() * 10);
    	
    	switch(chance) {
    		case 0:
    			break;
  			case 1:
    			x = x-1;
    			y = y;
    			break;
    		case 2:
    			x = x-1;
    			y = y+1;
    			break;
  			case 3:
  				x = x;
    			y = y+1;
    			break;
     		case 4:
     			x = x+1;
    			y = y+1;
    			break;
  			case 5:
  				x = x+1;
    			y = y;
    			break;
    		case 6:
    			x = x+1;
    			y = y-1;
    			break;
  			case 7:
  				x = x;
    			y = y-1;
    			break;
    		case 8:
    			x = x-1;
    			y = y-1;
    			break;
    		case 9:
    			break;
  			default:
		}

    	return mutatePoint(genome, steps-1, x, y, width, height);
    }

    function randomColor() {
    	var colors = ['red', 'blue', 'green'];
    	return colors[Math.floor(Math.random() * colors.length)];
    }

    function mutateGenome(genome) {
    	var newGenome = [];
    	for (var i = 0; i < genome.length; i++) {
    		newGenome[i] = []
    		for (var j = 0; j < genome[i].length; j++) {
    			if (i>0 && j>0 && i<(genome.length-1) && j<(genome[i].length-1)) {
    				newGenome[i][j] = ((genome[i-1][j]   + genome[i+1][j]   + genome[i][j-1]   + genome[i][j+1])   * 0.125)
    				                + ((genome[i-1][j-1] + genome[i-1][j+1] + genome[i+1][j+1] + genome[i+1][j-1]) * 0.0625)
    				                + (genome[i][j] * 0.25);
    				newGenome[i][j] = Math.floor(newGenome[i][j]);
    				if (newGenome[i][j] > 7) {
    					newGenome[i][j] -=  Math.random() * 2;
    				} else if (newGenome[i][j] < 2) {
    					newGenome[i][j] +=  Math.random() * 2;
    				}
    				               
    			} else {
					newGenome[i][j] = genome[i][j];
    			}
    		}
    	}
    	return newGenome;
    }

    $scope.mutate = function(item) {
    	// item.data = mutateGenome(item.data);
    	var candidates = [];
    	for (var i = 0; i < item.data.length; i++) {
    		for (var j = 0; j < item.data[i].length; j++) {
    			if(item.data[i][j] > 5) {
    				candidates.push({i:i, j:j});
    			}
    		}
    	}
    	var startPoint = candidates[Math.floor(Math.random() * candidates.length)];
    	return mutatePoint(item.data, 16, startPoint.i, startPoint.j, item.data.length, item.data[0].length);
    };

    $scope.duplicate = function(item) {
    	item.data = duplicateGenome(item.data);
    	item.width = item.width/2;
    	item.height = item.height/2;
    }

    // $scope.items = [
    // {
    // 	color: 'red',
    // 	data: [[1,2,3], [4,5,6], [7,8,9]]
    // },
    // {
    // 	color: 'blue',
    // 	data: [[1,2,3], [4,5,6], [7,8,9]]
    // },
    // {
    // 	color: 'green',
    // 	data: [[1,2,3], [4,5,6], [7,8,9]]
    // }
    // ];
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});