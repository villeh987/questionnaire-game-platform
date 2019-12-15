# BWA/TIETA12 coursework assignment

In the assignment, we gamify multi-choice questionnaire.
The assignment consists of three parts: the game, management view, and testing/documentation.

1. game - some mechanism for selecting the right answers

2. management implies CRUD operations: questions can be created, queried, modified, and deleted.

3. test your modifications, that is game and management view in particular, other tests can be implemented as well.

In the beginning of December, we will meet all the groups to check that each
group has some idea how to proceed.
In addition, we promote MIT licensing:
if you grant the license, your game may be integrated in the LukioPlussa project;
the project is funded by the Ministry of Education. Its aim is to provide free learning material
for high-school students, especially for the domains of mathematics and computer science.

### The project structure

```
.
├── app.js                  --> express app
├── index.js                --> bwa app
├── package.json            --> app info and dependencies
├── controllers             --> controllers (handle e.g. routing)
│   ├── game.js             --> controller for the game
│   ├── questionnaire.js    --> controller for viewing questionnaires
│   └── hello.js            --> the same as "minimal viable grader"
├── models                  --> models that reflect the db schemes
│   │                           and take care of storing data
│   ├── db.js                    --> connecting/disconnecting from db
│   ├── hello.js                 --> "minimal viable grader" grading logic
│   ├── pagination.js            --> assigning page numbers
│   ├── questionnaire.input.js   --> validating input for questionnaires
│   ├── questionnaire.js         --> validating questionnaires
│   ├── user.js                  --> validating users, authenticating
│   └── validator.js             --> input filtering and errors
├── public                  --> location for public (static) files
│   ├── img                 --> for images
│   |   ├── cross.png       --> bullet. source: made for the project
│   |   └── pixel_ship.png  --> player. source: made for the project
│   ├── js                  --> for javascript
│   |   ├── game.js                --> game logic
│   |   └── createQuestionnaire.js --> creates a questionnaire
│   └── css                        --> for styles
│       └── style.css       --> general style file
├── routes                  --> a dir for router modules
│   ├── hello.js            --> / (root) router
│   ├── questionnaire.js    --> router for managing questionnaires
│   ├── game.js             --> router for the game
│   └── users.js            --> /users router
├── views                   --> views - visible parts
│   ├── error.hbs           --> error view
│   ├── game.hbs            --> game view
│   ├── games.hbs           --> view of list of playable questionnaires
│   ├── hello.hbs           --> main view - "minimal viable grader"
│   ├── hello-graded.hbs    --> main view - "minimal viable grader", graded
│   ├── layouts             --> layouts - handlebar concept
│   │   └── default.hbs      --> layout view, "template" to be rendered
│   └── partials            --> smaller handlebar components to be included in views
│   |   ├── bootstrap_scipts.hbs      --> loads bootstrap scripts
│   |   ├── csrf.hbs                  --> adds csrf token
│   |   ├── game_window.hbs           --> div that has the game window
│   |   ├── games_info.hbs            --> info about a game
│   |   ├── games_listing.hbs         --> lists games
│   |   ├── grader_meta.hbs           --> grader meta information
│   |   ├── messages.hbs              --> messages to be displayed on page
│   |   ├── navigation.hbs            --> top navigation bar
│   |   ├── questionnaire_info.hbs    --> info about a questionnaire
│   |   ├── scripts.hbs               --> adds createquestionnaire.js
│   |   ├── stylesheet.hbs            --> adds stylesheets
│   |   ├── user_info.hbs             --> information about user
│   |   └── user_listing.hbs          --> listing of users
│   └── questionnaire            --> for managing questionnaires
│   |   ├── create_new_questionnaire.hbs  --> creating questionnaire
│   |   ├── questionnaire.hbs             --> information about a questionnaire
│   |   └── questionnaires.hbs            --> lists questionnaires
│   └── user            --> smaller handlebar components to be included in views
│       ├── change_password.hbs   --> for changing password
│       ├── change_role.hbs       --> for changing role
│       ├── delete.hbs            --> for deleting a user
│       ├── edit_user.hbs         --> for editing user information
│       ├── login.hbs             --> for logging in
│       ├── register.hbs          --> for registering a new user
│       ├── user.hbs              --> information about one user
│       └── users.hbs             --> user listing
└── test                    --> tests
│   ├── assignment          --> TODO: your tests here
│   ├── integration         --> integration tests
│   |   ├── auth.test       --> authentication
│   |   └── user.test       --> managing users
│   └── models                  --> unit tests for models
│       ├── db.test             --> test database
│       ├── questionnaire.test  --> test validating questionnaires
│       └── user.test           --> test validating users
└── setup                       --> scripts that modify initial app state
│   ├── createdata.js           --> add data from json-file to db
│   ├── createusers.js          --> create initial users
│   └── game.questionnaire.js   --> questionnaire in json format for the game
└── middleware                  --> middleware
|   ├── auth          --> user role authentication
|   ├── passport      --> passport middleware
|   └── webpack       --> webpack middleware
└── config                    --> configuration files
    ├── custom-environment-variables  --> custom enviroment variables
    ├── default                       --> mongoose and session settings
    └── test                          --> sets db name


```

