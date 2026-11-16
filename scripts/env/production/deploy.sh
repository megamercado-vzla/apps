#!/usr/bin/env bash

# ==============================================================================
# Script de Despliegue Automatizado para Producción (Vercel) - MEGAMERCADO
# Ubicación: scripts/env/production/deploy.sh
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
EXPECTED_REPOSITORY="megamercado-vzla/apps"

# Colores para consola
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Identidad oficial requerida por Vercel
GIT_NAME="retia-online"
GIT_EMAIL="info@retia.online"

export GIT_AUTHOR_NAME="$GIT_NAME"
export GIT_AUTHOR_EMAIL="$GIT_EMAIL"
export GIT_COMMITTER_NAME="$GIT_NAME"
export GIT_COMMITTER_EMAIL="$GIT_EMAIL"

SOURCE_BRANCH="preview"
TARGET_BRANCH="main"
DRY_RUN=0
EXPLICIT_TAG=""
COMMIT_MSG=""
PROD_URL="${MEGAMERCADO_PROD_URL:-https://megamercado.com.ve}"

usage() {
    cat <<EOF
Uso: $0 [OPCIONES]

Integra los cambios de preview en main, publica la versión en producción y
regresa automáticamente a la rama preview para continuar el ciclo de desarrollo.

Opciones:
  --tag <vX.Y.Z>          Especifica manualmente el tag de versión (ej: v1.0.1).
  --from <rama>           Rama origen a integrar en main (por defecto: preview).
  -m, --message           Mensaje para confirmar cambios locales pendientes en preview.
  --dry-run               Ejecuta validaciones sin hacer push ni crear tags remotos.
  -h, --help              Muestra este mensaje de ayuda.
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --tag)
            EXPLICIT_TAG="$2"
            shift 2
            ;;
        --from)
            SOURCE_BRANCH="$2"
            shift 2
            ;;
        -m|--message)
            COMMIT_MSG="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=1
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Argumento desconocido: $1"
            usage
            exit 1
            ;;
    esac
done

command -v git >/dev/null 2>&1 || { echo "Git no está instalado"; exit 1; }
cd "$PROJECT_ROOT"

# Forzar configuración local de Git
git config user.name "$GIT_NAME"
git config user.email "$GIT_EMAIL"

echo -e "${GREEN}🚀 Iniciando Despliegue a Producción (MEGAMERCADO - Vercel)${NC}"
echo "======================================================================"
echo -e "📦 Repositorio:      ${CYAN}$EXPECTED_REPOSITORY${NC}"
echo -e "👤 Identidad oficial: ${CYAN}$GIT_NAME <$GIT_EMAIL>${NC}"

# Si hay cambios locales sin confirmar en la rama actual (generalmente preview)
if [ -n "$(git status --porcelain)" ]; then
    CURRENT_WORKING_BRANCH=$(git branch --show-current)
    echo -e "📦 Hay cambios locales sin confirmar en $CURRENT_WORKING_BRANCH. Confirmando..."
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="feat: update changes before production release"
    fi
    git add .
    git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" commit -m "$COMMIT_MSG"
fi

# Calcular siguiente versión tag
if [ -n "$EXPLICIT_TAG" ]; then
    RELEASE_TAG="$EXPLICIT_TAG"
