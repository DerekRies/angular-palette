'use strict';

angular.module('palette', [])
  .factory('paletteService', [function(){
    return this;
  }])
  .directive('ngBlur', function() {
    return function(scope, elem, attrs) {
      elem.bind('blur', function(){
        scope.$apply(attrs.ngBlur);
      });
    };
  })
  .directive('focusOn', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        attrs.$observe('focusOn', function (newValue) {
          if(newValue === 'true'){
            elem[0].focus();
          }
        });
      }
    };
  })
  .directive('palette', ['$timeout', function($timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'drcomponents/palette/palette.tpl.html',
      link: function (scope, elem) {
        console.log('palette linker function', elem[0]);
      },
      controller: function ($scope) {
        var ENTER = 13,
            UP_ARROW = 38,
            DOWN_ARROW = 40,
            ESCAPE = 27;

        $scope.visible = true;
        $scope.commands = [
          { name: 'Soda Dark.sublime-theme' },
          { name: 'Google.com' },
          { name: 'Sublime Text' },
          { name: 'Components: For angularjs' },
          { name: 'Command Palette' },
          { name: 'Soda Dark.sublime-theme' },
          { name: 'Google.com' },
          { name: 'GOTO: Something Page' },
          { name: 'Sublime Text' },
          { name: 'Components: For angularjs' },
          { name: 'Command Palette' },
          { name: 'Soda Dark.sublime-theme' },
          { name: 'Google.com' },
          { name: 'Sublime Text' },
          { name: 'Components: For angularjs' },
          { name: 'Command Palette' }
        ];
        $scope.activeCmd = 0;

        $scope.keyHandler = function (e) {
          if(e.keyCode === UP_ARROW) {
            $scope.moveSelectUp();
            e.preventDefault();
          }
          else if(e.keyCode === DOWN_ARROW) {
            $scope.moveSelectDown();
          }
          else if(e.keyCode === ESCAPE) {
            $scope.close();
          }
          else if(e.keyCode === ENTER) {
            $scope.finish();
          }
          else {
            $scope.activeCmd = 0;
          }
        };

        $scope.finish = function () {
          if($scope.visible){
            $scope.useSelection($scope.filteredCommands[$scope.activeCmd]);
            $scope.close();
          }
        };

        $scope.useSelection = function (selection) {
          if(typeof selection !== 'undefined') {
            console.log(selection);
            $scope.$$nextSibling.$$nextSibling.targetFunc();
          }
          else {
            $scope.parseTextCommand($scope.query);
          }
        };

        $scope.parseTextCommand = function (query) {
          // Text commands are built into angular-palette
          if(query[0] === ':') {
            var newQuery = parseInt(query.slice(1), 10);
            window.scrollTo(0, newQuery);
          }
        };

        $scope.close = function () {
          $scope.visible = false;
          $timeout(function(){
            $scope.open();
          }, 1000);
        };

        $scope.open = function () {
          $scope.query = '';
          $scope.visible = true;
          $scope.activeCmd = 0;
        };

        $scope.moveSelectUp = function () {
          if($scope.activeCmd > 0) {
            $scope.activeCmd--;
          }
        };

        $scope.moveSelectDown = function () {
          if($scope.activeCmd < $scope.filteredCommands.length - 1) {
            $scope.activeCmd++;
          }
        };

      }
    };
  }]);