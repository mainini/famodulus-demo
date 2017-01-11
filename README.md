# Introduction

This is a small demonstrator application for evaluating the functionality and the performance of [famodulus-client](https://github.com/mainini/famodulus-client).

For convenience, a Java based web server is provided, the application can however also be tested without or installed to a different server.

# Installation and Running

## Prerequisites

The build process assumes, that [famodulus-client](https://github.com/mainini/famodulus-client) has been checked out to the same parent
directory as this repository and that a build of it has taken place before (i.e. it will try to include resources from `../famodulus-client`).
Refer to the [installation instructions](https://github.com/mainini/famodulus-client/blob/master/README.md) of famodulus-client for details
about building it.

Alternatively, the [famodulus main repository](https://github.com/mainini/famodulus) may be checked out which already provides the correct
directory layout.

## Compiling and Running the Demo

famodulus-demo is compiled using [maven](https://maven.apache.org), which has to be installed on your system first.
Compilation is known to work using OpenJDK 1.8 and maven 3.0.5 or later.

To install, clone this repository (if you haven't already) and change to it. Then, run a clean build:

    mvn clean install

To start the server, you may simply run

    mvn exec:java

The server should now be running on its default port, check by connecting to [http://localhost:8080/](http://localhost:8080/) .

Logging occurs through java.util.logging, you can thus increase logging verbosity by adjusting the levels for `ch.mainini.famodulus` and
`org.glassfish.grizzly` according to your preferences.

### Change Listening Port

The port on which famodulus-server is listening can be changed using the system property `famodulus.base` which
has to be a URI for the base of the server. For instance, to change the port to 80, the server can be started as follows:

    MAVEN_OPTS='-Dfamodulus.base=http://localhost:80/' mvn exec:java

## Using without or with different Server

The build process copies all files from `../famodulus-client/.build` to `target/classes/ch/mainini/famodulus/demo/`.
To deploy the demonstrator app to a different server, simply copy the `target/classes/ch/mainini/famodulus/demo` directory after
compilation to your webserver.

The same result can also be achieved without using maven or if access without any webserver is desired. For this case, however,
contents from `../famodulus-client/.build` have to be manually copied to `src/main/resources/ch/mainini/famodulus/demo`
which can then be directly accessed or used further.