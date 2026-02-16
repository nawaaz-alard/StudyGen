"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
require("./functions/getModules");
require("./functions/getContent");
// Optional: Any global app setup
functions_1.app.setup({
    enableHttpStream: true,
});
//# sourceMappingURL=index.js.map