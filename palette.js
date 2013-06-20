'use strict';

angular.module('palette', ['ngSanitize'])
  .factory('paletteService', [function (){

    var oldCommands = [];

    return {

      subscribedMethod: undefined,

      exportCommands: function (newCommands) {
        if(typeof this.subscribedMethod !== 'undefined'){
          console.log('Should be calling subscribedMethod right now');
          this.subscribedMethod(newCommands, oldCommands);
        }
        oldCommands = newCommands;
      },
      getCommands: function () {
        return oldCommands;
      },
      subscribe: function (fn) {
        console.log('Setting up subscribe ', fn);
        this.subscribedMethod = fn;
      }
    };

  }])
  .directive('ngBlur', function () {
    return function(scope, elem, attrs) {
      elem.bind('blur', function () {
        scope.$apply(attrs.ngBlur);
      });
    };
  })
  .directive('focusOn', [function () {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        attrs.$observe('focusOn', function (newValue) {
          if(newValue === 'true'){
            setTimeout(function () {
              elem[0].focus();
            }, 100);
          }
        });
      }
    };
  }])
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
  .filter('highlight', function () {

    function wrapText (index, str, prefix, suffix, innerTextLength) {
      return [str.slice(0, index), prefix, str.slice(index, index + innerTextLength), suffix, str.slice(index + innerTextLength)].join('');
    }

    return function (value, query) {
      if(typeof query !== 'undefined' && query !== '') {
        var ind = value.toLowerCase().indexOf(query);
        if(ind !== -1){
          return wrapText(ind, value, '<span class="palettematch">', '</span>', query.length);
        }
        // console.log(value, query, ind);
      }
      return value;
    };
  })
  .directive('palette', ['$timeout','$location', '$route', 'paletteService',
    function($timeout, $location, $route, paletteService){
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'drcomponents/palette/palette.tpl.html',

      link: function (scope) {
        var keys = {};
        angular.element(window).bind('keydown', function (e) {
          keys[e.keyCode] = true;
          if(keys[17] && keys[77]) {
            if(scope.visible){
              scope.$apply(function () {
                scope.close();
              });
            }
            else{
              scope.$apply(function () {
                scope.open();
              });
            }
          }
        })
        .bind('keyup', function (e) {
          keys[e.keyCode] = false;
        });
      },

      controller: function ($scope) {

        var ENTER_KEY = 13,
            UP_ARROW_KEY = 38,
            DOWN_ARROW_KEY = 40,
            ESCAPE_KEY = 27;

        $scope.visible = false;
        $scope.commands = [
          { name: 'Fake: Placeholder Command' },
          { name: 'Placeholder: Does Nothing' },
          { name: 'Fake: Could Do Something. But I Doubt It.' },
          { name: 'Placeholder: Just Try It Anyway' },
          { name: 'Fake: Lorem ipsum dolor sit.' },
          { name: 'Placeholder: Lorem ipsum dolor.' },
          { name: 'Fake: Lorem ipsum dolor sit amet, consectetur.' },
          { name: 'Placeholder: Lorem ipsum dolor sit amet.' },
          { name: 'GOTO: Google.com', cmd: 'extLink', data: 'http://google.com' },
        ];

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

        function removeOldCommands (oldCommands) {
          console.log('removed ', $scope.commands.splice(-oldCommands.length, oldCommands.length));
        }

        function addNewCommands (newCommands) {
          $scope.commands.push.apply($scope.commands, newCommands);
        }

        paletteService.subscribe(function (newCommands, oldCommands) {
          console.log('Change in the subscribe', oldCommands);
          removeOldCommands(oldCommands);
          addNewCommands(newCommands);
        });

        $scope.activeCmd = 0;
        addRoutesToPallete();
        // $scope.commands.push.apply($scope.commands, paletteService.getCommands());

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

        $scope.finish = function () {
          if($scope.visible){
            $scope.useSelection($scope.filteredCommands[$scope.activeCmd]);
            $scope.close();
          }
        };

        $scope.close = function () {
          // if this isn't delayed then the palette closes before ng-clicks can fire
          // this enables the mouse to be used to select results (but don't use the mouse you bad)
          $timeout(function () {
            $scope.visible = false;
          },1);
        };

        $scope.open = function () {
          $scope.query = '';
          $scope.visible = true;
          $scope.activeCmd = 0;
        };

        $scope.useSelection = function (selection) {
          if(typeof selection !== 'undefined') {
            try {
              if (typeof selection.cmd === 'function') {
                selection.cmd(selection.data);
              }
              else {
                $scope[selection.cmd](selection.data);
              }
            }
            catch (e) {
              console.log('missing a command');
            }
          }
          else {
            // Special Text Commands like ':300' to go 300px down
            // More features will be implemented later
            $scope.parseTextCommand($scope.query);
          }
        };

        $scope.link = function (path) {
          $location.path(path);
        };

        $scope.extLink = function (path) {
          window.location = path;
        };

        $scope.parseTextCommand = function (query) {
          if(query[0] === ':') {
            var newQuery = parseInt(query.slice(1), 10);
            window.scrollTo(0, newQuery);
          }
        };

      }
    };
  }]);
