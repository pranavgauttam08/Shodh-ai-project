# Shodh-a-Code: AI-Powered Coding Contest Platform

A production-ready competitive programming platform featuring real-time leaderboards, secure code execution, and AI-powered code mentorship. Built with Spring Boot, Next.js, and WebSocket technology for seamless real-time updates.

## Features

- **Contest Management**: Create and manage coding contests with multiple problems
- **Secure Code Judge**: Docker-based sandboxed execution with timeout and memory limits
- **Real-time Updates**: WebSocket-powered live leaderboard and submission status
- **Monaco Editor**: Professional code editor with syntax highlighting and auto-completion
- **AI Code Mentor**: Intelligent code review with feedback, suggestions, and quality scoring
- **Multi-language Support**: Java, Python, C++ (extensible architecture)
- **Dark Theme UI**: Modern developer-focused interface with smooth animations
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## Architecture

### System Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                     │
│  - React 18 with TypeScript                                 │
│  - Monaco Editor for code submission                        │
│  - Framer Motion animations                                 │
│  - WebSocket real-time updates                              │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                Backend (Spring Boot 3.2)                     │
│  - REST Controllers for CRUD operations                     │
│  - WebSocket handlers for real-time features                │
│  - JudgeService for code execution                          │
│  - CodeMentorService for AI reviews                         │
│  - H2 in-memory database                                    │
└────────────────────┬────────────────────────────────────────┘
                     │ ProcessBuilder
┌────────────────────▼────────────────────────────────────────┐
│              Judge Engine (Java ProcessBuilder)              │
│  - Secure code compilation and execution                    │
│  - Timeout protection (2 seconds)                           │
│  - Memory limits (256MB)                                    │
│  - Test case comparison                                     │
│  - Automatic cleanup                                        │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Technology Stack

**Backend**
- Spring Boot 3.2 with Java 17
- Spring Data JPA for database operations
- Spring WebSocket for real-time communication
- H2 Database (in-memory, no external dependencies)
- Lombok for boilerplate reduction
- Maven for dependency management

**Frontend**
- Next.js 14 with React 18
- TypeScript for type safety
- Tailwind CSS 4 for styling
- Framer Motion for animations
- Monaco Editor for code editing
- SockJS + STOMP for WebSocket communication

**Deployment**
- Docker & Docker Compose
- Multi-stage builds for optimized images
- Health checks for service reliability

## Quick Start

### Prerequisites

- Docker & Docker Compose (recommended)
- Java 17+ (for local development)
- Node.js 18+ (for local development)

