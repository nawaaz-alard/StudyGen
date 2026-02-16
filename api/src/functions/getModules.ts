import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetchModulesFromDB } from "../services/cosmosService";

export async function getModules(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    // Try fetching from DB first
    let modules = await fetchModulesFromDB();

    // Fallback if DB is not configured or empty
    if (!modules || modules.length === 0) {
        modules = [
            { id: "math", name: "Math Quiz", authorized: true },
            { id: "afrikaans", name: "Afrikaans Quiz", authorized: true },
            { id: "lifescience", name: "Life Science Quiz", authorized: true }
        ];
    }

    return {
        body: JSON.stringify(modules),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

app.http('getModules', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getModules
});
