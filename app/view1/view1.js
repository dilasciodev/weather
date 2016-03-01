'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'weatherController'
  });
}])


.filter('kelvinToCelsius', function() {
    return function(kelvin) {
      return parseFloat(kelvin) - 273.15;
    };
  })


/*---------geolocate---------*/
  
  .factory('$geolocation', function($http, $q) {
	  
    this.get = function() {
		
		
      var deferred = $q.defer();
	  var e = document.getElementById("nolocation");
	  var e2 = document.getElementById("location");
	 
	  

      navigator.geolocation.getCurrentPosition(
        function(result) {
      
         deferred.resolve(result);
		  
		  console.log("cool I see ya!");
			
	
       
          e.style.display = 'none';
		  e2.style.display = 'block';
		  
        },
        function(error) {
        
          deferred.reject(error);
		  
		    console.log("bummer!");
		  
			
			
       
			e2.style.display = 'none';
			e.style.display = 'block';
      
        }
      );

    
      return deferred.promise;          
    };

    return this;
  })
  
 /*---------connect to weather api---------*/
 
 
  .factory('$weather', function($q, $http) {
	  
	  
    var API_ROOT = 'http://api.openweathermap.org/data/2.5/';
    var API_KEY = "6a1d76941ba99a6026028579137b0f24";

	/*------------by lat/lon-----------------*/
   
    this.byLocation = function(coords) {
		
      var deferred = $q.defer();
	 

      $http.jsonp(API_ROOT + '/weather?callback=JSON_CALLBACK&lat=' + coords.latitude + '&lon=' + coords.longitude +'&APPID='+ API_KEY ).then(
        function(response) {
          var statusCode = parseInt(response.data.cod);

          if (statusCode === 200) {
			  
            deferred.resolve(response.data);
			console.log('ok got it');
			
            console.log(coords.latitude);
            console.log(coords.longitude);
          }
          else {
            deferred.reject(response.data.message);
          }
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
	
	 return this;
  })

 
  
/*---------main controller---------*/
	
.controller('weatherController', function ($scope , $http,  $geolocation, $weather, $interval) {
	
	
	$scope.updateLocalWeather = function() {
	 
		$geolocation.get().then(
	  
			  
			function(position) {
			
				$weather.byLocation(position.coords).then(
		  
					function(data) {
				
						$scope.persons = data;
						$scope.temperature = data.main.temp;
						$scope.latitude =  data.coord.lat;
						$scope.longitude = data.coord.lon;
						$scope.wicon = data.weather[0].icon;
						$scope.weathermain = data.weather[0].main;
						$scope.weatherdesc = data.weather[0].description;
						$scope.cloudcover = data.clouds.all;
						$scope.windspeed = data.wind.speed; 
			  
           
					}
				);
			}  
                
		);
    };
	
	
		
	$scope.submit = function(user) {
		
		var isvalid = true;
		
			if (isvalid) {
		
		
			var zipper = user.zipcode; 
              
				$http.get('http://api.openweathermap.org/data/2.5/weather?zip='+ zipper +',us&APPID=6a1d76941ba99a6026028579137b0f24').success(function(data) {
    
	
					if(data.coord == undefined){
			
					$scope.data1 = {
					show: true,
					hide: false
	
					};
			
			
			
					console.log('hey thats not a zipcode!');
			
					}else{
			
						$scope.data1 = {
						show: false,
						hide: true
	
						};
		
			
					console.log('that is a zipcode!');
			
				}
	

				$scope.persons = data;
				$scope.temperature = data.main.temp;
				$scope.latitude =  data.coord.lat;
				$scope.longitude = data.coord.lon;
				$scope.wicon = data.weather[0].icon;
				$scope.weathermain = data.weather[0].main;
				$scope.weatherdesc = data.weather[0].description;
				$scope.cloudcover = data.clouds.all;
				$scope.windspeed = data.wind.speed; 
	 
		});
	   
        return true;
		
    }
	
    return false;
	
  }
	
 $scope.updateLocalWeather();
    
 
  
});



