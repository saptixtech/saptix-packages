/**
 * Saptix AI Gateway Universal Client SDK
 * Standard interface for all Saptix stakes to route LLM queries through gate.saptix.tech / 9Router
 */

export interface AiGatewayConfig {
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
  timeoutMs?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
}

export interface ChatCompletionRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AiModelItem {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export interface AiModelListResponse {
  object: string;
  data: AiModelItem[];
}

export function resolveAiGatewayConfig(custom?: Partial<AiGatewayConfig>): Required<AiGatewayConfig> {
  const isServer = typeof window === 'undefined';
  
  // Base URL resolution order:
  // 1. Explicit argument
  // 2. Server internal URL (high performance loopback on VPS)
  // 3. Server external URL
  // 4. Client-side Next.js public URL
  // 5. Default production gateway URL
  const baseUrl =
    custom?.baseUrl ||
    (isServer && process.env.AI_GATEWAY_INTERNAL_URL) ||
    (isServer && process.env.AI_GATEWAY_URL) ||
    (isServer && process.env.OPENAI_BASE_URL) ||
    process.env.NEXT_PUBLIC_AI_GATEWAY_URL ||
    'https://gate.saptix.tech/v1';

  // API Key resolution order:
  const apiKey =
    custom?.apiKey ||
    (isServer && process.env.AI_GATEWAY_API_KEY) ||
    (isServer && process.env.OPENAI_API_KEY) ||
    'sk-saptix-ai-gateway-universal';

  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiKey,
    defaultModel: custom?.defaultModel || 'Saptix-AI-free',
    timeoutMs: custom?.timeoutMs || 30000,
  };
}

/**
 * Health check probe for Saptix AI Gateway
 */
export async function checkAiGatewayHealth(config?: Partial<AiGatewayConfig>): Promise<{ ok: boolean; status: number; message?: string }> {
  const cfg = resolveAiGatewayConfig(config);
  const healthUrl = cfg.baseUrl.endsWith('/v1') 
    ? cfg.baseUrl.replace(/\/v1$/, '/api/health') 
    : `${cfg.baseUrl}/api/health`;

  try {
    const res = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, status: res.status };
  } catch (err: any) {
    return { ok: false, status: 0, message: err?.message || 'Connection failed' };
  }
}

/**
 * List all available models from AI Gateway
 */
export async function listAiGatewayModels(config?: Partial<AiGatewayConfig>): Promise<AiModelItem[]> {
  const cfg = resolveAiGatewayConfig(config);
  const url = `${cfg.baseUrl}/models`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${cfg.apiKey}`,
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(cfg.timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`AI Gateway models query failed with HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as AiModelListResponse;
  return data.data || [];
}

/**
 * Execute standard chat completion via AI Gateway
 */
export async function createAiGatewayCompletion(
  req: ChatCompletionRequest,
  config?: Partial<AiGatewayConfig>
): Promise<ChatCompletionResponse> {
  const cfg = resolveAiGatewayConfig(config);
  const url = `${cfg.baseUrl}/chat/completions`;

  const payload = {
    model: req.model || cfg.defaultModel,
    messages: req.messages,
    temperature: req.temperature ?? 0.7,
    max_tokens: req.max_tokens ?? 1500,
    stream: false,
    ...(req.top_p !== undefined ? { top_p: req.top_p } : {}),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(cfg.timeoutMs),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`AI Gateway completion failed with HTTP ${res.status}: ${errorText || res.statusText}`);
  }

  return (await res.json()) as ChatCompletionResponse;
}

export default {
  resolveAiGatewayConfig,
  checkAiGatewayHealth,
  listAiGatewayModels,
  createAiGatewayCompletion,
};
