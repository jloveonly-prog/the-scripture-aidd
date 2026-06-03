/**
 * 게시판 CRUD 비즈니스 로직
 * 연결 REQ: REQ-002, FR-002~006
 * 단일 책임: 비즈니스 규칙 (검증, 트랜잭션)
 */
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../db/database.js';
import type { Post } from '../db/database.js';

export interface PostInput {
  title: string;
  content: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** 방어 깊이 2층: 서버 입력 검증 */
export function validatePostInput(input: PostInput): ValidationResult {
  const title = input.title?.trim() ?? '';
  const content = input.content?.trim() ?? '';

  if (title.length === 0) {
    return { valid: false, error: '제목을 입력하세요.' };
  }
  if (content.length === 0) {
    return { valid: false, error: '내용을 입력하세요.' };
  }
  return { valid: true };
}

/** FR-002: 게시글 목록 */
export function listPosts(): Post[] {
  return getAllPosts();
}

/** FR-003: 게시글 조회 */
export function findPost(id: number): Post | undefined {
  return getPostById(id);
}

/** FR-004: 게시글 생성 */
export function addPost(input: PostInput): number {
  return createPost(input.title, input.content);
}

/** FR-005: 게시글 수정 */
export function editPost(id: number, input: PostInput): boolean {
  return updatePost(id, input.title, input.content);
}

/** FR-006: 게시글 삭제 */
export function removePost(id: number): boolean {
  return deletePost(id);
}
