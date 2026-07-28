package com.vibestackr;

import io.javalin.Javalin;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Map;

public class App {
    private static final AtomicInteger counter = new AtomicInteger(0);

    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            // No need for complex CORS if we use the before filter for simplicity in dev
        }).start(6778);

        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*");
            ctx.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Authorization, Content-Type, Origin, Accept, X-Requested-With");
        });

        app.get("/hello", ctx -> {
            ctx.json(Map.of("message", "Hello VibeStackR"));
        });

        app.post("/increment", ctx -> {
            int newVal = counter.incrementAndGet();
            ctx.result("Counter incremented to: " + newVal);
        });

        app.post("/reset", ctx -> {
            counter.set(0);
            ctx.result("Counter reset to 0");
        });

        // Admin only endpoints (conceptually, for this demo)
        app.post("/admin/increment", ctx -> {
            int newVal = counter.incrementAndGet();
            ctx.result("Admin incremented counter to: " + newVal);
        });

        app.post("/admin/reset", ctx -> {
            counter.set(0);
            ctx.result("Admin reset counter to 0");
        });

        app.get("/counter", ctx -> {
            ctx.json(Map.of("counter", counter.get()));
        });
    }
}