### Option 1: Docker Compose (Recommended)

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd shodh-a-code

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
\`\`\`

### Option 2: Local Development

**Backend**
\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080
\`\`\`

**Frontend**
\`\`\`bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
\`\`\`

## API Endpoints

### Contests
\`\`\`
GET    /api/contests              - List all contests
GET    /api/contests/{id}         - Get contest details
POST   /api/contests              - Create new contest
\`\`\`

### Problems
\`\`\`
GET    /api/problems/contest/{contestId}  - Get problems in contest
GET    /api/problems/{id}                  - Get problem details
POST   /api/problems                       - Create new problem
\`\`\`

### Submissions
\`\`\`
POST   /api/submissions                    - Submit code
GET    /api/submissions/{id}               - Get submission status
GET    /api/submissions/contest/{contestId} - Get contest submissions
\`\`\`

### Users
\`\`\`
GET    /api/users                 - List all users
GET    /api/users/{id}            - Get user details
POST   /api/users                 - Create new user
GET    /api/users/leaderboard     - Get global leaderboard
\`\`\`

### Code Mentor
\`\`\`
POST   /api/code-mentor/review/{submissionId} - Get AI code review
\`\`\`

## WebSocket Endpoints

### Submission Updates
\`\`\`
WS     /ws-submissions            - Subscribe to submission updates
Topic: /topic/submission/{id}     - Individual submission status
Topic: /topic/contest/{id}/submissions - Contest submissions
\`\`\`

### Leaderboard Updates
\`\`\`
WS     /ws-leaderboard            - Subscribe to leaderboard updates
Topic: /topic/leaderboard/{id}    - Contest leaderboard
\`\`\`

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  score BIGINT DEFAULT 0,
  problems_solved INT DEFAULT 0
);
\`\`\`

### Contests Table
\`\`\`sql
CREATE TABLE contests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  total_problems INT DEFAULT 0,
  total_participants INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'UPCOMING'
);
\`\`\`

### Problems Table
\`\`\`sql
CREATE TABLE problems (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  contest_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  input_format TEXT,
  output_format TEXT,
  constraints TEXT,
  points INT DEFAULT 100,
  solved_count INT DEFAULT 0,
  attempt_count INT DEFAULT 0,
  FOREIGN KEY (contest_id) REFERENCES contests(id)
);
\`\`\`

### Submissions Table
\`\`\`sql
CREATE TABLE submissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  problem_id BIGINT NOT NULL,
  contest_id BIGINT NOT NULL,
  code TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  verdict VARCHAR(50),
  output TEXT,
  error TEXT,
  execution_time INT DEFAULT 0,
  memory_used INT DEFAULT 0,
  submitted_at TIMESTAMP NOT NULL,
  language VARCHAR(20) DEFAULT 'JAVA',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_id) REFERENCES problems(id),
  FOREIGN KEY (contest_id) REFERENCES contests(id)
);
\`\`\`

## Design Decisions

### 1. H2 In-Memory Database
- **Why**: Eliminates external dependencies, perfect for quick setup and demos
- **Trade-off**: Data is lost on restart; use PostgreSQL/MySQL for production
- **Migration**: Change `spring.datasource.url` in `application.properties`

### 2. ProcessBuilder for Code Execution
- **Why**: Simple, direct Java execution without Docker API complexity
- **Security**: Runs in isolated temp directories with automatic cleanup
- **Limitations**: Single-machine execution; use Docker API for distributed judging

### 3. WebSocket for Real-time Updates
- **Why**: Low-latency, bidirectional communication for live leaderboards
- **Fallback**: Polling available as alternative in frontend
- **Scalability**: Use Redis pub/sub for multi-instance deployments

### 4. Mock AI Reviews
- **Why**: Works without API keys; ready for OpenAI integration
- **Production**: Set `OPENAI_API_KEY` environment variable to enable real reviews
- **Cost**: OpenAI API charges apply; consider rate limiting

### 5. Async Submission Judging
- **Why**: Prevents blocking; users see immediate feedback
- **Implementation**: Background threads; upgrade to message queues for scale

## Configuration

### Environment Variables

\`\`\`bash
# Backend
OPENAI_API_KEY=sk-...          # Optional: Enable AI code reviews
SPRING_DATASOURCE_URL=...      # Database URL (default: H2 in-memory)

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api  # Backend API URL
\`\`\`

### Docker Compose Customization

\`\`\`yaml
# Modify docker-compose.yml to change ports, environment variables, or services
services:
  backend:
    ports:
      - "8080:8080"  # Change to "9000:8080" for different port
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
\`\`\`

## Performance Optimization

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with next/image
- CSS-in-JS with Tailwind for minimal bundle size
- WebSocket connection pooling

### Backend
- Connection pooling with HikariCP
- Query optimization with JPA
- Async submission processing
- Caching with Spring Cache

### Judge Engine
- Parallel test case execution (future enhancement)
- Memory-efficient code compilation
- Automatic temp file cleanup

## Security Considerations

### Code Execution
- Sandboxed in temporary directories
- No network access
- Memory limits (256MB)
- Timeout protection (2 seconds)
- Automatic cleanup of temp files

### API Security
- CORS enabled for development (restrict in production)
- Input validation on all endpoints
- SQL injection prevention via JPA
- XSS protection via React

### Future Enhancements
- JWT authentication
- Rate limiting
- HTTPS enforcement
- API key management

## Troubleshooting

### Backend won't start
\`\`\`bash
# Check if port 8080 is in use
lsof -i :8080

# Clear Maven cache
mvn clean install -U
\`\`\`

### Frontend can't connect to backend
\`\`\`bash
# Verify backend is running
curl http://localhost:8080/api/contests

# Check CORS configuration in WebSocketConfig.java
# Update NEXT_PUBLIC_API_URL if backend is on different host
\`\`\`

### WebSocket connection fails
\`\`\`bash
# Check WebSocket endpoint
ws://localhost:8080/ws-submissions

# Verify SockJS fallback is working
# Check browser console for connection errors
\`\`\`

### Code execution times out
\`\`\`bash
# Increase timeout in JudgeService.java (line ~80)
if (!runProcess.waitFor(5, TimeUnit.SECONDS)) {  // Change 2 to 5
\`\`\`

## Future Enhancements

### Phase 2
- User authentication with JWT
- Problem difficulty ratings
- Discussion forums
- Contest analytics dashboard
- Email notifications

### Phase 3
- Multiple language support (Python, C++, Go)
- Advanced judge features (custom checkers, interactive problems)
- Team contests
- Problem editorial system
- Plagiarism detection

### Phase 4
- Mobile app (React Native)
- Advanced AI features (code generation hints, bug detection)
- Distributed judge system
- Contest streaming
- Sponsorship integration

## Development Workflow

### Adding a New Feature

1. **Backend**: Create entity, repository, service, controller
2. **Database**: Add migration if needed
3. **Frontend**: Create component, add API call
4. **Testing**: Test locally with `docker-compose up`
5. **Documentation**: Update README and API docs

### Code Style

- Backend: Follow Google Java Style Guide
- Frontend: Use Prettier for formatting
- Commit messages: Use conventional commits

## Deployment

### Production Checklist

- [ ] Set `OPENAI_API_KEY` for AI features
- [ ] Configure production database (PostgreSQL/MySQL)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Enable authentication
- [ ] Set up CI/CD pipeline
- [ ] Configure backups

### Vercel Deployment (Frontend)

\`\`\`bash
# Connect GitHub repository to Vercel
# Set environment variables in Vercel dashboard
# Deploy automatically on push to main
\`\`\`

### AWS/GCP Deployment (Backend)

\`\`\`bash
# Build Docker image
docker build -t shodh-a-code:latest .

# Push to container registry
docker push <registry>/shodh-a-code:latest

# Deploy with Kubernetes or ECS
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoint examples

## Acknowledgments

- Spring Boot team for excellent framework
- Next.js team for modern React framework
- Monaco Editor for powerful code editor
- OpenAI for AI capabilities
- Community contributors

---

**Built with passion for competitive programming enthusiasts.**
