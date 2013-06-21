## angular-palette

### What Is It?


So I heard you liked the Sublime Text command palette. Me too. So much so, that 
I thought it was missing from a lot of the web applications I build. 

**angular-palette** is an angular component that replicates the Sublime Text command
palette for routes and global (or context sensitive) actions in your angular app.

**angular-palette** automatically takes all of the routes in your angularjs
application and turns them into commands that can be executed from the command
palette with the keyboard, suhweet! Sorry, I lied to you; It doesn't do it 
'automatically'. You also need to include a name property on all of your routes
in your $routeProvider configuration. This name property will be displayed in the
palette.


### Demo

Just press 'ctrl+shift+l' to bring up the command palette.

### Features
 - Sublime Text Like Command Palette for quick actions with the keyboard
 - Easily add all routes to the palette
 - Export context-sensitive actions to the palette
 - Looks Boss. Styled to look like the Dark Soda Theme

### Installation

1. Clone this repo or run `bower install angular-palette2`
2. Include the `angular-palette.js`, `palette-darksoda.css`, `mousetrap.js`,
`mousetrap-global-bind.js` files in your page. (There's also a build with mousetrap
included. In this dist folder look for `angular-palette-deps.min.js`)
3. Declare this module as a dependency of your application
`angular.module('myApp', ['palette'])`
4. Include `<palette></palette>` at the top of your main page (probably index.html)

### Usage

There's a few things that come with angular-palette
 - **paletteService** (used for exporting commands)
 - **drBlur** - a directive for calling functions on blur events
 - **drFocusOn** - a directive for focus the element this is applied to when the expression
passed is true
 - **drScrollToContain** - a directive for making the page scroll to contain this element
when the expression passed is true
 - **drHighlight** - a directive to highlight a query in text (requires ng-bind-html-unsafe)
 - **palette** - The directive this whole module is about

You're welcome to use any of the other directives included but the important things
are the palette directive and the paletteService.

When you've got everything installed the first thing to do is adding your routes to the
palette. This is simply done by adding a name property to the routes you have defined

**Example:**

    angular.module('myApp', ['palette'])
      .config(function ($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            name: 'Main Page'
          })
          .when('/something', {
            templateUrl: 'views/something.html',
            controller: 'SomethingCtrl',
            name: 'Something Page'
          })
          .when('/first', {
            templateUrl: 'views/first.html',
            controller: 'FirstCtrl',
            name: 'First Page'
          })
          .when('/thirdly', {
            templateUrl: 'views/thirdly.html',
            controller: 'ThirdlyCtrl',
            name: 'The Thirdly Page'
          })
          .when('/item/:id', {
            templateUrl: 'views/item.html',
            controller: 'ItemCtrl'
          })
          .otherwise({
            redirectTo: '/'
          });
      });

That's it!

If you want to export some commands to the palette you can do that with the paletteService

**Warning:** angular-palette is super new so this feature is a little iffy at the moment. You
can only export commands from one view/controller at a time so if you've got any nested views
and you try exporting from multiple that wont work.

**Example:**

    angular.module('myApp')
      .controller('MainCtrl', ['paletteService', function(paletteService) {
        $scope.makeMessage = function () {
          alert('called from the palette!');
        }

        paletteService.exportCommands([
          {
            name: "Notify: Alert Message",
            cmd: function () {
              $scope.makeMessage();
            },
            data: 'something'
          }
        ]);

      }]);

***name** (string) is what you want to be displayed in the palette
**cmd** (function|string) takes a function you wish to call when the command is selected from the palette
**data** (optional) only used for the built in functions

**cmd** can also take a couple built in functions
 - 'link' (string) - When this command is selected the $location.path will be set to the **data**
that is passed in.
 - 'extLink' (string) - When this command is selected the window.location will be set to the **data** that is passed in.


### Why Should I Use It?

Power users love to keep their hands on the keyboard at all times. Most web apps
fall behind their desktop counterparts in this regard. (Note: angular-palette
does not offer global keyboard shortcuts for commands. Maybe in the future)

The palette works well for global actions across the application, routes and 
links are the perfect candidate under this stance. You may also want to 
expose various commands depending on the context of the app (current view). Or
maybe you want to list out a collection of items in the palette. Those are both
supported at the moment, but the API is pretty fragile and only supports exporting
from one controller at a time (they replace each other) which is soon to be fixed.

### Coming Soon

 - Customizeable Shortcut Key for opening the palette
 - Multiple Styles (Light Soda first)
 - Fuzzy Filtering just like sublime does. (Only normal filtering at the moment)
 - Export commands from more than one controller at a time.
 - Custom Scroll Area - Styled right in all browsers and better scrolling while following
results in the palette with up/down keys.
 - Handle MouseTrap shortcut key binding in one go, and display those key combos
in the palette like Sublime Text does.
 - Docs

### Dependencies

 - MouseTrap [https://github.com/ccampbell/mousetrap](https://github.com/ccampbell/mousetrap)
 - NgSanitize

### Contributing

Coming soon
