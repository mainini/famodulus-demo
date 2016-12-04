/*
 * Copyright 2016 Pascal Mainini
 * Licensed under MIT license, see included file LICENSE or
 * http://opensource.org/licenses/MIT
 */
package ch.mainini.famodulus.demo;

import java.io.IOException;
import java.net.URI;
import java.util.logging.Logger;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;

/**
 * Main class, starts the server and loads the handler for static content.
 * @author Pascal Mainini
 */
public class Server {

//////////////////////////////////////// Constants

    /**
     * Base URI on which the server listens
     * @todo make configurable
     */
    public static final String BASE_URI = "http://localhost:8080/";

    private static final Logger LOG = Logger.getLogger(Server.class.getName());


//////////////////////////////////////// Methods

    /**
     * Main method, starts the server.
     * @param args Arguments given by the JVM
     * @throws IOException In case something went wrong
     */
    public static void main(String[] args) throws IOException {
        LOG.info("Configuring and starting famodulus-demo webserver...");
        final HttpServer server = startServer();
        LOG.info(String.format("Webserver running at %s !", BASE_URI));

        LOG.info("Hit enter to stop it...");
        System.in.read();

        server.shutdownNow();
    }

    /**
     * Starts the Grizzly HTTP server exposing JAX-RS resources defined in this application.
     * @return Grizzly HTTP server.
     */
    public static HttpServer startServer() {
        LOG.fine("Setting up handler for static content...");
        final HttpServer httpServer = GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI));
        httpServer.getServerConfiguration().addHttpHandler(new CustomStaticHttpHandler(), "/");

        return httpServer;
    }
}