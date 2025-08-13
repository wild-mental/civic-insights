# Civic Insights 프런트엔드 구현 가이드

## 🏗️ 시스템 아키텍처 개요

### 마이크로서비스 구조
- **API Gateway** (Port 8000): 단일 진입점, JWT 검증, 라우팅
- **Auth Service** (Port 8001): OAuth2 인증, JWT 발급, 사용자 관리  
- **News Service** (Port 8080): 뉴스 CRUD, 카테고리 관리, 프리미엄 콘텐츠

### 보안 아키텍처
- **Gateway-Only Access**: 모든 백엔드 서비스는 게이트웨이를 통해서만 접근 가능
- **JWT 기반 인증**: RS256 알고리즘, Auth Service에서 발급, Gateway에서 검증
- **Role-Based Authorization**: 사용자 권한에 따른 접근 제어

---

## 📡 API 엔드포인트 가이드

### 기본 설정
```bash
# 환경변수 (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
FRONTEND_BASE_URL=http://localhost:9002
```

⚠️ **중요**: 프론트엔드는 **반드시** API Gateway (8000 포트)를 통해서만 호출해야 합니다. 백엔드 서비스 직접 호출 시 403 에러가 발생합니다.

### 인증 관련 엔드포인트

#### 공개 엔드포인트 (JWT 불필요)
```http
# Google OAuth 로그인 시작
GET /api/auth/google

# OAuth 콜백 (자동 처리)
GET /api/auth/login/oauth2/code/google

# 토큰 교환 (클라이언트 주도)
POST /api/auth/google/token
Content-Type: application/json
{
  "code": "google_auth_code"
}

# 토큰 갱신
POST /api/auth/refresh
Content-Type: application/json
{
  "refreshToken": "refresh_token_string"
}
```

#### 보호된 엔드포인트 (JWT 필요)
```http
# 사용자 프로필 조회
GET /api/auth/profile
Authorization: Bearer {access_token}

# 사용자 프로필 수정
PUT /api/auth/profile
Authorization: Bearer {access_token}
Content-Type: application/json
{
  "displayName": "새로운 이름",
  "subscriptionType": "PAID_USER"
}
```

### 뉴스 관련 엔드포인트

#### 공개 엔드포인트
```http
# 전체 뉴스 목록 (페이지네이션)
GET /api/news/articles?page=0&size=25&sort=createDate,desc

# 무료 뉴스 목록
GET /api/news/articles/free?page=0&size=25

# 프리미엄 뉴스 목록 (제목/요약만)
GET /api/news/articles/premium?page=0&size=25

# 카테고리별 뉴스
GET /api/news/articles/category/CIVIC_ENGAGEMENT?page=0&size=25

# 개별 뉴스 상세 (무료)
GET /api/news/articles/{id}
```

#### 보호된 엔드포인트 (JWT 필요)
```http
# 프리미엄 뉴스 상세 (PAID_USER 권한 필요)
GET /api/news/articles/premium/{id}
Authorization: Bearer {access_token}

# 뉴스 생성 (관리자 권한 필요)
POST /api/news/articles
Authorization: Bearer {access_token}
Content-Type: application/json
{
  "title": "뉴스 제목",
  "content": "뉴스 내용",
  "category": "CIVIC_ENGAGEMENT",
  "isPremium": true
}

# 뉴스 수정
PUT /api/news/articles/{id}
Authorization: Bearer {access_token}

# 뉴스 삭제
DELETE /api/news/articles/{id}
Authorization: Bearer {access_token}
```

### 페이지네이션 응답 구조
```typescript
interface PageResponse<T> {
  content: T[]           // 실제 데이터 배열
  totalElements: number  // 전체 요소 수
  totalPages: number     // 전체 페이지 수
  number: number         // 현재 페이지 번호 (0-based)
  size: number          // 페이지 크기
  first: boolean        // 첫 페이지 여부
  last: boolean         // 마지막 페이지 여부
  numberOfElements: number // 현재 페이지의 요소 수
}
```

---

## 🔐 JWT 토큰 관리 및 보안

### JWT 토큰 구조
```typescript
interface JWTClaims {
  sub: string      // 사용자 ID
  iss: string      // 발급자 (civic-insights)
  aud: string      // 대상
  exp: number      // 만료 시간
  iat: number      // 발급 시간
  roles: string[]  // 사용자 권한 ["USER", "PAID_USER", "ADMIN"]
}
```

