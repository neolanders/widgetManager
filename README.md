# Widget-Manager #

After being interviewed for a reputed company, I got an interesting assignment to do using ui-router. 
I found it a very useful and flexible solution to use routing with nested views. 
Also this assignment involve many aspects and technologies to build a proper web application today ([AngularJS](https://angularjs.org/), [Grunt](http://gruntjs.com/) JavaScript Task Runner, Server running on [NodeJs](http://nodejs.org/), [Twitter Botstrap](http://getbootstrap.com/) (Css3), [Karma](http://karma-runner.github.io/0.12/index.html) and [Jasmine](http://jasmine.github.io/) for testing)

For this reason I've decided to share my work below. 

**Assignment Description:**

Using AngularJS as the Javascript framework (with ui-router for views management, 
and ui-bootstrap for bootstrap directives), and Twitter Bootstrap as the CSS framework, 
code a “widget” manager.  The Widget Manager will have a homepage and an add/edit page.    

The homepage view should contain two “views” (ui-router terminology).  
The views are: 
*  widget summary    
*  widget detail 
               
The homepage url will be /#/ (localhost:3000/#/) and will only display the summary, 
a list of widget names.  Next to each name will be two buttons: “details", 
and “remove".  

This summary should be located on the left half of the screen.  
To the bottom left of the summary should be an “add” button which is discussed below.  
If a user clicks on the details button, the url will change to /#/[widgetID], 
and display the widget details on the right half of the screen.  If a user clicks on the remove button, 
they will be prompted with a ui-bootstrap dialog confirmation.  Upon confirmation, 
the widget will be deleted from the summary.    

The details half of the page will display the widget name in bold, and a list of key/value pairs that comprise the widget. 
To the bottom right of the details will be an “edit” button.  
Clicking on the “add” or “edit" button will take the user to a new main view (/#/edit, /#/edit/[widgetID] respectively).  
This will show a view of text fields.  The top most text field should be a place to enter the widget name.  
Under this text field should be paired text fields for the key/value pairs that will be stored in this widget.  
Show 5 key/value text field pairs.  To the bottom right of the text fields is a save button, 
which will add the widget to the list of widgets in the summary. 

Please note that you will be responsible for generating the ids for each widget.  
Please store the widgets in either a cookie, or local storage.  

**extra credits:**
                 
* have an “x” button on the top right of the details view to clear the view from the screen. 
* make sure all widget names are unique (if not, show a ui-bootstrap error alert) 
* if there is an error in the key/value pairs (empty key), disable the save button, 
  and highlight the empty key text field 
* make the number of key/value text field pairs dynamic: next to each key/value pair text fields will be                       either a minus button, a plus button, or both for adding and removing key/value pairs while editing. 
  (For example, in add, there will be one key/value text fields pair with a plus button.  
  Once the plus button is clicked and a new pair of key/value text fields is present, the first plus will                      change to a minus, and the second will contain a plus and minus)  

--
**As a hint:** ui-router has the ability to apply multiple views inside of a view.  
      
---  
                 
For example, you can have a 

```html
<div ui-view=“main”></div>
```
, and the template that you apply to this “main” view can have within it 

```html
<div ui-view=“summary”></div><div ui-view=“details”></div>
```

, or a different view can set the main template to have 

```html
<div ui-view=“edit”></div>.  
```

This is all handled via the $stateProvider in the module config using ui-router nested views.

## Usage

Run and Install node dependency for the project :
```
npm start
```

## Project Structure

Overview

    ├── assets
    │   └── widgetProperties.json  - Some mocks for widget properties (used in test)
    │   └── widget.json            - Some mocks for single widget 
    │   └── widgets.json           - Some mocks for widgets list
    |
    |── dists                   - This folder contain our files for include after processing grunt task
    │    └── main.js            - Concat file js for our application (see grunt concat task, configuration in GruntFile.js)
    │    └── widget.css         - Concat file css for our application (see grunt concat task, configuration in GruntFile.js)
    │    └── widget.min.css     - Concat and minify file css for our application 
    |── fonts
    |    └──  glyphicons-XXX    - All glyphicons used with Twitter Botstrap 
    |── i18n
    │   └── lang-en_En.json     - Our ressource bundle (english version)
    |── libs                    - This folder contain all necessary 3thirds parts libs for our application (should be listed     |   └── angular-cache         under bower.json and generate after bower install)
    │   └── angular                
    │   └── angular-bootstrap              
    |   └── .. 
    |── modules                  - I part the application into two modules (core and widget)
    │   └──  core                - Contain all globals for our app
    │        └── config
    │        └── filters
    │   └──  widget              - Contain all needs for widget app
    │        └── config
    │        └── controllers
    |        └── directives
    |        └── services
    |        └── tests
    |        └── views
    |
    |__ node_modules           - Contain all node modules (bower + grunt + karma + http-server) lister under package.json
    |
    └── styles
    |   ├── css                - Our css files
    |   └── less               - Our less files
    └── app.js                 - Main file for angular bootstrap
    └── GruntFile.js           - Configucations files for our tasks (build...)
    └── karma.conf.js          - Configuration file for our tests
    └── package.json

## Some explanation about my work:

I part the project in two modules,
wmApp.core (core application)
wmApp.widget (application for widgetManager)
Each modules has its own dependencies (filters, directives, controllers, views) depending on their needs.

## LOCAL NODE SERVER:
First copy the package.json.back content to package.json then run server.
Server run on nodeJs (npm start) on localhost:3000.

## RUN ON NODE SERVER ON CLOUD9:
After runing npm-start, open:
https://widget-manager-git-neolanders.c9users.io:8080/#/

## UI-ROUTER:
As per requirement, I use angular-ui-router for routing,
States are defined under modules/widget/config/routes.js
In order to keep organize my states in the application and for a better understanding  I'm using a helper called 
angular-ui-router.stateHelper which is allow to manage states as a three object. 

---

AngularUI Router is a routing framework for [AngularJS](http://angularjs.org), which allows you to organize the
parts of your interface into a [*state machine*](https://en.wikipedia.org/wiki/Finite-state_machine). Unlike the
[`$route` service](http://docs.angularjs.org/api/ngRoute.$route) in the Angular ngRoute module, which is organized around URL
routes, UI-Router is organized around [*states*](https://github.com/angular-ui/ui-router/wiki),
which may optionally have routes, as well as other behavior, attached.

States are bound to *named*, *nested* and *parallel views*, allowing you to powerfully manage your application's interface.

Example: http://angular-ui.github.io/ui-router/sample/

-
**Note:** *UI-Router is under active development. As such, while this library is well-tested, the API may change. Consider using it in production applications only if you're comfortable following a changelog and updating your usage accordingly.*

## LOCAL-STORAGE:
In order to store data in local storage for the application, I'm using angular-cache with $angularCacheFactory
Also, to handle Widget data object I've created a  CRUD (create, read, update, delete) Service factory (Widgets)  located under modules/widget/services/widgets.js  

## KARMA TEST:
This is was not a requirement, 
However, I've set the configuration file for karma tests karma.conf.js 
And I've started some test for widgets service and a directive I'm using to manage widget properties.

## DEMO:
https://widget-manager-git-neolanders.c9users.io:8080/#/

## Screens Shot:

![Alt text](/screenshots/screenAdd.png?raw=true "Add View")
