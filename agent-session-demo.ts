import { createAgentSession, SessionManager } from "@mariozechner/pi-coding-agent";
import { getModel, streamSimple } from "@mariozechner/pi-ai";

async function main() {
    const model = getModel("anthropic", "claude-opus-4-5");

    // createAgentSession wires everything together - model,
    // tools, session persistence, settings
    const { session } = await createAgentSession({
        model,
        thinkingLevel: "off",
        // session lives in memory & disappears when process exits
        sessionManager: SessionManager.inMemory(),
    });

    session.agent.streamFn = streamSimple;

    session.subscribe((event) => {
        if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
            process.stdout.write(event.assistantMessageEvent.delta);
        }
        if (event.type === "tool_execution_start") {
            console.log(`\n[${event.toolName}]`);
        }
    });

    await session.prompt("What files are in the current directory? Summarize the package.json.");
    console.log();

    session.dispose();
}

main();