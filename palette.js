'use strict';

angular.module('palette', ['ngSanitize'])
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
  .directive('scrollToContain', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        attrs.$observe('scrollToContain', function (newValue) {
          if(newValue === 'true') {
            // elem[0].parentElement.scrollIntoView;
            elem[0].scrollIntoView(false);
          }
        });
      }
    };
  })
  .filter('highlight', function() {

    function wrapText (index, str, prefix, suffix) {
      return [str.slice(0, index), prefix, str.charAt(index), suffix, str.slice(index + 1)].join('');
    }

    return function (value, query) {
      if(typeof query !== 'undefined' && query !== '') {
        var ind = value.toLowerCase().indexOf(query);
        if(ind !== -1){
          return wrapText(ind, value, '<span class="palettematch">', '</span>');
        }
        console.log(value, query, ind);
      }
      return value;
    };
  })
  .directive('palette', ['$timeout','$location', '$route', function($timeout, $location, $route){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'drcomponents/palette/palette.tpl.html',
      link: function (scope, elem) {
        console.log('palette linker function', elem[0]);
      },
      controller: function ($scope) {

        var ENTER_KEY = 13,
            UP_ARROW_KEY = 38,
            DOWN_ARROW_KEY = 40,
            ESCAPE_KEY = 27;

        $scope.visible = true;
        $scope.commands = [
          { name: 'Soda Dark.sublime-theme' },
          { name: 'Google.com' },
          { name: 'Command Palette' },
          { name: 'Sublime Text' },
          { name: 'Bookmarks: Some weird bookmark' },
          { name: 'Bookmarks: Angularjs components' },
          { name: 'Bookmarks: Hey Dere', cmd: 'testerFunc' },
          { name: 'Bookmarks: Portfolio Project' },
          { name: 'Command Palette' },
        ];
        $scope.activeCmd = 0;

        function addRoutesToPallete () {
          for(var path in $route.routes){
            var route = $route.routes[path];
            if (typeof route.name !== 'undefined') {
              $scope.commands.push({
                name: 'GOTO: ' + route.name,
                cmd: 'link',
                data: path
              });
            }
          }
        }

        addRoutesToPallete();


        $scope.keyHandler = function (e) {
          if(e.keyCode === UP_ARROW_KEY) {
            e.preventDefault();
            $scope.moveSelectUp();
          }
          else if(e.keyCode === DOWN_ARROW_KEY) {
            e.preventDefault();
            $scope.moveSelectDown();
          }
          else if(e.keyCode === ESCAPE_KEY) {
            $scope.close();
          }
          else if(e.keyCode === ENTER_KEY) {
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
            try {
              $scope[selection.cmd](selection.data);
            }
            catch (e) {
              console.log('missing a command');
            }
          }
          else {
            $scope.parseTextCommand($scope.query);
          }
        };

        $scope.link = function (path) {
          $location.path(path);
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
          else {
            $scope.activeCmd = $scope.filteredCommands.length - 1;
          }
        };

        $scope.moveSelectDown = function () {
          if($scope.activeCmd < $scope.filteredCommands.length - 1) {
            $scope.activeCmd++;
          }
          else {
            $scope.activeCmd = 0;
          }
        };

        $scope.scrollToContain = function (item) {

        };

      }
    };
  }]);