TODO: update this

## Game

For game part of the assignment we created a top down Asteroid-style shooter
that can be used to answer multi choice questionnaires. One game runs for the
length of one questionnaire. Every question is represented in upper part of the
screen and options are flying text boxes that are going in random directions
with somewhat accelerating speeds. Player's task is to shoot all the wrong
answers by hitting them with projectiles that the ship launches by pressing
spacebar key. Right options must be collected by flying in to them. Ship can be
controlled with cursor keys. Up accelerates while left and right rotate the
ship. When player has either collected or shot all the options new options and
a new question will arrive. After all questions are done score is sent to them
grader for evaluation.

Most of the game is created with Phaserjs, a game engine for creating web based
games that uses MIT license. It was chosen because of it's popularity, web first
-approach and the convenient license. It is available as a Node module from Npm
but the page also needs to include it as a script to make some functionality
accessible to the client side. We have chosen to include it from a well known
public location.

Running: Install with npm install, run with npm start and navigate to
localhost:3000, if the port is available for local testing.

TODO: check in the end that those instructions are valid

## Management view

TODO: describe your work

## Tests and documentation

TODO: describe your work

## Security concerns

TODO: this part needs more improvement

Cross Site Request Forgery attack: Malicious website could include a POST form
that sends a request to this application which causes logged in user to perform
unwanted actions on the serve. For example: Admin user could be tricked into
removing other users. Site protects against this by including csrf token on
every form and demanding that to be used when handling POST-requests.

Cross Site Scripting attack: User add questions or options that when listed are
interpret as html-code. This could be used to add a script that could potentially
do something damaging. This can be protected against by sanitizing all user
input before it is put into the database or displayed. Node has a module for
doing that, xss-filters.

Man in the middle attack: When not using protected connection information sent
by the users is visible to possible eavesdroppers in the network. Some third
party could use this information to collect sensive information or even pose
as the server.

Application uses Helmet to protect itself against many common threats. More info here: https://helmetjs.github.io/

---

## Installation

1. Install `nodejs` and `npm`, if not already installed.

2. Execute in the root, in the same place, where _package.json_-file is):

    ```
    npm install
    ```

3. **Copy** `.env.dist` in the root with the name `.env` (note the dot in the beginning of the file)

    ```
    cp -i .env.dist .env
    ```

    **Obs: If `.env`-file already exists, do not overwrite it!**

    **Note: Do not save `.env` file to the git repository - it contains sensitive data!**

    **Note: Do not modify `.env.dist` file. It is a model to be copied as .env, it neither must not contain any sensitive data!**

    Modify `.env` file and set the needed environment variables.

    In the real production environment, passwords need to be
    long and complex. Actually, after setting them, one does
    not need to memorize them or type them manually.

4. `Vagrantfile` is provided. It defines how the vagrant
   environment is set up, commands to be run:

    `vagrant up` //sets up the environment
    `vagrant ssh` //moves a user inside vagrant

    Inside vagrant, go to the directory `/bwa` and start the app:
    `npm start`

