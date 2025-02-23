# Langflow-DOC-QA-SERVER
![](https://badge.mcpx.dev?type=server 'MCP Server')

A Model Context Protocol server for document Q&A powered by Langflow

This is a TypeScript-based MCP server that implements a document Q&A system. It demonstrates core MCP concepts by providing a simple interface to query documents through a Langflow backend.

## Prerequisites

### 1. Create Langflow Document Q&A Flow
1. Open Langflow and create a new flow from the "Document Q&A" template
2. Configure your flow with necessary components (ChatInput, File Upload, LLM, etc.)
3. Save your flow

### 2. Get Flow API Endpoint
1. Click the "API" button in the top right corner of Langflow
2. Copy the API endpoint URL from the cURL command
   Example: `http://127.0.0.1:7860/api/v1/run/<flow-id>?stream=false`
3. Save this URL as it will be needed for the `API_ENDPOINT` configuration

## Features

### Tools
- `query_docs` - Query the document Q&A system
  - Takes a query string as input
  - Returns responses from the Langflow backend

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "langflow-doc-qa-server": {
      "command": "node",
      "args": [
        "/path/to/doc-qa-server/build/index.js"
      ],
      "env": {
        "API_ENDPOINT": "http://127.0.0.1:7860/api/v1/run/480ec7b3-29d2-4caa-b03b-e74118f35fac"
      }
    }
  }
}
```

### Environment Variables

The server supports the following environment variables for configuration:

- `API_ENDPOINT`: The endpoint URL for the Langflow API service. Defaults to `http://127.0.0.1:7860/api/v1/run/480ec7b3-29d2-4caa-b03b-e74118f35fac` if not specified.

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## 📜 License

This project is licensed under the MIT License.