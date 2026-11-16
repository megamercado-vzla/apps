#!/usr/bin/env bash

# ==============================================================================
# Script de Publicación para Ramas Feature / Fix (Vercel) - MEGAMERCADO
# Ubicación: scripts/env/preview/publish-feature.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
EXPECTED_REPOSITORY="megamercado-vzla/apps"

# Identidad requerida por Vercel para autorizar el build
GIT_NAME="retia-online"
GIT_EMAIL="info@retia.online"

COMMIT_MSG=""
DRY_RUN=0

usage() {
    cat <<'EOF'
Uso:
  ./scripts/env/preview/publish-feature.sh [-m "mensaje"] [--dry-run]

Publica la rama feature/* o fix/* actual en GitHub con autoría oficial para
que Vercel genere un despliegue de vista previa aislado para esta rama.

Opciones:
  -m, --message   Mensaje de commit opcional para los cambios locales pendientes.
  --dry-run       Simula la operación sin realizar push a GitHub.
  -h, --help      Muestra esta ayuda.
EOF
}

die() {
    printf 'ERROR: %s\n' "$*" >&2
    exit 1
}

while [ "$#" -gt 0 ]; do
    case "$1" in
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
            die "Argumento desconocido: $1. Usa --help para ver las opciones."
            ;;
    esac
done

command -v git >/dev/null 2>&1 || die "Git no está instalado."
cd "$PROJECT_ROOT"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "No se encontró un repositorio Git."

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || echo "")"

if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "HEAD" ]; then
    die "No estás en una rama válida."
fi

if [ "$CURRENT_BRANCH" = "main" ]; then
    die "PROHIBIDO publicar directamente en 'main' con este script. Usa scripts/env/production/deploy.sh."
fi

printf '📌 Rama activa a publicar (%s): %s\n' "$EXPECTED_REPOSITORY" "$CURRENT_BRANCH"

# Confirmar cambios pendientes si existen
if [ -n "$(git status --porcelain)" ]; then
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="feat(${CURRENT_BRANCH}): update feature work"
    fi
    printf 'Confirmando cambios locales pendientes como %s <%s>...\n' "$GIT_NAME" "$GIT_EMAIL"
    git add .
    git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" commit -m "$COMMIT_MSG"
fi

# Asegurar autoría oficial en HEAD para que Vercel autorice el build
EXPECTED_AUTHOR="$GIT_NAME <$GIT_EMAIL>"
LATEST_AUTHOR="$(git show -s --format='%an <%ae>' HEAD)"

if [ "$LATEST_AUTHOR" != "$EXPECTED_AUTHOR" ]; then
    printf 'Ajustando autoría de HEAD para Vercel (%s)...\n' "$EXPECTED_AUTHOR"
    GIT_AUTHOR_NAME="$GIT_NAME" \
    GIT_AUTHOR_EMAIL="$GIT_EMAIL" \
    GIT_COMMITTER_NAME="$GIT_NAME" \
    GIT_COMMITTER_EMAIL="$GIT_EMAIL" \
        git commit --amend --no-edit --reset-author
fi

if [ "$DRY_RUN" -eq 1 ]; then
    printf 'DRY-RUN: Simulando git push origin %s...\n' "$CURRENT_BRANCH"
    git push --dry-run -u origin "$CURRENT_BRANCH"
    exit 0
fi

printf '📤 Enviando rama %s a origin...\n' "$CURRENT_BRANCH"
git push -u origin "$CURRENT_BRANCH"

printf '🚀 Publicación exitosa de la rama %s en GitHub.\n' "$CURRENT_BRANCH"
printf 'Vercel procesará el despliegue de Preview para esta rama.\n'

