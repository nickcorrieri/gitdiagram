FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV HOST=0.0.0.0 PORT=3000
COPY --from=build /app/out ./out
COPY --from=build /app/scripts/serve.mjs /app/scripts/http-policy.mjs ./scripts/
USER node
EXPOSE 3000
CMD ["node", "scripts/serve.mjs"]
