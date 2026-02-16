"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchModuleContent = exports.fetchModulesFromDB = void 0;
const cosmos_1 = require("@azure/cosmos");
// Connection String from Environment Variable (Set in Local.settings.json or Azure App Settings)
const CONNECTION_STRING = process.env["COSMOS_DB_CONNECTION_STRING"];
const DATABASE_ID = "StudyGenDB";
const MODULES_CONTAINER_ID = "Modules";
let client = null;
// Initialize Cosmos DB Client
function getClient() {
    if (!CONNECTION_STRING) {
        console.warn("No Cosmos DB connection string found. Using mock data.");
        return null;
    }
    if (!client) {
        client = new cosmos_1.CosmosClient(CONNECTION_STRING);
    }
    return client;
}
// Fetch all modules
function fetchModulesFromDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getClient();
        if (!client)
            return null; // Fallback to mock
        try {
            const database = client.database(DATABASE_ID);
            const container = database.container(MODULES_CONTAINER_ID);
            // Fetch only basic info (exclude heavy content)
            const querySpec = {
                query: "SELECT c.id, c.name, c.description, c.authorized FROM c"
            };
            const { resources: items } = yield container.items.query(querySpec).fetchAll();
            return items;
        }
        catch (error) {
            console.error("Error fetching modules from Cosmos DB:", error);
            return null;
        }
    });
}
exports.fetchModulesFromDB = fetchModulesFromDB;
// Fetch specific module content
function fetchModuleContent(moduleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = getClient();
        if (!client)
            return null; // Fallback to mock
        try {
            const database = client.database(DATABASE_ID);
            const container = database.container(MODULES_CONTAINER_ID);
            const { resource: item } = yield container.item(moduleId, moduleId).read();
            return item;
        }
        catch (error) {
            console.error(`Error fetching content for module ${moduleId}:`, error);
            return null;
        }
    });
}
exports.fetchModuleContent = fetchModuleContent;
//# sourceMappingURL=cosmosService.js.map