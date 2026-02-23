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


// Subscribe to events to see what the agent is doing
/* full event list:
agent_start
agent_end
turn_start
turn_end
message_start
message_update
message_end
tool_execution_start
tool_execution_update
tool_execution_end
*/
// agent.subscribe((event) => {
//     switch (event.type) {
//         case "agent_start":
//             console.log("Agent started");
//             break;

//         case "message_update":
//             // Streaming text from the LLM
//             if (event.assistantMessageEvent.type === "text_delta") {
//                 process.stdout.write(event.assistantMessageEvent.delta);
//             }
//             break;

//         case "tool_execution_start":
//             console.log(`\nTool: ${event.toolName}(${JSON.stringify(event.args)})`);
//             break;

//         case "tool_execution_end":
//             console.log(`Result: ${event.isError ? "ERROR" : "OK"}`);
//             break;

//         case "agent_end":
//             console.log("\nAgent finished");
//             break;
//     }
// });


/* 

// steering and follow-ups 

// Interrupt: delivered after the current tool finishes.
// Remaining pending tools are skipped.
agent.steer({
  role: "user",
  content: "Actually, skip that and read tsconfig.json instead.",
  timestamp: Date.now(),
});

// Follow-up: queued for after the agent finishes naturally.
// Doesn't interrupt current work.
agent.followUp({
  role: "user",
  content: "Now summarize what you found.",
  timestamp: Date.now(),
});


// state managment: you can change the agent's state 
// during execution. See below for examples

agent.setModel(getModel("openai", "gpt-4o"));  // Switch providers mid-session
agent.setThinkingLevel("high");                // Enable extended thinking
agent.setSystemPrompt("New instructions.");    // Update the system prompt
agent.setTools([...newTools]);                 // Swap the tool set
agent.replaceMessages(trimmedMessages);        // Replace conversation history

*/