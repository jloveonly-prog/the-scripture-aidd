// src/types.ts
// 공유 타입 정의 — API 응답 Contract-First

export interface Post {
  id: number;
  content: string;
  type: 'url' | 'text';
  createdAt: string;
}

export interface CreatePostInput {
  content: string;
}

export interface APIError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