### Gateway에서 추가되는 헤더
게이트웨이는 JWT 검증 성공 시 다음 헤더를 백엔드로 전달합니다:
```http
X-User-Id: {user_id}
X-User-Roles: {comma_separated_roles}
X-Token-Issuer: civic-insights
X-Gateway-Internal: {secret_token}
```

### 에러 응답 구조
```typescript
interface AuthError {
  error: string           // 에러 코드
  error_description: string // 에러 설명
  status: number         // HTTP 상태 코드
  timestamp: string      // 에러 발생 시간
  path: string          // API Gateway Authentication
}

// 일반적인 에러 코드
// missing_token: Authorization 헤더 누락
// invalid_request: 잘못된 요청 형식
// invalid_token: 유효하지 않은 토큰
// token_expired: 만료된 토큰
// invalid_signature: 서명 검증 실패
// insufficient_scope: 권한 부족
```

---

## 🔒 권한 및 역할 관리

### 사용자 역할
- **USER**: 기본 사용자 (무료 콘텐츠 접근)
- **PAID_USER**: 유료 사용자 (프리미엄 콘텐츠 접근)
- **ADMIN**: 관리자 (모든 기능 접근)

### 접근 권한 매트릭스
| 기능 | USER | PAID_USER | ADMIN |
|------|------|-----------|-------|
| 무료 뉴스 조회 | ✅ | ✅ | ✅ |
| 프리미엄 뉴스 목록 | ✅ | ✅ | ✅ |
| 프리미엄 뉴스 상세 | ❌ | ✅ | ✅ |
| 프로필 조회/수정 | ✅ | ✅ | ✅ |
| 뉴스 생성/수정/삭제 | ❌ | ❌ | ✅ |

---

## 🌐 CORS 및 네트워크 정책

### CORS 설정
- 백엔드 서비스는 게이트웨이 오리진만 허용
- 프론트엔드 직접 호출 시 CORS 에러 발생
- **해결책**: Next.js API Routes를 통한 서버사이드 프록시 사용

### 보안 제약사항
- 백엔드 서비스 직접 접근 차단 (`X-Gateway-Internal` 헤더 필요)
- IP 기반 접근 제어 (로컬/내부 네트워크만 허용)
- JWT 서명 검증으로 토큰 위조 방지

## 💻 Next.js 구현 예시

### 기본 설정
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export class ApiClient {
  private baseURL: string
  
  constructor() {
    this.baseURL = API_BASE_URL
  }
  
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }
    
    return response.json()
  }
}

