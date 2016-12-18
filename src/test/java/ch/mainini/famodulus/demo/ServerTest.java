/*
 * Copyright 2016 Pascal Mainini
 * Licensed under MIT license, see included file LICENSE or
 * http://opensource.org/licenses/MIT
 */
package ch.mainini.famodulus.demo;

import java.io.InputStream;
import java.util.Scanner;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import org.glassfish.grizzly.http.server.HttpServer;
import org.junit.AfterClass;
import static org.junit.Assert.assertEquals;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * Unit test for Server
 * @author Pascal Mainini
 */
public class ServerTest {
//////////////////////////////////////// Constants

    private static final int HTTP_NOT_FOUND = 404;

//////////////////////////////////////// Fields

    private static HttpServer server;
    private static WebTarget target;


//////////////////////////////////////// Methods

    /**
     * Pre-test setup
     * @throws Exception in case of trouble
     */
    @BeforeClass
    public static void setUp() throws Exception {
        server = Server.startServer();

        final Client c = ClientBuilder.newClient();
        target = c.target(Server.DEFAULT_BASE_URI);
    }

    /**
     * After-test cleanup
     * @throws Exception in case of trouble
     */
    @AfterClass
    public static void tearDown() throws Exception {
        server.shutdownNow();
    }

    /**
     * Runs a HTTP GET / to see if we obtain index.html
     */
    @Test
    public void getRoot() {
        final InputStream is = Server.class.getResourceAsStream("index.html");
        final Scanner s = new java.util.Scanner(is).useDelimiter("\\A");

        assertEquals(s.next(), target.request().get(String.class));
    }

    /**
     * Tries to access classes via webserver, should return 404.
     */
    @Test
    public void getClasses() {
        assertEquals(HTTP_NOT_FOUND, target.path("/ch/mainini/famodulus/demo/Server.class").request().get().getStatus());
    }
}