# -----------------------------------------------------------------------------
# ---------- 1) build aşaması --------------------------------------------------
# -----------------------------------------------------------------------------
#  🔒 Resmi slim imaj + build cache’leri için BuildKit mount
ARG NODE_VERSION=20.12.2
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS builder

# ------------- metadata ------------------------------------------------------
LABEL org.opencontainers.image.source="https://github.com/your-org/your-repo" \
    org.opencontainers.image.description="TaskGo Frontend – Vite + React" \
    org.opencontainers.image.licenses="MIT"

WORKDIR /app

# ------------- bağımlılık ön belleği  (BuildKit) -----------------------------
#  package.json ve lock dosyasını ayrı kopyalayarak katman önbelleği
COPY package*.json ./

#  npm ci kullan, node_modules klasörünü BuildKit cache mount’u ile tut
RUN --mount=type=cache,target=/root/.npm \
    npm ci --production=false

# ------------- kaynak kodu & build ------------------------------------------
COPY . .

# Vite production build; PUBLIC_URL arg’ı dışarıdan override edilebilir
ARG PUBLIC_URL=/
ENV PUBLIC_URL=${PUBLIC_URL}

RUN npm run build

# -----------------------------------------------------------------------------
# ---------- 2) runtime aşaması  ----------------------------------------------
# -----------------------------------------------------------------------------
ARG NGINX_VERSION=1.25-alpine
FROM nginx:${NGINX_VERSION}

# ------------- non-root user --------------------------------------------------
#  drop root (nginx user id 101)
USER 101

# ------------- konfig --------------------------------------------------------
#  Özel Nginx conf ekle (caching, gzip, SPA fallback)
COPY --chown=101:0 docker/nginx.conf /etc/nginx/nginx.conf

# ------------- statik dosyaları kopyala -------------------------------------
COPY --from=builder /app/dist /usr/share/nginx/html

# ------------- healthcheck ---------------------------------------------------
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -qO- http://localhost:80/healthz || exit 1

# ------------- değişkenler ---------------------------------------------------
ENV NODE_ENV=production

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
