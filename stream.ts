import { getModel, streamSimple } from "@mariozechner/pi-ai";

async function main() {
    const model = getModel("google", "gemini-2.5-flash");

    const stream = streamSimple(model, {
        systemPrompt: "You are a helpful assistant.",
        messages: [
            { role: "user", content: "Explain how TCP works in 3 sentences.", timestamp: Date.now() }
        ],
    });

    // Option to await the entire response as a single message
    // const finalMessage = await stream.result();

    for await (const event of stream) {
        switch (event.type) {
            case "text_delta":
                process.stdout.write(event.delta);
                break;
            case "done":
                console.log(`\n\nTokens: ${event.message.usage.totalTokens}`);
                break;
            case "error":
                console.error("Error:", event.error.errorMessage);
                break;
        }
    }
}

main();