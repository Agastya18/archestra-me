import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import {
    MODEL_REGISTRY,
    getModelDefinition,
    getModelsByProvider,
    getNonToolCallingModels,
    getToolCallingModels,
    getUserSelectableModels,
    modelSupportsToolCalls
} from '../../../../model-registry';

const modelRoutes: FastifyPluginAsync = async (fastify) => {
    // Get all models
    fastify.get(
        '/api/models',
        {
            schema: {
                operationId: 'getAllModels',
                description: 'Get all available models with capabilities',
                tags: ['Models'],
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            models: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        provider: { type: 'string' },
                                        name: { type: 'string' },
                                        description: { type: 'string' },
                                        capabilities: {
                                            type: 'object',
                                            properties: {
                                                supportsToolCalls: { type: 'boolean' },
                                                capabilities: { type: 'object' }
                                            }
                                        },
                                        context: { type: 'string' },
                                        size: { type: 'string' },
                                        isSystemModel: { type: 'boolean' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.send({ models: MODEL_REGISTRY });
        }
    );

    // Get user-selectable models (excludes system models)
    fastify.get(
        '/api/models/user-selectable',
        {
            schema: {
                operationId: 'getUserSelectableModels',
                description: 'Get all user-selectable models (excludes system models)',
                tags: ['Models']
            }
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.send({ models: getUserSelectableModels() });
        }
    );

    // Get models by provider
    fastify.get<{ Params: { provider: string } }>(
        '/api/models/provider/:provider',
        {
            schema: {
                operationId: 'getModelsByProvider',
                description: 'Get models by provider',
                tags: ['Models'],
                params: {
                    type: 'object',
                    properties: {
                        provider: { type: 'string' }
                    },
                    required: ['provider']
                }
            }
        },
        async (request: FastifyRequest<{ Params: { provider: string } }>, reply: FastifyReply) => {
            const { provider } = request.params;
            const models = getModelsByProvider(provider as any);
            return reply.send({ models });
        }
    );

    // Get tool-calling models
    fastify.get(
        '/api/models/tool-calling',
        {
            schema: {
                operationId: 'getToolCallingModels',
                description: 'Get all models that support tool calling',
                tags: ['Models']
            }
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.send({ models: getToolCallingModels() });
        }
    );

    // Get non-tool-calling models
    fastify.get(
        '/api/models/non-tool-calling',
        {
            schema: {
                operationId: 'getNonToolCallingModels',
                description: 'Get all models that do not support tool calling',
                tags: ['Models']
            }
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.send({ models: getNonToolCallingModels() });
        }
    );

    // Get specific model by ID
    fastify.get<{ Params: { modelId: string } }>(
        '/api/models/:modelId',
        {
            schema: {
                operationId: 'getModelById',
                description: 'Get specific model by ID',
                tags: ['Models'],
                params: {
                    type: 'object',
                    properties: {
                        modelId: { type: 'string' }
                    },
                    required: ['modelId']
                }
            }
        },
        async (request: FastifyRequest<{ Params: { modelId: string } }>, reply: FastifyReply) => {
            const { modelId } = request.params;
            const model = getModelDefinition(modelId);

            if (!model) {
                return reply.code(404).send({ error: 'Model not found' });
            }

            return reply.send({ model });
        }
    );

    // Check if model supports tool calls
    fastify.get<{ Params: { modelId: string } }>(
        '/api/models/:modelId/supports-tool-calls',
        {
            schema: {
                operationId: 'checkModelToolCallSupport',
                description: 'Check if a model supports tool calls',
                tags: ['Models'],
                params: {
                    type: 'object',
                    properties: {
                        modelId: { type: 'string' }
                    },
                    required: ['modelId']
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            modelId: { type: 'string' },
                            supportsToolCalls: { type: 'boolean' }
                        }
                    }
                }
            }
        },
        async (request: FastifyRequest<{ Params: { modelId: string } }>, reply: FastifyReply) => {
            const { modelId } = request.params;
            const supportsToolCalls = modelSupportsToolCalls(modelId);

            return reply.send({
                modelId,
                supportsToolCalls
            });
        }
    );
};

export default modelRoutes;
