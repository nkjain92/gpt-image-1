export interface OpenAIImageResponse {
  created: number;
  data: {
    b64_json?: string;
    url?: string;
    revised_prompt?: string;
  }[];
}

export interface ImageGenerationRequest {
  prompt: string;
  size?: '1024x1024' | '1024x1536' | '1536x1024';
  quality?: 'low' | 'medium' | 'high' | 'standard';
  style?: 'natural' | 'vivid';
  response_format?: 'url' | 'b64_json';
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl: string;
  error?: string;
}
