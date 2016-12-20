angular.module('coderFriends', ['ui.router'])
.config(function($urlRouterProvider, $stateProvider) {
  $stateProvider.state('/', {
    template:'<div class="loginBox"><button><a href="http://localhost:3033/auth/github">Github Login</a></button></div>',
    url:'/'
  }).state('home', {
    templateUrl:'templates/home.html',
    // template:'<div><p>FUCKCK</p></div>',
    url:'/home'
    // controller: 'homeCtrl'
  }).state('friend', {
    templateUrl:'/templates/friend.html',
    url:'/friend/:github_username'
  })
  $urlRouterProvider.otherwise('/');
})
