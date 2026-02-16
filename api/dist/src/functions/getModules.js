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
exports.getModules = void 0;
const functions_1 = require("@azure/functions");
const cosmosService_1 = require("../services/cosmosService");
function getModules(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log(`Http function processed request for url "${request.url}"`);
        // Try fetching from DB first
        let modules = yield (0, cosmosService_1.fetchModulesFromDB)();
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
    });
}
exports.getModules = getModules;
;
functions_1.app.http('getModules', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getModules
});
//# sourceMappingURL=getModules.js.map