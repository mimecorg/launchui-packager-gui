# LaunchUI Packager GUI

GUI front-end for [LaunchUI Packager](https://github.com/mimecorg/launchui-packager).

## Introduction

LaunchUI is a launcher for GUI Node.js applications using [libui-node](https://github.com/parro-it/libui-node). LaunchUI Packager is a tool for creating packages based on LaunchUI for Windows, Linux and OS X.

LaunchUI Packager GUI is a desktop application which simplifies creating LaunchUI packages without using custom scripts. It stores all package settings in a file called `lanuchui.json` in the project directory and makes it possible to build packages for the selected platform and architecture. To create the package settings file for a new project, you can select a `package.json` file.

LaunchUI Packager GUI is based on [Vuido](https://github.com/mimecorg/vuido), a framework for creating native desktop applications using Vue.js.

## Installation

Download one of the packages from the [LaunchUI Packager GUI releases](https://github.com/mimecorg/launchui-packager-gui/releases), unpack it anywhere and run the application.

## Building

Building LaunchUI Packager GUI is only necessary if you need to make some customizations.

Use the following commands to install all dependencies and build the application:

```
npm install
npm run build
```

To build LaunchUI Packager GUI on Windows, you will need the following prerequisites:

- [windows-build-tools](https://www.npmjs.com/package/windows-build-tools)
- [Visual C++ Redistributable Package for Visual Studio 2013](https://www.microsoft.com/en-us/download/details.aspx?id=40784)

To build LaunchUI Packager GUI on Linux, you will need:

- [build-essential](https://packages.ubuntu.com/xenial/build-essential)
- [GTK+3](https://packages.ubuntu.com/source/xenial/gtk+3.0)

To build LaunchUI Packager GUI on OS X, you will need:

- Xcode

Use the following command to run the application:

```
npm start
```

## License

LaunchUI Packager GUI is licensed under the MIT license

Copyright (C) 2018 Michał Męciński
