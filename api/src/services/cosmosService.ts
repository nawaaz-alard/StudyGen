import { CosmosClient } from "@azure/cosmos";

// Connection String from Environment Variable (Set in Local.settings.json or Azure App Settings)
const CONNECTION_STRING = process.env["COSMOS_DB_CONNECTION_STRING"];
const DATABASE_ID = "StudyGenDB";
const MODULES_CONTAINER_ID = "Modules";

let client: CosmosClient | null = null;

// Initialize Cosmos DB Client
function getClient(): CosmosClient | null {
    if (!CONNECTION_STRING) {
        console.warn("No Cosmos DB connection string found. Using mock data.");
        return null;
    }
    if (!client) {
        client = new CosmosClient(CONNECTION_STRING);
    }
    return client;
}

// Fetch all modules
export async function fetchModulesFromDB() {
    const client = getClient();
    if (!client) return null; // Fallback to mock

    try {
        const database = client.database(DATABASE_ID);
        const container = database.container(MODULES_CONTAINER_ID);

        // Fetch only basic info (exclude heavy content)
        const querySpec = {
            query: "SELECT c.id, c.name, c.description, c.authorized FROM c"
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();
        return items;
    } catch (error) {
        console.error("Error fetching modules from Cosmos DB:", error);
        return null;
    }
}

// Fetch specific module content
export async function fetchModuleContent(moduleId: string) {
    const client = getClient();
    if (!client) return null; // Fallback to mock

    try {
        const database = client.database(DATABASE_ID);
        const container = database.container(MODULES_CONTAINER_ID);

        const { resource: item } = await container.item(moduleId, moduleId).read();
        return item;
    } catch (error) {
        console.error(`Error fetching content for module ${moduleId}:`, error);
        return null;
    }
}
