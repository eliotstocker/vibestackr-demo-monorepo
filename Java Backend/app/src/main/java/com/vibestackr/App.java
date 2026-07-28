import io.javalin.Javalin;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Map;

public class App {
    private static final AtomicInteger counter = new AtomicInteger(0);

    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.plugins.add(new io.javalin.http.CorsHandler(cors -> {
                cors.addMappings(mapping -> {
                    mapping.addRoute(io.javalin.http.javalin.javalin.HttpMethod.GET, "/**", (ctx) -> {}); // This is not quite right for Javalin 6, let's use the correct way below
                });
            }));
        }).start(6778);

        // Correct CORS configuration for Javalin 6
        app.enableCors(config -> {
            config.addRule(io.javalin.http.javalin.javalin.HttpMethod.GET, "*", (ctx) -> {});
            config.addRule(io.javalin.http.javalin.javalin.HttpMethod.POST, "*", (ctx) -> {});
        });

        // Let's simplify CORS for local dev
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
