/**
 * Consolidated model registry with tool-calling capabilities metadata
 * This replaces the separate hardcoded registries in cloudProvider and ollama stores
 */

export interface ModelCapabilities {
    /** Whether this model supports tool/function calling */
    supportsToolCalls: boolean;
    /** Additional capabilities metadata */
    capabilities?: {
        reasoning?: boolean;
        thinking?: boolean;
        multilingual?: boolean;
        moe?: boolean; // mixture of experts
    };
}

export interface ModelDefinition {
    /** Unique model identifier */
    id: string;
    /** Provider type */
    provider: 'ollama' | 'anthropic' | 'openai' | 'deepseek' | 'gemini';
    /** Display name for the model */
    name: string;
    /** Model description */
    description?: string;
    /** Model capabilities */
    capabilities: ModelCapabilities;
    /** Model size/context information */
    context?: string;
    /** Model size in GB */
    size?: string;
    /** Whether this is a system model (not shown in user selection) */
    isSystemModel?: boolean;
}

/**
 * Consolidated model registry with tool-calling capabilities
 * Based on research and testing of different model variants
 */
export const MODEL_REGISTRY: ModelDefinition[] = [
    // Ollama Models
    {
        id: 'qwen3:0.6b',
        provider: 'ollama',
        name: 'Qwen3 0.6B',
        description: 'Qwen3 0.6B - Lightweight model with basic capabilities',
        capabilities: {
            supportsToolCalls: false, // Too small for reliable tool calling
            capabilities: { multilingual: true }
        },
        context: '40K',
        size: '523MB'
    },
    {
        id: 'qwen3:1.7b',
        provider: 'ollama',
        name: 'Qwen3 1.7B',
        description: 'Qwen3 1.7B - Small model with limited tool calling',
        capabilities: {
            supportsToolCalls: false, // Limited tool calling capability
            capabilities: { multilingual: true }
        },
        context: '40K',
        size: '1.4GB'
    },
    {
        id: 'qwen3:4b',
        provider: 'ollama',
        name: 'Qwen3 4B',
        description: 'Qwen3 4B - Medium model with basic tool calling',
        capabilities: {
            supportsToolCalls: true, // Basic tool calling support
            capabilities: { multilingual: true }
        },
        context: '40K',
        size: '2.6GB'
    },
    {
        id: 'qwen3:8b',
        provider: 'ollama',
        name: 'Qwen3 8B',
        description: 'Qwen3 8B - Good balance of performance and tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { multilingual: true, reasoning: true }
        },
        context: '40K',
        size: '5.2GB'
    },
    {
        id: 'qwen3:14b',
        provider: 'ollama',
        name: 'Qwen3 14B',
        description: 'Qwen3 14B - High performance with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { multilingual: true, reasoning: true, thinking: true }
        },
        context: '40K',
        size: '9.3GB'
    },
    {
        id: 'qwen3:30b',
        provider: 'ollama',
        name: 'Qwen3 30B',
        description: 'Qwen3 30B - High-end model with advanced capabilities',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { multilingual: true, reasoning: true, thinking: true }
        },
        context: '40K',
        size: '19GB'
    },
    {
        id: 'qwen3:32b',
        provider: 'ollama',
        name: 'Qwen3 32B',
        description: 'Qwen3 32B - High-end model with advanced capabilities',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { multilingual: true, reasoning: true, thinking: true }
        },
        context: '40K',
        size: '20GB'
    },
    {
        id: 'qwen3:235b',
        provider: 'ollama',
        name: 'Qwen3 235B',
        description: 'Qwen3 235B - Ultra-large model with MoE architecture',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { multilingual: true, reasoning: true, thinking: true, moe: true }
        },
        context: '40K',
        size: '142GB'
    },
    {
        id: 'deepseek-r1:1.5b',
        provider: 'ollama',
        name: 'DeepSeek-R1 1.5B',
        description: 'DeepSeek-R1 1.5B - Reasoning model with basic tool calling',
        capabilities: {
            supportsToolCalls: true, // Basic tool calling support
            capabilities: { reasoning: true, thinking: true }
        },
        context: '128K',
        size: '1.1GB'
    },
    {
        id: 'deepseek-r1:7b',
        provider: 'ollama',
        name: 'DeepSeek-R1 7B',
        description: 'DeepSeek-R1 7B - Reasoning model with good tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { reasoning: true, thinking: true }
        },
        context: '128K',
        size: '4.7GB'
    },
    {
        id: 'deepseek-r1:8b',
        provider: 'ollama',
        name: 'DeepSeek-R1 8B',
        description: 'DeepSeek-R1 8B - Reasoning model with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, thinking: true }
        },
        context: '128K',
        size: '5.2GB'
    },
    {
        id: 'deepseek-r1:14b',
        provider: 'ollama',
        name: 'DeepSeek-R1 14B',
        description: 'DeepSeek-R1 14B - High-performance reasoning model',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, thinking: true }
        },
        context: '128K',
        size: '9.0GB'
    },
    {
        id: 'gpt-oss:20b',
        provider: 'ollama',
        name: 'GPT-OSS 20B',
        description: 'GPT-OSS 20B - OpenAI open-weight model with function calling',
        capabilities: {
            supportsToolCalls: true, // Native function calling support
            capabilities: { reasoning: true }
        },
        context: '128K',
        size: '12GB'
    },
    {
        id: 'gpt-oss:120b',
        provider: 'ollama',
        name: 'GPT-OSS 120B',
        description: 'GPT-OSS 120B - Large OpenAI open-weight model',
        capabilities: {
            supportsToolCalls: true, // Native function calling support
            capabilities: { reasoning: true }
        },
        context: '128K',
        size: '70GB'
    },
    // System models (not shown in user selection)
    {
        id: 'llama-guard3:1b',
        provider: 'ollama',
        name: 'Llama Guard 3 1B',
        description: 'Guard model for safety checks',
        capabilities: {
            supportsToolCalls: false, // Guard model, no tool calling needed
        },
        context: '8K',
        size: '1.1GB',
        isSystemModel: true
    },
    {
        id: 'phi3:3.8b',
        provider: 'ollama',
        name: 'Phi-3 3.8B',
        description: 'General purpose model for system tasks',
        capabilities: {
            supportsToolCalls: false, // System model, no tool calling needed
        },
        context: '128K',
        size: '2.3GB',
        isSystemModel: true
    },

    // Cloud Provider Models
    {
        id: 'claude-3-5-sonnet-20241022',
        provider: 'anthropic',
        name: 'Claude 3.5 Sonnet',
        description: 'Anthropic\'s most capable model with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, multilingual: true }
        }
    },
    {
        id: 'claude-3-5-haiku-20241022',
        provider: 'anthropic',
        name: 'Claude 3.5 Haiku',
        description: 'Fast and efficient model with good tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { reasoning: true, multilingual: true }
        }
    },
    {
        id: 'claude-3-opus-20240229',
        provider: 'anthropic',
        name: 'Claude 3 Opus',
        description: 'Most capable Claude 3 model with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, multilingual: true }
        }
    },
    {
        id: 'gpt-4o',
        provider: 'openai',
        name: 'GPT-4o',
        description: 'OpenAI\'s flagship model with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, multilingual: true }
        }
    },
    {
        id: 'gpt-4-turbo',
        provider: 'openai',
        name: 'GPT-4 Turbo',
        description: 'Fast GPT-4 variant with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, multilingual: true }
        }
    },
    {
        id: 'gpt-3.5-turbo',
        provider: 'openai',
        name: 'GPT-3.5 Turbo',
        description: 'Efficient model with good tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { multilingual: true }
        }
    },
    {
        id: 'deepseek-chat',
        provider: 'deepseek',
        name: 'DeepSeek Chat',
        description: 'DeepSeek\'s chat model with good tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { reasoning: true }
        }
    },
    {
        id: 'deepseek-reasoner',
        provider: 'deepseek',
        name: 'DeepSeek Reasoner',
        description: 'DeepSeek\'s reasoning model with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, thinking: true }
        }
    },
    {
        id: 'gemini-2.5-pro',
        provider: 'gemini',
        name: 'Gemini 2.5 Pro',
        description: 'Google\'s most capable model with excellent tool calling',
        capabilities: {
            supportsToolCalls: true, // Excellent tool calling support
            capabilities: { reasoning: true, multilingual: true }
        }
    },
    {
        id: 'gemini-2.5-flash',
        provider: 'gemini',
        name: 'Gemini 2.5 Flash',
        description: 'Fast Gemini model with good tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { multilingual: true }
        }
    },
    {
        id: 'gemini-1.5-pro',
        provider: 'gemini',
        name: 'Gemini 1.5 Pro',
        description: 'Google\'s previous generation model with good tool calling',
        capabilities: {
            supportsToolCalls: true, // Good tool calling support
            capabilities: { multilingual: true }
        }
    }
];

/**
 * Get model definition by ID
 */
export function getModelDefinition(modelId: string): ModelDefinition | undefined {
    return MODEL_REGISTRY.find(model => model.id === modelId);
}

/**
 * Get all models for a specific provider
 */
export function getModelsByProvider(provider: ModelDefinition['provider']): ModelDefinition[] {
    return MODEL_REGISTRY.filter(model => model.provider === provider);
}

/**
 * Get all user-selectable models (excludes system models)
 */
export function getUserSelectableModels(): ModelDefinition[] {
    return MODEL_REGISTRY.filter(model => !model.isSystemModel);
}

/**
 * Get all models that support tool calling
 */
export function getToolCallingModels(): ModelDefinition[] {
    return MODEL_REGISTRY.filter(model => model.capabilities.supportsToolCalls);
}

/**
 * Get all models that don't support tool calling
 */
export function getNonToolCallingModels(): ModelDefinition[] {
    return MODEL_REGISTRY.filter(model => !model.capabilities.supportsToolCalls);
}

/**
 * Check if a model supports tool calling
 */
export function modelSupportsToolCalls(modelId: string): boolean {
    const model = getModelDefinition(modelId);
    return model?.capabilities.supportsToolCalls ?? false;
}
