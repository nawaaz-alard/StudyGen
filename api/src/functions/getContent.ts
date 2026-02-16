import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetchModuleContent } from "../services/cosmosService";

export async function getContent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const moduleId = request.query.get('moduleId');
    context.log(`Http function processed request for content of module "${moduleId}"`);

    // Try fetching from DB
    let content = null;
    if (moduleId) {
        content = await fetchModuleContent(moduleId);
    }

    if (!content) {
        // Mock fallback so the user sees something locally
        content = {
            moduleId: moduleId,
            sections: [
                { title: "Introduction", content: `This is the introduction to ${moduleId} (Mock Data)` },
                { title: "Chapter 1", content: "Content for chapter 1..." },
                { title: "Assessment", content: "Quiz data..." }
            ]
        };
    }

    return {
        body: JSON.stringify(content),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

app.http('getContent', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getContent
});
