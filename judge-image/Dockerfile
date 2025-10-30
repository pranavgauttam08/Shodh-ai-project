FROM openjdk:17-slim

WORKDIR /judge

# Install necessary tools
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy judge script
COPY judge.sh /judge/judge.sh
RUN chmod +x /judge/judge.sh

ENTRYPOINT ["/judge/judge.sh"]
