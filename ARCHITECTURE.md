# Shodh-a-Code Architecture

## System Design

### High-Level Overview

The platform follows a three-tier architecture:

1. **Presentation Layer** (Frontend)
   - Next.js React application
   - Real-time WebSocket connections
   - Monaco Editor for code input

2. **Application Layer** (Backend)
   - Spring Boot REST API
   - Business logic and validation
   - WebSocket message handlers
   - AI integration layer

3. **Execution Layer** (Judge Engine)
   - Sandboxed code execution
   - Test case validation
   - Resource management

### Data Flow

#### Submission Flow
\`\`\`
User submits code
    ↓
Frontend sends POST /api/submissions
    ↓
Backend creates Submission entity (PENDING)
    ↓
Background thread calls JudgeService.judgeSubmission()
    ↓
Code compiled and executed in temp directory
    ↓
Output compared with test cases
    ↓
Submission status updated (ACCEPTED/WRONG_ANSWER/etc)
    ↓
WebSocket broadcasts update to all clients
    ↓
Leaderboard updated if ACCEPTED
    ↓
AI Code Mentor review triggered (optional)
\`\`\`

#### Real-time Update Flow
\`\`\`
Submission status changes
    ↓
JudgeService broadcasts via WebSocketController
    ↓
Message sent to /topic/submission/{id}
    ↓
All subscribed clients receive update
    ↓
Frontend updates UI with animation
\`\`\`

### Entity Relationships

\`\`\`
User (1) ──────────────────────── (N) Submission
  │                                    │
  │                                    ├─ Problem
  │                                    ├─ Contest
  │                                    └─ CodeReview
  │
  └─ Contest (1) ──────────────────── (N) Problem
                                          │
                                          └─ TestCase
\`\`\`

### API Request/Response Pattern

All endpoints follow RESTful conventions:

\`\`\`
Request:
POST /api/submissions
Content-Type: application/json
{
  "userId": 1,
  "problemId": 5,
  "contestId": 2,
  "code": "public class Solution { ... }",
  "language": "JAVA"
}

Response:
HTTP 200 OK
{
  "id": 42,
  "userId": 1,
  "problemId": 5,
  "status": "PENDING",
  "verdict": null,
  "submittedAt": "2025-01-15T10:30:00"
}
\`\`\`

### WebSocket Message Format

\`\`\`
Subscribe:
SUBSCRIBE
destination:/topic/submission/42

Message:
MESSAGE
destination:/topic/submission/42
content-type:application/json

{
  "id": 42,
  "status": "ACCEPTED",
  "verdict": "ACCEPTED",
  "executionTime": 125,
  "memoryUsed": 45
}
\`\`\`

## Performance Considerations

### Database
- H2 in-memory for development
- Connection pooling with HikariCP
- Lazy loading for related entities
- Indexed queries on frequently accessed fields

### Backend
- Async submission processing
- WebSocket connection pooling
- Request/response compression
- Caching for static data

### Frontend
- Code splitting with dynamic imports
- Image lazy loading
- CSS-in-JS optimization
- WebSocket reconnection logic

### Judge Engine
- Temp file cleanup after execution
- Memory limits to prevent OOM
- Timeout protection
- Parallel test case execution (future)

## Scalability Roadmap

### Current (Single Instance)
- Suitable for: Contests up to 100 participants
- Limitations: Single backend instance, in-memory database

### Phase 1 (Horizontal Scaling)
- Multiple backend instances behind load balancer
- Redis for session management
- PostgreSQL for persistent storage
- Message queue for judge jobs

### Phase 2 (Distributed Judging)
- Separate judge service instances
- Docker-based execution
- Kubernetes orchestration
- Distributed test case execution

### Phase 3 (Global Scale)
- CDN for frontend assets
- Multi-region deployment
- Database replication
- Advanced caching strategies

## Security Architecture

### Code Execution Sandbox
\`\`\`
User Code
    ↓
Temp Directory (/tmp/judge_XXXXX)
    ↓
Isolated Process (no network, limited resources)
    ↓
Automatic Cleanup
\`\`\`

### API Security
- CORS configuration
- Input validation
- SQL injection prevention (JPA)
- XSS protection (React)

### Future Security
- JWT authentication
- Rate limiting
- API key management
- Audit logging

## Monitoring & Logging

### Backend Logging
\`\`\`
[INFO] Contest created: id=1, title="Challenge 2025"
[DEBUG] Submission judged: id=42, verdict=ACCEPTED
[ERROR] Code execution failed: timeout after 2s
\`\`\`

### Frontend Logging
\`\`\`
[v0] WebSocket connected
[v0] Submission update received: id=42, status=ACCEPTED
[v0] Leaderboard refreshed: 5 users
\`\`\`

### Metrics to Track
- Submission success rate
- Average execution time
- WebSocket connection count
- API response times
- Database query performance

## Testing Strategy

### Unit Tests
- Service layer logic
- Entity validation
- Utility functions

### Integration Tests
- API endpoint testing
- Database operations
- WebSocket communication

### End-to-End Tests
- Full submission flow
- Real-time updates
- UI interactions

## Deployment Architecture

### Development
\`\`\`
docker-compose up
├── Backend (port 8080)
├── Frontend (port 3000)
└── H2 Console (port 8080/h2-console)
\`\`\`

### Production
\`\`\`
Load Balancer
├── Backend Instances (multiple)
├── Frontend CDN
├── PostgreSQL Database
├── Redis Cache
└── Judge Service Cluster
\`\`\`

---

For more details, see README.md and API documentation.