class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message)
  }
}
```

### API Route 프록시 패턴 (권장)
```typescript
// app/api/news/premium/[id]/route.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // HttpOnly 쿠키에서 토큰 읽기
    const token = cookies().get('access_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'missing_token', error_description: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Gateway를 통해 백엔드 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news/articles/premium/${params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )
    
    if (!response.ok) {
      const errorData = await response.text()
      return new NextResponse(errorData, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Premium article fetch error:', error)
    return NextResponse.json(
      { error: 'server_error', error_description: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 클라이언트 사이드 API 호출
```typescript
// hooks/useNews.ts
import { useState, useEffect } from 'react'

interface Article {
  id: number
  title: string
  content: string
  category: string
  isPremium: boolean
  createDate: string
}

export function useNews(page = 0, size = 25) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    first: true,
    last: true
  })
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/news/articles?page=${page}&size=${size}`,
          {
            credentials: 'include', // 쿠키 포함
          }
        )
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setArticles(data.content)
        setPagination({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          number: data.number,
          first: data.first,
          last: data.last
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchNews()
  }, [page, size])
  
  return { articles, loading, error, pagination }
}
```

### 프리미엄 콘텐츠 접근 컴포넌트
```typescript
// components/PremiumArticle.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PremiumArticleProps {
  articleId: string
}

export function PremiumArticle({ articleId }: PremiumArticleProps) {
  const { user, isAuthenticated } = useAuth()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchPremiumArticle = async () => {
      try {
        // 내부 API Route를 통해 호출
        const response = await fetch(`/api/news/premium/${articleId}`, {
          credentials: 'include',
        })
        
        if (response.status === 401) {
          setError('로그인이 필요한 콘텐츠입니다.')
          return
        }
        
        if (response.status === 403) {
          setError('프리미엄 구독이 필요한 콘텐츠입니다.')
          return
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch article')
        }
        
        const data = await response.json()
        setArticle(data)
      } catch (err) {
        setError('문서를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPremiumArticle()
  }, [articleId])
  
  if (loading) return <div>로딩 중...</div>
  if (error) return <div className="error">{error}</div>
  if (!article) return <div>문서를 찾을 수 없습니다.</div>
  
  return (
    <article>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  )
}
```

### 에러 처리 및 사용자 경험
```typescript
// utils/errorHandling.ts
export function handleApiError(error: any, router: any) {
  if (error.status === 401) {
    // 토큰 만료 또는 미인증
    router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
    return '로그인이 필요합니다.'
  }
  
  if (error.status === 403) {
    // 권한 부족
    return '접근 권한이 없습니다.'
  }
  
  if (error.status === 404) {
    return '요청한 리소스를 찾을 수 없습니다.'
  }
  
  if (error.status >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
  
  return '알 수 없는 오류가 발생했습니다.'
}
```

---

## 🚫 금지 사항 및 주의사항

### 절대 하지 말아야 할 것
1. **백엔드 직접 호출**: 8080, 8001 포트 직접 접근 금지
2. **Gateway 헤더 위조**: `X-Gateway-Internal` 헤더 직접 추가 금지
3. **토큰 노출**: localStorage나 일반 쿠키에 JWT 저장 금지
4. **CORS 우회**: fetch의 mode: 'no-cors' 사용 금지

### 권장 사항
1. **항상 Gateway 경유**: 모든 API 호출은 8000 포트를 통해
2. **서버사이드 프록시**: Next.js API Routes 적극 활용
3. **HttpOnly 쿠키**: 토큰은 서버에서만 관리
4. **에러 처리**: 401/403 상황에 대한 적절한 UX 제공

---

## 📊 성능 최적화 가이드

### 캐싱 전략
```typescript
// Next.js App Router에서 데이터 캐싱
export async function getArticles(page = 0) {
  const response = await fetch(
    `${API_BASE_URL}/api/news/articles?page=${page}&size=25`,
    {
      // 30분간 캐시
      next: { revalidate: 1800 },
    }
  )
  return response.json()
}

// 프리미엄 콘텐츠는 캐시하지 않음
export async function getPremiumArticle(id: string, token: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/news/articles/premium/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store', // 항상 최신 데이터
    }
  )
  return response.json()
}
```

### 무한 스크롤 구현
```typescript
// hooks/useInfiniteNews.ts
export function useInfiniteNews() {
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const response = await fetch(
        `/api/news/articles?page=${page}&size=25`
      )
      const data = await response.json()
      
      setArticles(prev => [...prev, ...data.content])
      setPage(prev => prev + 1)
      setHasMore(!data.last)
    } catch (error) {
      console.error('Failed to load more articles:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])
  
  return { articles, loadMore, loading, hasMore }
}
```

---

## 🔧 디버깅 및 개발 도구

### 로컬 개발 환경 설정
```bash
# Docker Compose로 전체 환경 실행
docker-compose up -d

# 개별 서비스 확인
curl http://localhost:8000/actuator/health
curl http://localhost:8001/.well-known/jwks.json
curl http://localhost:8080/actuator/health
```

### Gateway 라우팅 확인
```bash
# 등록된 라우트 목록
curl http://localhost:8000/actuator/gateway/routes | jq .

# 글로벌 필터 목록
curl http://localhost:8000/actuator/gateway/globalfilters | jq .
```

### JWT 토큰 디버깅
```typescript
// 개발 환경에서만 사용하는 토큰 디코딩 함수
function decodeJWT(token: string) {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('JWT decoding should only be used in development')
    return null
  }
  
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}
```

---

## 📝 체크리스트

### 개발 시작 전
- [ ] 환경변수 설정 확인 (`.env.local`)
- [ ] Gateway(8000), Auth(8001), News(8080) 서비스 구동 확인
- [ ] Next.js 프로젝트 API Routes 디렉토리 구조 설계

### API 통합 시
- [ ] 모든 API 호출이 Gateway를 통하는지 확인
- [ ] HttpOnly 쿠키로 토큰 관리 구현
- [ ] 에러 처리 및 사용자 피드백 구현
- [ ] 권한별 접근 제어 구현

### 보안 검증
- [ ] 백엔드 직접 호출 시 403 에러 확인
- [ ] JWT 없이 보호된 리소스 접근 시 401 에러 확인
- [ ] 권한 부족 시 적절한 403 에러 처리 확인
- [ ] 토큰이 브라우저에 노출되지 않는지 확인

### 성능 최적화
- [ ] 적절한 캐싱 전략 적용
- [ ] 무한 스크롤/페이지네이션 구현
- [ ] 이미지 최적화 (Next.js Image 컴포넌트 사용)
- [ ] 번들 크기 최적화

---

## 🎯 핵심 요약

1. **단일 진입점**: 모든 API 호출은 Gateway(8000)를 통해
2. **서버사이드 프록시**: Next.js API Routes로 CORS 문제 해결
3. **보안 우선**: HttpOnly 쿠키 + JWT로 안전한 인증
4. **권한 기반 접근**: 사용자 역할에 따른 기능 제한
5. **에러 처리**: 적절한 사용자 경험과 피드백 제공

---

### OAuth2 로그인 흐름 (게이트웨이 경유, 서버 세션 권장)

- 시작 URL: `GET ${NEXT_PUBLIC_API_BASE_URL}/api/auth/google`
  - 게이트웨이가 인증 서비스로 프록시 → Google 로그인 페이지로 이동

- 콜백 URL: `GET ${NEXT_PUBLIC_API_BASE_URL}/api/auth/login/oauth2/code/google`
  - 게이트웨이가 인증 서비스 콜백으로 프록시
  - 인증 서비스는 Google 코드 교환 후, 브라우저에 "자동 제출 폼(HTML)"을 반환하여
    `POST FRONTEND_BASE_URL/api/session` 로 access/refresh 토큰을 안전하게 전송
  - Next API Route는 토큰을 HttpOnly 쿠키로 저장 후, 원하는 경로(예: `/`)로 302 리다이렉트

- 로컬 기본값
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
  - `FRONTEND_BASE_URL=http://localhost:9002`

#### Next.js 구현 가이드

- 로그인 버튼 예시
```tsx
// components/LoginButton.tsx
'use client'

export function LoginButton() {
  const onLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`
  }
  return <button onClick={onLogin}>Login with Google</button>
}
```

- 콜백 페이지는 필요하지 않습니다. 브라우저가 자동 제출된 폼을 통해 `/api/session` 으로 POST 합니다.

- 서버 사이드 세션(Next Route Handler)
  - 폼 POST(application/x-www-form-urlencoded)로 전달된 토큰을 쿠키로 저장 후 리다이렉트
```ts
// app/api/session/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const accessToken = String(form.get('access_token') || '')
  const refreshToken = String(form.get('refresh_token') || '')
  const res = NextResponse.redirect(new URL('/', req.url))
  if (accessToken) res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  if (refreshToken) res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return res
}
```

#### 보안 메모
- 토큰은 URL(쿼리/해시)에 노출하지 않습니다. 자동 제출 폼 + 서버 쿠키 보관을 사용합니다.
- 게이트웨이 뒤 단일 오리진 구성 및 SameSite/HTTPS 설정으로 세션을 강화하세요.
- 서버 주도 토큰 관리 구현이 너무 복잡하게 여겨지는 경우, PKCE 기반 클라이언트 주도 플로우도 대안이 될 수 있습니다.

#### 프런트엔드 구현 가이드(보안 우선)
- 목표: 브라우저는 토큰을 다루지 않고, Next 서버(HttpOnly 쿠키)에서만 보관/전달.
- 변경 사항
  1) 해시 파싱/로컬스토리지 저장 로직 제거
  2) `/api/session` 라우트로 폼 POST를 받아 HttpOnly 쿠키 저장(위 예시 사용)
  3) 백엔드 호출은 모두 Next Route Handler를 통해 서버-사이드 프록시
     - 예: 프리미엄 상세 호출 프록시
```ts
// app/api/news/premium/[id]/route.ts
import { cookies } from 'next/headers'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const token = cookies().get('access_token')?.value
  const r = await fetch(`http://localhost:8000/api/news/articles/premium/${params.id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  })
  return new Response(await r.text(), { status: r.status, headers: r.headers })
}
```
  4) 클라이언트는 내부 API(`/api/...`)만 호출하고 Authorization 헤더를 직접 넣지 않음
  5) CSRF 대비: POST/PUT/DELETE는 CSRF 토큰 또는 Origin/Referer 체크 적용

