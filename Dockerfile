FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY tsconfig.json ./

COPY src/ ./src/

RUN npm install -g typescript
RUN npm run build

RUN npm uninstall typescript
RUN rm -rf src/ tsconfig.json

RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /usr/src/app
USER appuser

EXPOSE 5000

CMD ["npm", "start"]