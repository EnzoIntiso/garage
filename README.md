## Vence Garage Application

#Requirements
- the application needs to be run under a webserver (any public folder is fine)
- gem scss_lint (gem install scss_lint , 
gem file: gem 'scss_lint', '~> 0.46.0')


#Installation
------------
- install packages by typing:
```
npm install
```

- run Gulp's default task typing the following command:
```
"node_modules\.bin\gulp"
```
or just "gulp" if Gulp is already installed globally. The default task will performe:
- cleaning of the builder folders from eventual preexisting files
- image sprite creation with the relative stylesheet
- import in a dedicated subfolder of the app of the necessary minified libraries and stylesheets from the standard folder "node_modules"
- SASS compiling
- compiled SASS concatenation with other existing stylesheets in un one single CSS file
- minification of the CSS concatenated file
- injection of the minified CSS file into index.html

NOTE
1) All the mentioned sub-tasks are implemented individually routine and can be run separetely.
2) Minified stylesheets come mapped so the styles and classes can be tracked by a dev tool inspection. Anyway, it is available a separate main task that runs all the sub-tasks from the default excpet for the minification. 
To run it you have to type:
"node_modules\.bin\gulp default-no-min-styles"
3) Naturally more subtasks can be added to Gulp (such as HTML minification, image optimizations, JavaScript Hint etc.), but for the sake of the readability of the code or because they would have bring no real benefits at this stage of the project, they were excluded.

#Behind the scenes
Data Storage
At first initialization the application performes an ajax call to the server in order to retrieve data about parked vehicles.
A failed ajax call displays its error details in a modal window (this is likely something that will be not experience unless to manipulate some files or code in order to provoke the failure. A quick try is to corrupt the json file in the "api" folder).
The response is just a dummy JSON file containing hard-coded data.
Then data is stored in Backbone locastorage and used as regular database in order to provide data persistence after CRUD operations and refreshing.
It is possible from the menu to clear all the current and local-storage data click on dedicated button added only for this purpose.