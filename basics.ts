import { getModel, completeSimple } from "@mariozechner/pi-ai";

async function main() {
    // const model = getModel("anthropic", "claude-opus-4-5");
    const model = getModel("google", "gemini-2.5-flash");

    const response = await completeSimple(model, {
        systemPrompt: "You are a helpful assistant.",
        messages: [
            { role: "user", content: "What is the capital of France?", timestamp: Date.now() }
        ],
    });

    // response is an AssistantMessage
    for (const block of response.content) {
        if (block.type === "text") {
            console.log(block.text);
        }
    }

    console.log(`\nTokens: ${response.usage.totalTokens}`);
    console.log(`Stop reason: ${response.stopReason}`);
}

main();