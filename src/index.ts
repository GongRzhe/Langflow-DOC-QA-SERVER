#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

interface QueryResponse {
  outputs: Array<{
    outputs: Array<{
      results: {
        message: {
          text: string;
        };
      };
    }>;
  }>;
}

class DocQAServer {
  private server: Server;
  private readonly apiEndpoint = process.env.API_ENDPOINT || 'http://127.0.0.1:7860/api/v1/run/480ec7b3-29d2-4caa-b03b-e74118f35fac';

  constructor() {
    this.server = new Server(
      {
        name: 'doc-qa-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'query_docs',
          description: 'Query the document Q&A system with a prompt',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The query prompt to search for in the documents',
              },
            },
            required: ['query'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'query_docs') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      const { query } = request.params.arguments as { query: string };

      try {
        const response = await axios.post<QueryResponse>(
          this.apiEndpoint,
          {
            input_value: query,
            output_type: 'chat',
            input_type: 'chat',
            tweaks: {
              'ChatInput-Jrzyb': {},
              'ChatOutput-rzoZb': {},
              'ParseData-hzL7Q': {},
              'File-2Teuj': {},
              'Prompt-ktajI': {},
              'MistralModel-aLZcw': {}
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              stream: false,
            },
          }
        );

        const result = response.data.outputs[0].outputs[0].results.message.text;

        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `API request failed: ${error.message}`
          );
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Document Q&A MCP server running on stdio');
  }
}

const server = new DocQAServer();
server.run().catch(console.error);
