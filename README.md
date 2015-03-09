# mobbl-tools
Tools to aid in MOBBL development

# Installing
Installing the MOBBL-tools is quite easy:
* Make sure you've installed [node.js](http://nodejs.org)
* Clone this git repository
* Go to the just downloaded repository, and install using:

  npm install -g

(Once the tool has gotten more stable, it will be published to the npm repository)

# Usage
The MOBBL-tool currently supports three commands:

* `mobbl create project` creates a new project
* `mobbl generate mobbl.conf` creates a mobbl.conf file in the current project that specifies meta-information for this tool to use
* `mobbl generate docdef` generates a new Document Definition, optionally based on an existing file

## Create project
By using the `mobbl create project` command, the interactive project generator is started.

Example run:

  $ cd /path/to/folder
  $ mobbl-generator
  prompt: Which platform do you want to generate a project for?
  1. iOS
  2. Android
  3. iOS & Android
  :  (1) 3
  prompt: Project name (* will be substituted with ios or android):  my-new-*-project
  prompt: The display name of the app:  My New App
  prompt: Bundle Identifier / Package name:  my.new.app
  prompt: At what location should the project directories be created? (Current directory is /path/to/folder):  (.) relative/path/to/other/folder
  prompt: Class prefix:  MOB

This will create two project folders named `my-new-ios-project` and `my-new-android-project` in the directory `/path/to/folder/relative/path/to/other/folder`. It is also possible to enter an absolute path (in which case the current directory is not used). The directory has to exist.

**NOTE:**  
If you're having trouble inputting text because of a cursor jumping around your terminal: Make your terminal window wider, this will fix the problem. We're working on a better solution in the mean time.

## Generate mobbl.conf
The mobbl.conf file is used by this tool to figure out where your application stores all its files. While the mobbl-tool can try to figure this out by itself, it makes assumptions about the locations that may not correspond with your directory structure. The mobbl.conf file can be used to override these assumptions.

By using the `mobbl generate mobbl.conf`-command a mobbl.conf file is generated that explicitely states the assumptions made by the tool, which can then be modified if needed.

## Generate document definition
The `mobbl generate docdef`-command generates a document definition for use in your MOBBL-program. It takes the following options:

* `<name>` the name of the resulting document. The definition will be written to a file with the same name, but with the `.xml` suffix, in the projects document defition directory.
* `-f, --from <file>` reads the corresponding file and tries to create a sensible definition that can be used to parse said file. Currently, only JSON-files are supported.
* `-d, --datahandler <name>`  uses the specified datahandler. Default: MBMemoryDataHandler
* `-n, --noautocreate` sets the autocreate-attribute to false

## Generate wrapper classes for documents
The `mobbl generate wrappers`-command generates wrapper classes for your documents based on your existing document definitions.

Options:  

* `-c, --config <config>`: Determines the path to the mobbl config directory
* `-o, --output <output>`: Determines where the generated classes are placed
* `-L, --language <java|swift>`: Target language (only java or swift)
* `-p, --package <package>`: When targeting Java, you also need to set a package

