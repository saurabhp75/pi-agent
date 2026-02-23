import { Type } from "@mariozechner/pi-ai";
import type { AgentTool } from "@mariozechner/pi-agent-core";
import * as fs from "fs";

// Tools use TypeBox(https://github.com/sinclairzx81/typebox)
// schemas for type-safe parameter definitions
const weatherParams = Type.Object({
    city: Type.String({ description: "City name" }),
});

const readFileParams = Type.Object({
    path: Type.String({ description: "Path to the file" }),
});

const listFilesParams = Type.Object({
    path: Type.String({ description: "Directory path", default: "." }),
});

export const weatherTool: AgentTool<typeof weatherParams> = {
    name: "get_weather",
    label: "Weather",
    description: "Get the current weather for a city",
    parameters: weatherParams,
    // onUpdate callback lets you stream partial results during 
    // execution - useful for long-running tools like bash commands
    execute: async (toolCallId, params, signal, onUpdate) => {
        // params is typed: { city: string }
        const temp = Math.round(Math.random() * 30);
        return {
            content: [{ type: "text", text: `${params.city}: ${temp}C, partly cloudy` }],
            details: { temp, city: params.city },
        };
    },
};

export const readFileTool: AgentTool<typeof readFileParams> = {
    name: "read_file",
    label: "Read File",
    description: "Read the contents of a file",
    parameters: readFileParams,
    execute: async (_id, params) => {
        try {
            const content = fs.readFileSync(params.path, "utf-8");
            return {
                content: [{ type: "text", text: content }],
                details: {},
            };
        } catch (err: any) {
            return {
                content: [{ type: "text", text: `Error: ${err.message}` }],
                details: {},
            };
        }
    },
};


export const listFilesTool: AgentTool<typeof listFilesParams> = {
    name: "list_files",
    label: "List Files",
    description: "List files in a directory",
    parameters: listFilesParams,
    execute: async (_id, params) => {
        const files = fs.readdirSync(params.path);
        return {
            content: [{ type: "text", text: files.join("\n") }],
            details: { count: files.length },
        };
    },
};