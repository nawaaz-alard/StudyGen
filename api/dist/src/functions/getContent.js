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
exports.getContent = void 0;
const functions_1 = require("@azure/functions");
const cosmosService_1 = require("../services/cosmosService");
function getContent(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const moduleId = request.query.get('moduleId');
        context.log(`Http function processed request for content of module "${moduleId}"`);
        // Try fetching from DB
        let content = null;
        if (moduleId) {
            content = yield (0, cosmosService_1.fetchModuleContent)(moduleId);
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
    });
}
exports.getContent = getContent;
;
functions_1.app.http('getContent', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getContent
});
//# sourceMappingURL=getContent.js.map