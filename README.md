## angular-palette

### What Is It?


So I heard you liked the Sublime Text command palette. Me too. So much so, that 
I thought it was missing from a lot of the web applications I build. 

angular-palette is an angular component that aims to replicate the command
palette from Sublime Text .

**angular-palette** automatically takes all of the routes in your angularjs
application and turns them into commands that can be executed from the command
palette with the keyboard, suhweet! Sorry, I lied to you; It doesn't do it 
'automatically'. You also need to include a name property on all of your routes
in your $routeProvider configuration. This name property will be displayed in the
palette.


### Demo

Just press 'ctrl+shift+l' to bring up the command palette.

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

### Features
 - Sublime Text Like Command Palette for quick actions with the keyboard
 - Easily add all routes to the palette
 - Export context-sensitive actions to the palette
 - Looks Boss. Styled to look like the Dark Soda Theme

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
