import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { FastifyPluginAsync } from 'fastify';
import { streamableHttp } from 'fastify-mcp';
import { z } from 'zod';

import McpServerModel from '@backend/models/mcpServer';
import MemoryModel from '@backend/models/memory';
import websocketService from '@backend/websocket';

export const createArchestraMcpServer = () => {
  const archestraMcpServer = new McpServer({
    name: 'archestra-server',
    version: '1.0.0',
  });

  archestraMcpServer.tool('list_installed_mcp_servers', 'List all installed MCP servers', async () => {
    try {
      const servers = await McpServerModel.getInstalledMcpServers();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(servers, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      };
    }
  });

  archestraMcpServer.tool('install_mcp_server', 'Install an MCP server', { id: z.string() }, async ({ id }) => {
    try {
      const server = await McpServerModel.getById(id);
      if (!server) {
        return {
          content: [
            {
              type: 'text',
              text: `MCP server with id ${id} not found`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(server, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      };
    }
  });

  archestraMcpServer.tool('uninstall_mcp_server', 'Uninstall an MCP server', { id: z.string() }, async ({ id }) => {
    try {
      await McpServerModel.uninstallMcpServer(id);

      return {
        content: [
          {
            type: 'text',
            text: `MCP server with id ${id} uninstalled`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      };
    }
  });

  // Memory CRUD tools
  archestraMcpServer.tool('list_memories', 'List all stored memory entries with their names and values', async () => {
    try {
      const memories = await MemoryModel.getAllMemories();
      if (memories.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No memories stored yet.',
            },
          ],
        };
      }

      const formatted = memories.map((m) => `${m.name}: ${m.value}`).join('\n');
      return {
        content: [
          {
            type: 'text',
            text: formatted,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error listing memories: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
      };
    }
  });

  archestraMcpServer.tool(
    'get_memory',
    'Get a specific memory value by its name',
    { name: z.string().describe('The name of the memory to retrieve') },
    async ({ name }) => {
      try {
        const memory = await MemoryModel.getMemory(name);
        if (!memory) {
          return {
            content: [
              {
                type: 'text',
                text: `Memory "${name}" not found.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: memory.value,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving memory "${name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }
  );

  archestraMcpServer.tool(
    'set_memory',
    'Set or update a memory entry with a specific name and value',
    {
      name: z.string().describe('The name/key for the memory entry'),
      value: z.string().describe('The value/content to store'),
    },
    async ({ name, value }) => {
      try {
        // Validation
        if (!name || !name.trim()) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: "name" parameter is required and cannot be empty',
              },
            ],
          };
        }

        if (value === undefined || value === null) {
          return {
            content: [
              {
                type: 'text',
                text: 'Error: "value" parameter is required',
              },
            ],
          };
        }

        const memory = await MemoryModel.setMemory(name.trim(), value);

        // Emit WebSocket event for memory update
        const memories = await MemoryModel.getAllMemories();
        websocketService.broadcast({
          type: 'memory-updated',
          payload: { memories },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Memory "${memory.name}" has been ${memory.createdAt === memory.updatedAt ? 'created' : 'updated'}.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error setting memory: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }
  );

  archestraMcpServer.tool(
    'delete_memory',
    'Delete a specific memory entry by name',
    { name: z.string().describe('The name of the memory to delete') },
    async ({ name }) => {
      try {
        const deleted = await MemoryModel.deleteMemory(name);

        if (!deleted) {
          return {
            content: [
              {
                type: 'text',
                text: `Memory "${name}" not found.`,
              },
            ],
          };
        }

        // Emit WebSocket event for memory update
        const memories = await MemoryModel.getAllMemories();
        websocketService.broadcast({
          type: 'memory-updated',
          payload: { memories },
        });

        return {
          content: [
            {
              type: 'text',
              text: `Memory "${name}" has been deleted.`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting memory: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }
  );

  archestraMcpServer.tool(
    'search_mcp_servers',
    'Search for MCP servers in the catalog',
    {
      query: z.string().optional().describe('Search query to find specific MCP servers'),
      category: z.string().optional().describe('Filter by category (e.g., "ai", "data", "productivity")'),
      limit: z.number().int().positive().default(10).optional().describe('Number of results to return'),
    },
    async ({ query, category, limit }) => {
      try {
        // Search the catalog
        const catalogUrl = process.env.ARCHESTRA_CATALOG_URL || 'https://www.archestra.ai/mcp-catalog/api';

        const queryParams = new URLSearchParams();
        if (query) queryParams.append('q', query);
        if (category) queryParams.append('category', category);
        if (limit) queryParams.append('limit', limit.toString());

        const url = `${catalogUrl}/search?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Archestra-Desktop/1.0',
          },
        });

        if (!response.ok) {
          throw new Error(`Catalog API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const servers = data.servers || [];

        if (servers.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No MCP servers found matching your search criteria.',
              },
            ],
          };
        }

        // Format the results
        const formattedResults = servers
          .map((server: any) => {
            const parts = [
              `**${server.display_name}** (${server.name})`,
              server.description,
              `Category: ${server.category}`,
            ];

            if (server.tags && server.tags.length > 0) {
              parts.push(`Tags: ${server.tags.join(', ')}`);
            }

            if (server.author) {
              parts.push(`Author: ${server.author}`);
            }

            return parts.join('\n');
          })
          .join('\n\n---\n\n');

        const resultText = `Found ${servers.length} MCP server${servers.length === 1 ? '' : 's'}${data.totalCount > servers.length ? ` (showing first ${servers.length} of ${data.totalCount} total)` : ''}:\n\n${formattedResults}`;

        return {
          content: [
            {
              type: 'text',
              text: resultText,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error searching MCP servers: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }
  );

  return archestraMcpServer.server;
};

const archestraMcpServerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(streamableHttp, {
    stateful: false,
    mcpEndpoint: '/mcp',
    createServer: createArchestraMcpServer,
  });

  fastify.log.info(`Archestra MCP server plugin registered`);
};

export default archestraMcpServerPlugin;
