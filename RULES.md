# Reglas y Guardrails Obligatorios // MEGAMERCADO

> Estas reglas aplican a todos los agentes de IA y desarrolladores que operen en `megamercado-vzla/apps`.

## 0. Guardrails de Git & Despliegue para Agentes de IA

1. **CERO FUSIONES AUTÓNOMAS (`git merge` / `git rebase` hacia `preview` o `main`):**
   * El agente trabaja exclusivamente en su rama `feature/*` o `fix/*`.
2. **CERO PUSH AUTÓNOMO A `preview` O `main`:**
   * La publicación a Vercel Preview y Producción se realiza únicamente cuando el usuario ejecuta los scripts oficiales en `scripts/env/`:
     * `./scripts/env/preview/publish-feature.sh`
     * `./scripts/env/preview/publish.sh`
     * `./scripts/env/production/deploy.sh`
3. **AUTORÍA EN COMMITS:**
   * En ramas `feature/*` y `fix/*` durante el trabajo local se usa la identidad Git real del desarrollador.
   * La autoría `retia-online <info@retia.online>` se aplica únicamente en los scripts de publicación para autorizar el build en Vercel.
4. **INTEGRIDAD DEL TRACKING UTM:**
   * Ningún formulario puede omitir el envío a `submitLeadToRetia()` ni eliminar la captura de UTMs / Click IDs en `src/main.tsx`.