- 주의: localStorage나 클라이언트 쿠키(Non-HttpOnly)에 토큰 저장 금지

#### BFF 완전형(원타임 세션 코드) 전환 가이드
- 목적: 브라우저에 토큰이 전혀 나타나지 않도록, 브라우저가 가진 것은 일회용 `session_code`뿐이며 토큰 교환은 서버-사이드로만 수행
- 전체 흐름(요약)
  1) 사용자: `GET ${NEXT_PUBLIC_API_BASE_URL}/api/auth/google`
  2) Google 로그인 완료 → 콜백은 게이트웨이 경유로 Auth 서비스 도착
  3) Auth 서비스: Google 코드로 토큰 교환(서버-사이드) → `session_code` 발급(1회성, TTL=60s) → 브라우저에 자동 제출 폼으로 `POST FRONTEND_BASE_URL/api/session/finalize`(code만 전송)
  4) Next `/api/session/finalize`: 서버-사이드로 Auth 서비스의 세션 교환 엔드포인트를 호출하여 `session_code`→토큰 번들 교환 → HttpOnly 쿠키 저장 → 302 리다이렉트(`/` 등)
  5) 이후 API 호출은 Next Route Handler가 쿠키를 읽어 게이트웨이에 서버-사이드 프록시

- Next 구현(예시)
```ts
// app/api/session/finalize/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const code = String(form.get('session_code') || '')
  if (!code) return NextResponse.redirect(new URL('/login?error=missing_code', req.url))

  // 게이트웨이 경유로 Auth 세션 교환 API 호출 (외부는 버전리스: /api/auth/session/finalize)
  const r = await fetch(`http://localhost:8000/api/auth/session/finalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionCode: code }),
    cache: 'no-store',
  })
  if (!r.ok) return NextResponse.redirect(new URL('/login?error=finalize_failed', req.url))

  const { accessToken, refreshToken } = await r.json()
  const res = NextResponse.redirect(new URL('/', req.url))
  if (accessToken) res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  if (refreshToken) res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return res
}
```

- Auth 서비스 변경 요약(필수)
  - 콜백(`/api/v1/auth/login/oauth2/code/google`)에서 “토큰을 브라우저로 전달” 대신 아래 수행
    - 서버-사이드로 Google 코드 교환 → 토큰 번들 발급
    - `session_code` 생성(고엔트로피 랜덤, TTL=60s, 1회성). 저장소(권장: Redis)에 `session_code → {access, refresh, meta}` 매핑 저장
    - 자동 제출 폼 HTML을 반환하되, 폼에는 `session_code`만 포함하고 `action=FRONTEND_BASE_URL/api/session/finalize`
  - 세션 교환 엔드포인트 신설(예: `POST /api/v1/auth/session/finalize`)
    - 요청 바디: `{ sessionCode: string }`
    - 검증: 존재/미사용/TTL 유효성 확인 후 즉시 소거(single-use)
    - 응답: `{ accessToken, refreshToken, tokenType, expiresIn }`
    - 보안: 게이트웨이 전용 접근(`X-Gateway-Internal`), 레이트 리밋, 감사 로그(토큰은 마스킹)

- 보안 팁
  - `session_code`는 매우 짧은 TTL(예: 60s), 1회성, 사용 즉시 삭제
  - 콜백 HTML 응답 헤더: `Cache-Control: no-store`, `Referrer-Policy: no-referrer`, 강한 CSP(`form-action FRONTEND_BASE_URL`)
  - 로그/모니터링에 코드/토큰 직접 출력 금지(해시/마스킹)

#### PKCE 간단 요약
- 약자: PKCE = Proof Key for Code Exchange
- 공식 문서: [RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636), [RFC 8252 - OAuth 2.0 for Native Apps](https://datatracker.ietf.org/doc/html/rfc8252)
- 무엇: 공개 클라이언트(SPA/모바일)를 위한 Authorization Code Flow 보강.
- 핵심: 클라이언트가 `code_verifier`를 생성하고, `code_challenge=S256(code_verifier)`를 인가요청에 포함. 토큰 교환 시 `code_verifier` 제출 → 서버가 challenge와 일치 검증.
- 장점: 코드 탈취 방지, 클라이언트 시크릿 불필요, OAuth 2.1 권고.
- 한계: 토큰을 JS가 다루면 XSS/오용 위험. 가능하면 즉시 서버로 교환하여 HttpOnly 쿠키로 저장(BFF 권장).
- 사용처: 순수 SPA/모바일 단독 운영 시. BFF가 어려운 경우 현실적 대안.