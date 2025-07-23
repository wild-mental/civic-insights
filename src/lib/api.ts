import type { Article } from './types';
import { getAllArticles, getArticleBySlug } from './mock-data';

const API_BASE_URL = 'http://localhost:8080/api';

// 백엔드에서 실제로 반환하는 데이터 구조
export interface BackendArticle {
  id: number;
  title: string;
  mainImg: string;
  author: string;
  createDate: string;
  updateDate: string;
  content: string;
  category: string;
  isPremium: boolean;
}

// 백엔드 데이터를 프론트엔드 타입으로 변환
function transformBackendArticle(backendArticle: BackendArticle): Article {
  return {
    id: backendArticle.id.toString(),
    slug: generateSlug(backendArticle.title),
    title: backendArticle.title,
    summary: extractSummary(backendArticle.content),
    content: backendArticle.content,
    category: mapBackendCategory(backendArticle.category),
    type: backendArticle.isPremium ? 'paid' : 'free',
    publishDate: backendArticle.createDate.split('T')[0], // YYYY-MM-DD 형태로 변환
    image: backendArticle.mainImg,
    author: backendArticle.author,
  };
}

// 제목에서 슬러그 생성 (간단한 구현)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// 컨텐츠에서 요약 추출 (첫 100자)
function extractSummary(content: string): string {
  return content.substring(0, 100) + (content.length > 100 ? '...' : '');
}

// 백엔드 카테고리를 프론트엔드 타입으로 매핑
function mapBackendCategory(category: string): Article['category'] {
  switch (category) {
    case 'CIVIC_ENGAGEMENT':
    case '시민참여':
    case 'Civic Engagement':
      return 'Civic Engagement';
    case 'MEGATRENDS':
    case '메가트렌드':
    case 'Megatrends':
      return 'Megatrends';
    case 'BASIC_INCOME':
    case '기본소득':
    case 'Basic Income':
      return 'Basic Income';
    default:
      return 'Civic Engagement'; // 기본값
  }
}

/**
 * 전체 뉴스 리스트 조회
 * GET /api/articles
 */
export async function fetchArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 백엔드에서 직접 배열을 반환하므로 래핑된 객체가 아닌 배열로 파싱
    const data: BackendArticle[] = await response.json();
    
    return data.map(transformBackendArticle);
  } catch (error) {
    console.error('Failed to fetch articles from backend, using mock data:', error);
    // 백엔드가 응답하지 않을 경우 mock 데이터 사용
    return getAllArticles();
  }
}

/**
 * 카테고리별 뉴스 리스트 조회
 */
export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await fetchArticles();
  return articles.filter(article => article.category === category);
}

/**
 * 최신 뉴스 리스트 조회
 */
export async function fetchLatestArticles(count: number): Promise<Article[]> {
  const articles = await fetchArticles();
  return articles
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
}

/**
 * 슬러그로 특정 뉴스 조회
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const articles = await fetchArticles();
    return articles.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error('Failed to fetch article from backend, using mock data:', error);
    // 백엔드가 응답하지 않을 경우 mock 데이터 사용
    return getArticleBySlug(slug) || null;
  }
} 