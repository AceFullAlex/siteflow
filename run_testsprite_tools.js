import { initialization, codeAnalyze, generateStandardPRD, generateFrontendTestPlan, generateCodeAndExecuteMCP } from '/Users/alextalpig/.npm/_npx/8ddf6bea01b2519d/node_modules/@testsprite/testsprite-mcp/dist/index.js';

// Setup environment
process.env.API_KEY = "sk-user-0b4OpXBiT3dIpfgdFuJQhxz02e6HSXPFhoanr2ugC1bHQvFqUYyiRWOyt7beRmEz892yQS9kVgrTB5LmUPMh4WHY6FyKJO7-yKtMiR2J_f1TcNhoKYKDwDSNyQ9bX-WQS-Y";
const projectPath = "/Users/alextalpig/Documents/LOGISTICS/siteflow";

async function runTestSpriteInternals() {
    try {
        console.log("1. Running initialization (bootstrap)...");
        await initialization({ projectPath, localPort: 3000, type: "frontend", testScope: "codebase", pathname: "" });

        console.log("2. Generating code summary...");
        await codeAnalyze({ projectRootPath: projectPath });

        console.log("3. Generating standard PRD...");
        await generateStandardPRD({ projectPath });

        console.log("4. Generating frontend test plan...");
        await generateFrontendTestPlan({ projectPath, needLogin: true });

        console.log("5. Generating code and executing...");
        await generateCodeAndExecuteMCP({ projectName: "siteflow", projectPath, testIds: [], additionalInstruction: "", serverMode: "development" });

        console.log("🎉 TestSprite internal execution completed successfully!");
    } catch (err) {
        console.error("TestSprite manual execution failed:", err);
    }
}

runTestSpriteInternals();
