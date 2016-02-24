# Vence Garage Application

##Requirements
- the application needs to be run under a webserver (any public folder is fine)
- gem scss_lint (gem file: gem 'scss_lint', '~> 0.46.0')

##Installation
1) install packages by typing:
```
npm install
```
2) run Gulp's default task by typing the following command:
```
"node_modules\.bin\gulp"
```
or type just "gulp" if Gulp is already installed globally on your system.
The Gulp's default task will perform:
- cleaning of the builder folders from eventual preexisting files
- image sprite creation with the relative stylesheet
- import in a dedicated subfolder of the app of the necessary minified libraries and stylesheets from the standard folder "node_modules"
- SASS files linting
- SASS files compiling
- compiled SASS files concatenation with other existing stylesheets in un one single CSS file
- minification of the CSS concatenated file
- injection of the minified CSS file into index.html


####NOTES ABOUT GULP TASKS
1. All the mentioned Gulp sub-tasks are implemented individually and can be run separately.
2. Minified stylesheets come mapped so styles and classes can be tracked by a dev tool inspection. Anyway, it is available a separate main task that runs all the sub-tasks from the default except for the minification.

To run it you have to type:
"node_modules\.bin\gulp default-no-min-styles"
3. Watchers tasks are also provided (respectively "watch" and "watch-no-min-styles" for including and stylesheets excluding minification).
4. Naturally more subtasks can be added/piped (e.g. HTML minification is implemented - "minify-html" - but not piped; image optimizations/compression is missing; ecc), but, for the sake of the code readability or because they would not have broguht any no real benefits to the application at this stage, they were omitted.


##Behind the scenes

###Data Storage
At first initialization the application performs an Ajax call in order to retrieve the data about parked vehicles and result pagination.

A failed ajax call displays its error details in a modal window (this is likely something that will be not experience unless to manipulate some files or code in order to provoke the failure. A quick try is to corrupt the json file in the "api" folder).

The response is just a dummy JSON file containing hard-coded data.

Then data is stored in Backbone localStorage and used as regular database in order to provide data persistence after CRUD operations and refreshing.

It is possible from the menu to clear all the current and local-storage data click on dedicated button added only for this purpose.

###Pagination
First data about pagination (number of pages, result per page, etc.) comes from the JSON response at initialization.

If some data are missing, the pagination model is providing some default values. Anyway data like number of pages and and total result are recalculated by the system.

If some settings are available in the localStorage they are fetch and take the priority over server and model default values.