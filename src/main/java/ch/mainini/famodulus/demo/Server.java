/*
 * Copyright 2016 Pascal Mainini
 * Licensed under MIT license, see included file LICENSE or
 * http://opensource.org/licenses/MIT
 */
package ch.mainini.famodulus.demo;

import java.io.IOException;
import java.net.URI;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.glassfish.grizzly.http.server.CLStaticHttpHandler;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;

/**
 * Main class, starts the server and loads the handler for static content.
 * @author Pascal Mainini
 */
public class Server {

//////////////////////////////////////// Constants

    /**
     * Default base URI on which the server listens
     */
    public static final String DEFAULT_BASE_URI = "http://localhost:8080/";

    /**
     * Enables/disables file caching for the static handler. If disabled,
     * changes to static content can be made at runtime which is useful for
     * development and demonstration purposes.
     */
    private static final boolean ENABLE_CACHING = false;

    private static final Logger LOG = Logger.getLogger(Server.class.getName());


//////////////////////////////////////// Methods

    /**
     * Main method, starts the server.
     * @param args Arguments given by the JVM
     * @throws IOException In case something went wrong
     */
    public static void main(String[] args) throws IOException {
        LOG.info("Configuring and starting famodulus-demo webserver...");
        final String base = System.getProperty("famodulus.base", DEFAULT_BASE_URI);
        final HttpServer server = startServer(base);
        LOG.info(String.format("Webserver running at %s !", base));

        LOG.info("Hit enter to stop it...");
        System.in.read();

        server.shutdownNow();
    }

    /**
     * Starts the Grizzly HTTP server for serving static content at DEFAULT_BASE_URI.
     *
     * @return The running Grizzly HTTP server.
     */
    public static HttpServer startServer() {
        return startServer(DEFAULT_BASE_URI);
    }

    /**
     * Starts the Grizzly HTTP server for serving static content at the given URI.
     * @param uri Full URI to start the server at
     * @return Grizzly HTTP server.
     */
    public static HttpServer startServer(String uri) {
        LOG.fine("Creating server...");
        final HttpServer httpServer = GrizzlyHttpServerFactory.createHttpServer(URI.create(uri));

        LOG.log(Level.FINE, "Setting up handler for static content (file caching: {0})...", ENABLE_CACHING);
        final CLStaticHttpHandler staticHandler = new CLStaticHttpHandler(Server.class.getClassLoader(), "ch/mainini/famodulus/demo/");
        staticHandler.setFileCacheEnabled(ENABLE_CACHING);
        httpServer.getServerConfiguration().addHttpHandler(staticHandler, "/");

        return httpServer;
    }
}