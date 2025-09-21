import { create } from 'zustand';

export interface ModelDefinition {
    id: string;
    provider: 'ollama' | 'anthropic' | 'openai' | 'deepseek' | 'gemini';
    name: string;
    description?: string;
    capabilities: {
        supportsToolCalls: boolean;
        capabilities?: {
            reasoning?: boolean;
            thinking?: boolean;
            multilingual?: boolean;
            moe?: boolean;
        };
    };
    context?: string;
    size?: string;
    isSystemModel?: boolean;
}

interface ModelRegistryState {
    models: ModelDefinition[];
    loading: boolean;
    error: Error | null;
}

interface ModelRegistryActions {
    fetchModels: () => Promise<void>;
    getModelById: (modelId: string) => ModelDefinition | undefined;
    getModelsByProvider: (provider: ModelDefinition['provider']) => ModelDefinition[];
    getUserSelectableModels: () => ModelDefinition[];
    getToolCallingModels: () => ModelDefinition[];
    getNonToolCallingModels: () => ModelDefinition[];
    modelSupportsToolCalls: (modelId: string) => boolean;
}

type ModelRegistryStore = ModelRegistryState & ModelRegistryActions;

export const useModelRegistryStore = create<ModelRegistryStore>((set, get) => ({
    models: [],
    loading: false,
    error: null,

    fetchModels: async () => {
        set({ loading: true, error: null });

        try {
            const response = await fetch('/api/models');
            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.statusText}`);
            }

            const data = await response.json();
            set({ models: data.models, loading: false });
        } catch (error) {
            console.error('Failed to fetch models:', error);
            set({
                error: error instanceof Error ? error : new Error('Failed to fetch models'),
                loading: false
            });
        }
    },

    getModelById: (modelId: string) => {
        const { models } = get();
        return models.find(model => model.id === modelId);
    },

    getModelsByProvider: (provider: ModelDefinition['provider']) => {
        const { models } = get();
        return models.filter(model => model.provider === provider);
    },

    getUserSelectableModels: () => {
        const { models } = get();
        return models.filter(model => !model.isSystemModel);
    },

    getToolCallingModels: () => {
        const { models } = get();
        return models.filter(model => model.capabilities.supportsToolCalls);
    },

    getNonToolCallingModels: () => {
        const { models } = get();
        return models.filter(model => !model.capabilities.supportsToolCalls);
    },

    modelSupportsToolCalls: (modelId: string) => {
        const { models } = get();
        const model = models.find(model => model.id === modelId);
        return model?.capabilities.supportsToolCalls ?? false;
    }
}));

// Initialize the store on app start
useModelRegistryStore.getState().fetchModels();
