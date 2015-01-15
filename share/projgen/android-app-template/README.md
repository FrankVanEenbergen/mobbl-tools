# Android MOBBL Shared Resources Sample

This is a sample project that demonstrates the use of Android MOBBL with external resources through maven.

## Usage

First make sure you have installed the resources project into your maven repository. The resources project is located in `../itude-mobile-resources-shared-resource-sample`. When you have installed the resources project into your maven repository you should run:

    $ cd itude-mobile-android-shared-resources-sample
    $ mvn clean install

in order to build the Android project. The resources will be located in the new `target` folder. The `assets` folder contains a symbolic link to the resources folder inside `target`, the symbolic link can only be considered valid following a successful execution of `mvn clean install`. Lastly, open up eclipse and run the app in your emulator or device. Happy coding!



## Contribute

If you find a bug or have a new feature you want to add, just create a pull request and submit it to us. You can also [file an issue](https://github.com/ItudeMobile/itude-mobile-samples/issues/new).

Please note, if you have a pull request, make sure to use the [develop branch](https://github.com/ItudeMobile/itude-mobile-samples/tree/develop) as your base.

#### Formatting

For contributors using Eclipse there's a [formatter](http://mobbl.org/downloads/code-format.xml) available.

## License
The code in this project is licensed under the Apache Software License 2.0, per the terms of the included LICENSE file.