5. As an other alternative, `Dockerfile` is provided as well.
   Then, docker and docker-compile must be installed.
   In the root, give:

    ```
    docker-compose build && docker-compose up
    ```

    or

    ```
    docker-compose up --build
    ```

    The build phase should be needed only once. Later on you should omit the build phase and simply run:

    ```
    docker-compose up
    ```

    The container is started in the terminal and you can read what is written to console.log. The container is stopped with `Ctrl + C`.


    Sometimes, if you need to rebuild the whole docker container from the very beginning,
    it can be done with the following command:

    ```
    docker-compose build --no-cache --force-rm && docker-compose up
    ```

6. Docker container starts _bwa_ server and listens `http://localhost:3000/`

7) Docker container is stopped in the root dir with a command:

    ```
    docker-compose down
    ```

## Coding conventions

Project uses _express_ web app framework (https://expressjs.com/).
The application starts from `index.js` that in turn calls other modules.  
The actual _express_ application is created and configured in `app.js` and
routes in `router.js`.

The application complies with the _MVC_ model, where each route has
a corresponding _controller_ in the dir of `controllers`.
Controllers, in turn, use the models for getting and storing data.
The models centralize the operations of e.g. validation, sanitation
and storing of data (i.e., _business logic_) to one location.
Having such a structure also enables more standard testing.

As a _view_ component, the app uses _express-handlebars_;
actual views are put in the dir named `views`. It has two subdirectories:
`layouts` and `partials`.
`layouts` are whole pages, whereas `partials` are reusable smaller
snippets put in the `layouts` or other views. Views, layouts, and partials
use _handlebars_ syntax, and their extension is `.hbs`.
More information about _handlebars_ syntax can be found in: http://handlebarsjs.com/

Files such as images, _CSS_ styles, and clientside JavaScripts are under the `public` directory. When the app is run in a browser, the files are located under the`/`path, at the root of the server, so the views must refer to them using the absolute path. (For example, `<link rel =" stylesheet "href =" / css / style.css ">`) ** Note that `public` is not part of this path. **

The _mocha_ and _chai_ modules are used for testing and the tests can be found under the `test` directory.

##About coding policies

The project code aims to follow a consistent coding conventions
ensured by using the _eslint_ code validation tool. The primary purpose of the tool is to ensure that the project code follows more or less the generally accepted style of appropriate conventions, and that the code avoids known vulnerabilities and / or risky coding practices. In addition, the tool aims to standardize the appearance of code of all programmers involved in the project so that all code is easy to read and maintainable for non-original coders as well.

English is recommended for naming functions and variables and commenting on code. Git commit messages should also be written in English, but this is neither required nor monitored.

##Code style

The _eslint_ tool used is configured to require certain stylistic considerations that can reasonably be considered as opinion issues and may not necessarily be true or false. The intention is not to initiate any debate on the subject or upset anyone's mind, but to strive for uniformity in the appearance of the code, with no other motives.

This project follows the following coding styles:

-   indents with 4 spaces
-   the code block starting bracket `{` is in the same line as the block starting the function, clause or loop
-   the block terminating bracket `}` in the code block is always on its own line, except in cases where the whole block is on a single line
-   the _camelCase_ style is recommended for naming functions and variables
-   the variables should not be defined by using the `var` keyword, but the variables and constants are defined using the`let` and `const` keywords
-   each line of code ends with a semicolon `;`

You can check the style of your code by command:

`` ` npm run lint `` `

_eslint_ can also correct some code errors and style violations automatically, but you shouldn't rely on this blindly. You can do this explicitly with the command:

`` ` npm run lint:fix `` `

Naturally, it is easier to set up a code editor to monitor and correct the style during coding.

The project root directory contains the VSCode Editor configuration folder, where the appropriate settings are available for the editor. In addition, it contains plugin recommendations that VSCode will offer to install if the user so wishes. In addition, the project includes the _.editorconfig_ file, which allows you to easily import some of your settings to a number of other editors.
