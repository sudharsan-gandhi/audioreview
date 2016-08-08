// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','ngCordova','ngResource'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self','**']); 

  $stateProvider
      .state('view',{
            url: '/view',
                templateUrl:'templates/view.html',
                controller: 'viewController'
      })
      
      .state('add',{
            url: '/add/:id',
            templateUrl:'templates/add.html',
            controller: 'addController'
      })

      .state('each',{
            url: '/each/:id',
            templateUrl:'templates/each.html',
            controller: 'eachController'
      })
      .state('audio',{
            url:'/audio/:id',
            templateUrl:'templates/audio.html',
            controller:'audioController'
      })

      $urlRouterProvider.otherwise('/view');
      
      

});