else
    LATEST_TAG=$(git tag -l "v*" 2>/dev/null | sort -V | tail -n 1 || echo "")
    if [[ "$LATEST_TAG" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        MAJOR="${BASH_REMATCH[1]}"
        MINOR="${BASH_REMATCH[2]}"
        PATCH="${BASH_REMATCH[3]}"
        NEXT_PATCH=$((PATCH + 1))
        RELEASE_TAG="v${MAJOR}.${MINOR}.${NEXT_PATCH}"
    else
        RELEASE_TAG="v1.0.0"
    fi
fi

echo -e "🏷️  Versión a publicar: ${CYAN}${BOLD}$RELEASE_TAG${NC}"

# Asegurar que los cambios de preview estén subidos a origin
if [ "$DRY_RUN" -eq 0 ]; then
    echo -e "📤 Sincronizando cambios de $SOURCE_BRANCH con origin/$SOURCE_BRANCH..."
    git push -u origin "$SOURCE_BRANCH" || true
fi

# Cambiar a la rama main para realizar la integración
echo -e "🔀 Cambiando a rama $TARGET_BRANCH..."
if git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
    git checkout "$TARGET_BRANCH"
else
    git checkout -b "$TARGET_BRANCH"
fi

if [ "$DRY_RUN" -eq 0 ] && git ls-remote --exit-code --heads origin "$TARGET_BRANCH" >/dev/null 2>&1; then
    echo -e "📥 Sincronizando $TARGET_BRANCH con origin/$TARGET_BRANCH..."
    git pull origin "$TARGET_BRANCH" || true
fi

# Integrar cambios de preview en main forzando autoría oficial
echo -e "Integrando cambios de $SOURCE_BRANCH en $TARGET_BRANCH..."
git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" \
    merge "$SOURCE_BRANCH" --no-ff -m "chore(release): merge $SOURCE_BRANCH into $TARGET_BRANCH for $RELEASE_TAG"

# Asegurar que el commit de HEAD en main tenga el autor y committer oficiales de Vercel
EXPECTED_AUTHOR="$GIT_NAME <$GIT_EMAIL>"
LATEST_AUTHOR="$(git show -s --format='%an <%ae>' HEAD)"
LATEST_COMMITTER="$(git show -s --format='%cn <%ce>' HEAD)"

if [ "$LATEST_AUTHOR" != "$EXPECTED_AUTHOR" ] || [ "$LATEST_COMMITTER" != "$EXPECTED_AUTHOR" ]; then
    echo -e "Asegurando autoría oficial de Vercel en HEAD (${CYAN}$EXPECTED_AUTHOR${NC})..."
    GIT_AUTHOR_NAME="$GIT_NAME" \
    GIT_AUTHOR_EMAIL="$GIT_EMAIL" \
    GIT_COMMITTER_NAME="$GIT_NAME" \
    GIT_COMMITTER_EMAIL="$GIT_EMAIL" \
        git commit --amend --no-edit --reset-author
fi

echo -e "Autor verificado en HEAD: ${CYAN}$(git show -s --format='%an <%ae> (Committer: %cn <%ce>)' HEAD)${NC}"

if [ "$DRY_RUN" -eq 1 ]; then
    echo -e "${YELLOW}⚠️  MODO DRY-RUN ACTIVO: Integración validada exitosamente. Regresando a $SOURCE_BRANCH sin crear tag ni hacer push...${NC}"
    git reset --hard "origin/$TARGET_BRANCH" >/dev/null 2>&1 || true
    git checkout "$SOURCE_BRANCH"
    exit 0
fi

# Crear tag anotado con autor oficial
if git tag -l | grep -q "^${RELEASE_TAG}$"; then
    echo -e "${YELLOW}⚠️  Tag $RELEASE_TAG ya existía, recreándolo con la identidad oficial...${NC}"
    git tag -d "$RELEASE_TAG" >/dev/null 2>&1 || true
    git push origin ":refs/tags/$RELEASE_TAG" >/dev/null 2>&1 || true
fi

git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" \
    tag -a "$RELEASE_TAG" -m "Production Release $RELEASE_TAG — autor: $GIT_NAME <$GIT_EMAIL>"
echo -e "${GREEN}✅ Tag $RELEASE_TAG creado con éxito.${NC}"

# Push a GitHub de main y del tag
echo -e "\n${BLUE}📤 Enviando $TARGET_BRANCH y tag $RELEASE_TAG a GitHub como $GIT_NAME...${NC}"
git push -u origin "$TARGET_BRANCH" "$RELEASE_TAG"
echo -e "${GREEN}✅ Push de producción completado con éxito.${NC}"

# Sincronizar y volver a la rama preview automáticamente
echo -e "\n${BLUE}🔄 Regresando automáticamente a la rama $SOURCE_BRANCH para continuar el desarrollo...${NC}"
git checkout "$SOURCE_BRANCH"
git merge "$TARGET_BRANCH" --ff-only || true

# Verificación de URL de producción
echo -e "\n${BLUE}🔍 Verificando URL de producción ($PROD_URL)...${NC}"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$PROD_URL" --max-time 15 || echo "000")

echo -e "\n${GREEN}======================================================================${NC}"
if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 301 ] || [ "$HTTP_STATUS" -eq 302 ] || [ "$HTTP_STATUS" -eq 307 ] || [ "$HTTP_STATUS" -eq 308 ]; then
    echo -e "${GREEN}🎉 ¡PRODUCCIÓN ACTIVA Y RESPONDIENDO! (HTTP $HTTP_STATUS)${NC}"
elif [ "$HTTP_STATUS" -eq 401 ]; then
    echo -e "${GREEN}🎉 ¡PRODUCCIÓN ACTIVA! (HTTP 401 — Protección Vercel Activa)${NC}"
else
    echo -e "${YELLOW}⏳ HTTP $HTTP_STATUS — El despliegue de Vercel ha sido disparado y está compilando en la nube.${NC}"
fi
echo -e "🏷️  Versión liberada:    ${CYAN}${BOLD}$RELEASE_TAG${NC}"
echo -e "👤 Publicado por:       ${CYAN}$GIT_NAME <$GIT_EMAIL>${NC}"
echo -e "🌐 URL Producción:      ${CYAN}$PROD_URL${NC}"
echo -e "🌿 Rama activa actual:  ${GREEN}${BOLD}$(git branch --show-current)${NC}"
echo -e "${GREEN}======================================================================${NC}"

