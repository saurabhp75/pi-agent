import { Agent } from "@mariozechner/pi-agent-core";
import { getModel, streamSimple } from "@mariozechner/pi-ai";
import { listFilesTool, readFileTool } from "./agent-tool";


async function main() {
    const model = getModel("google", "gemini-2.5-flash");

    const agent = new Agent({
        initialState: {
            systemPrompt: "You can read files and list directories. Be concise.",
            model,
            tools: [readFileTool, listFilesTool],
            thinkingLevel: "off",
        },
        streamFn: streamSimple,
    });

    agent.subscribe((event) => {
        if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
            process.stdout.write(event.assistantMessageEvent.delta);
        }
        if (event.type === "tool_execution_start") {
            console.log(`\n[${event.toolName}] ${JSON.stringify(event.args)}`);
        }
    });

    await agent.prompt("What files are in the current directory? Read the package.json if it exists.");
    console.log();
}

main();