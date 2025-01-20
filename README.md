# ProductivityCLI

A CLI based task manager built using Node.js to help you manager your task from the terminal.

## Built With

**Tech used:** HTML, JavaScript, Node
**Library used in node***


Here's where you can go to town on how you actually built this thing. Write as m


## Features
- Add, remove, update, markdone and list all the task in the list
- use of a clipanel to simultaneously mark multiple task as done or undone
- sort the task based on time and alphabtically
- User - friendly command line interface with colors.

## Pre-requisites
Ensure you have the following installed on you system:
To install this application you need 

  (Node JS 16.0 or above)[https://nodejs.org/en/download/]

  To check if Node.js and npm are installed, run:
Check the current version of Node
```bash
node -v
```
Check the current versin of npm(Node Package Manager)
```bash
npm -v
```


## Installation
1. Clone the repo
```bash
git clone https://github.com/prayascittah/ProductivityCLI.git
```

2. Install project dependencies:
```bash
npm install
```

3. Set up .env
- Create a .env file in the project root:
```bash
--touch .env
```

-Add the following content inside .env
```yaml
-- FILE_PATH=./jsonfiles/todo.json
--CONFIG_PATH=./jsonfiles/config.json
```

4. Run a test to check if everything works
node --experimental-modules src/todo.mjs ---help


## Usage
1. Add a task
```bash
node --experimental-modules src/todo.mjs add <taskname> <timeRequired> <timeofday>
```

3. Remove a task
```bash
node --experimental-modules src/todo.mjs remove <taskid> <taskname>
```

5. Update a task
```bash
node --experimental-modules src/todo.mjs update <taskid> <taskname>
```

6. sortby command
```bash
node --experimental-modules src/todo.mjs sortby -a <boolean> -t <boolean>
```

3. list all task
```bash
node --experimental-modules src/todo.mjs all
```

3. CLI-Panel (Interactive ClI - Panel)
```bash
node --experimental-modules src/todo.mjs clipanel
```

7. Help
```bash
node --experimental-modules src/todo.mjs --help | -h
```


## License
This project is licensed under the [MIT License](LICENSE).
