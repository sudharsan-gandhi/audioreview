	angular.module('starter.controllers', [])
		
		.controller('viewController',function($scope,$cordovaGeolocation,$resource,$timeout,$http,$cordovaDialogs) {
		try{
			var Rest=$resource('http://192.168.1.102:3000/getjson');
			$scope.movies=[];
			
	$scope.doRefresh=function(){
		console.log('Refreshing!');
		$timeout( function() {
      //simulate async response
      Rest.query(function(result){
				$scope.movies=result;
		 	});

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
		

	}
			
	$scope.locale=function getPosition() {

	   var options = {
	      enableHighAccuracy: true,
	      maximumAge: 3600000
	   }
		
	   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

	   function onSuccess(position) {
	   		
	      var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ position.coords.latitude+'%2C'+position.coords.longitude+'&language=en';
					
		$http.get(GEOCODING)
			.success(function(data, status, headers,config){
			  //$cordovaDialogs.alert('data success');
			  $cordovaDialogs.alert(data.results[0].address_components[4].long_name,'Location'); // for browser console
			  $scope.location = data.results[0].address_components[5].long_name; // for UI
			})
			.error(function(data, status, headers,config){
			  console.log('data error');
			});
			      
			   };

	   function onError(error) {
	   	// $cordovaDialogs.alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n','Error');
	   	$cordovaDialogs.alert('Check GPS and and Internet','error');
	   }
	}
			
			$scope.title="all movies";
			
			var date= new Date();
			$scope.time="Today: "+date.getDate()+":"+(date.getMonth()+1)+":"+date.getFullYear();               
			
		}catch(err){
			console.log(err);
		}	
		})
// view controller over//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//add controller starting/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		.controller('addController',function($scope,$cordovaFile,$cordovaFileTransfer,$resource,$stateParams,$cordovaDialogs) {	
				// body...
				try{
			// var Rest=$resource('http://192.168.1.102:3000/upload');
			$scope.title="Add Movies"
			var id=parseInt($stateParams.id);
			$scope.url="http://192.168.1.102:3000/upload/"+id;
			var gfile='';
			var sfile='';
	
			
			$scope.stop = function() {
			  window.plugins.audioRecorderAPI.stop(function(msg) {
			  	
			  	persist(msg);
			    // success 
			    // document.getElementById('recordbutton').disabled=false;
			    // $cordovaDialogs.alert('ok: ' + msg,'recording');
			    $cordovaDialogs.alert(msg,'Hurray');
			  }, function(msg) {
			    // failed 
			    // $cordovaDialogs.alert('ko: ' + msg);
			    $cordovaDialogs.alert('press record button first','oops');

			  });
			}
			$scope.record = function() {
				console.log("inside record");
			  window.plugins.audioRecorderAPI.record(function(msg) {
			  	persist(msg);
			    $cordovaDialogs.alert(msg,'Hurray');
			  	// "action='http://192.168.1.102:3000/upload' "+
 
			}, function(msg) {
			  $cordovaDialogs.alert('ko: ' + msg);
			}, 15); 
			}
			////////recrded file to copy and persist/////////////////////////////
			var persist=function(savedFilePath){
				gfile=savedFilePath;
			  	// $cordovaDialogs.alert('fullpath'+savedFilePath);
			  	path=savedFilePath.substr(gfile.lastIndexOf('/')+1);
			  	// $cordovaDialogs.alert("recorded path:"+path);
			  	

			  	// $cordovaDialogs.alert("data dir:"+cordova.file.dataDirectory);
			  	// $cordovaDialogs.alert("app dir:"+cordova.file.applicationDirectory);
			  	// $cordovaDialogs.alert("app storage dir:"+cordova.file.applicationStorageDirectory);
			  	// $cordovaDialogs.alert("ext dir:"+cordova.file.externalDataDirectory);
			  	// $cordovaDialogs.alert("ext root:"+cordova.file.externalRootDirectory);
			  	// ////////////////checking directory ?????????????????????????????????????????????????????????
			  	$cordovaFile.checkDir(cordova.file.externalRootDirectory,'moviereview')
			  		.then(function(success){
			  			// $cordovaDialogs.alert('directory present'+success);
			  			copy();
			  		},function(error){
			  			$cordovaFile.createDir(cordova.file.externalRootDirectory,'moviereview',false)
			  				.then(function(success){
			  					// $cordovaDialogs.alert('directory created');
			  					copy();
			  				},function(error){
			  					$cordovaDialogs.alert('While creating directory','error');
			  				}
			  				);
			  		}
			  		);
			  		// ////////copy file into directory######################################################
			 function copy(){
			 	sfile=Date.now()+'.m4a';
			  	$cordovaFile.copyFile(cordova.file.dataDirectory,path,cordova.file.externalRootDirectory,'moviereview/'+sfile)
			  		.then(function(success){
			  			$cordovaDialogs.alert('successfully saved at'+cordova.file.externalRootDirectory+moviereview,'Notification');
			  		},function(error){
			  			$cordovaDialogs.alert('While persisting file','error');
			  		});
			  	}
			}
			$scope.playback = function() {
			  window.plugins.audioRecorderAPI.playback(function(msg) {
			    // complete 
			    $cordovaDialogs.alert('complete','Playback');
			  }, function(msg) {
			    // failed 
			    $cordovaDialogs.alert('error','Playback');
			  });
			}

			$scope.upload=function(){
					var upload=cordova.file.externalRootDirectory+'/moviereview/'+sfile;
					// $cordovaDialogs.alert("location:"+upload);

					var uri = encodeURI("http://192.168.1.102:3000/upload/"+id);

					$cordovaFileTransfer.upload(uri,upload,{})
						.then(function(result){
							$cordovaDialogs.alert('success','Upload');
							console.log(result);
						},
						function(error){
							$cordovaDialogs.alert('error','Upload');
							console.log(error);
						}
						);
					
				}

		}catch(err)	{
			console.log(err);
		}
		})
//add controller over////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//each controller starting
		.controller('eachController',function($scope,$resource,$stateParams,$location,$cordovaDialogs) {
			try{
			console.log($stateParams.id);
			var param=$stateParams.id;
			var Rest=$resource('http://192.168.1.102:3000/each/'+param);
			$scope.movie=[];
			Rest.query(function(result){
				$scope.movie=result;
		 	});
			
			$scope.redirect=function(){
				
				$location.path('add/'+param);
			}
			$scope.showreviews=function(){
				$location.path('audio/'+param);
			}

		}catch(err){
			console.log(err);
		}	
		})
// ///////////audio controller////////////////////////////////////////////////////////////////////////////////////////////
		.controller('audioController',function($scope,$stateParams,$resource,$cordovaDialogs){
			try{
			var id=$stateParams.id;
			var Rest=$resource('http://192.168.1.102:3000/audio/'+id);
			$scope.audios=[];
			Rest.query(function(result){
				$scope.audios=result;
			});
		}catch(err)}{
			console.log(err);
		}
		})