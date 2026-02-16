import { app } from "@azure/functions";
import "./functions/getModules";
import "./functions/getContent";

// Optional: Any global app setup
app.setup({
    enableHttpStream: true,
});
