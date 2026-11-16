# Protocolo de Operación para Agentes de IA // MEGAMERCADO

> **DESTINATARIOS:** Agentes Autónomos de Codificación (Google Antigravity, Claude Code, Cursor, Copilot Workspace) y desarrolladores de par con IA.  
> **ÁMBITO:** Repositorio web de MegaMercado (`megamercado-vzla/apps`).

---

## 1. Misión del Agente

Tu propósito en este repositorio es desarrollar, mantener y escalar la plataforma web y landing de **MegaMercado**, garantizando la captura de leads hacia el Orquestador Central de **RETIA** (`/api/leads/megamercado` con trazabilidad UTM y Click IDs) y el respeto estricto al protocolo de ramas, autoría y despliegue en Vercel.

---

## 2. Mapa Rápido del Repositorio

```text
megamercado/apps/
├── src/
│   ├── components/              # Secciones visuales, modales y formularios
│   ├── data/                    # Catálogos, validadores y tests unitarios
│   ├── lib/
│   │   └── retiaLeads.ts        # Cliente UTM Tracker + Orquestador Retia (/api/leads/megamercado)
│   ├── assets/images/           # Recursos visuales optimizados
│   ├── App.tsx                  # Composición principal de la landing
│   └── main.tsx                 # Punto de entrada e inicialización de tracking UTM
├── public/                      # Activos estáticos (SVG, logos)
├── scripts/
│   └── env/
│       ├── preview/
│       │   ├── publish-feature.sh   # Publicación aislada de rama feature/* o fix/* en Vercel Preview
│       │   └── publish.sh           # Integración y publicación en rama preview
│       └── production/
│           └── deploy.sh            # Promoción a producción (main + tag semántico vX.Y.Z)
├── vercel.json                  # Configuración de build Vite, rewrite SPA y ramas habilitadas
├── AGENTS.md                    # Protocolo operativo para agentes
└── RULES.md                     # Guardrails obligatorios de Git y despliegue
```

---

## 3. Flujo Git & Reglas de Despliegue Obligatorias

> ⚠️ **PROHIBICIÓN ESTRICTA PARA AGENTES DE IA:**
> 1. **CERO FUSIONES AUTÓNOMAS:** Los agentes tienen **ESTRICTAMENTE PROHIBIDO** hacer `git merge`, `git rebase` o integrar ramas hacia `preview` o `main` sin solicitud y aprobación explícita del usuario.
> 2. **CERO PUSH AUTÓNOMO A PREVIEW O MAIN:** Los agentes **NUNCA** hacen `git push` a `origin preview` ni a `origin main`. La integración y publicación hacia staging y producción es potestad exclusiva del usuario a través de los scripts oficiales.
> 3. **NO SUPLANTAR IDENTIDAD EN DESARROLLO LOCAL:** Todos los commits realizados por el agente en ramas de trabajo (`feature/*` o `fix/*`) deben usar la identidad real del desarrollador local (`git config user.name` / `git config user.email`). **PROHIBIDO** forzar `retia-online <info@retia.online>` en commits de trabajo rutinario.
> 4. **TRABAJO LOCAL POR DEFECTO:** Todos los cambios del agente permanecen en la rama de trabajo local (`feature/*` o `fix/*`). El agente valida tipos con `npm run lint` y pruebas unitarias.

1. **Ramas Principales:**
   * **`feature/<task-id>-<slug>` o `fix/<task-id>-<slug>`:** Ramas de trabajo donde opera el agente.
   * **`preview`:** Rama de Staging. **El agente no toca ni fusiona sobre preview.** Solo el usuario la actualiza y publica cuando lo decide.
   * **`main`:** Rama protegida de **Producción**. **NUNCA** hagas commits ni fusiones directas sobre `main`.

2. **Scripts Oficiales de Publicación y Despliegue (EJECUTADOS POR EL USUARIO):**
   * **Para publicar una rama `feature/*` o `fix/*` individual en Vercel Preview:**
     ```bash
     ./scripts/env/preview/publish-feature.sh [-m "mensaje opcional"]
     ```
     *(Ajusta la autoría remota a `retia-online <info@retia.online>` para que Vercel active el preview de la rama sin tocar `preview` ni `main`).*
   * **Para publicar la rama `preview` en Vercel:**
     ```bash
     ./scripts/env/preview/publish.sh [-m "mensaje opcional"]
     ```
   * **Para promover a Producción (`main`):**
     ```bash
     ./scripts/env/production/deploy.sh [--tag v1.0.0]
     ```

3. **Formato Canónico de Commits (Conventional Commits):**
   * `feat: ...` para nuevas funcionalidades.
   * `fix: ...` para corrección de bugs.
   * `docs: ...` para cambios de documentación.
   * `chore: ...` para mantenimiento, configuración o dependencias.

---

## 4. Integración de Formularios con el Orquestador RETIA

* Todo formulario de la landing debe enviar sus datos a través de `submitLeadToRetia` en `src/lib/retiaLeads.ts` hacia:
  * `POST https://api.retia.online/api/leads/megamercado` (configurable con `VITE_RETIA_ORCHESTRATOR_URL` y `VITE_RETIA_CLIENT_SLUG`).
* Al cargar la aplicación (`src/main.tsx`), `captureRetiaTracking()` captura y persiste en `sessionStorage` y `localStorage` (`retia_tracking_ctx`) los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` y los Click IDs (`gclid`, `fbclid`, `ttclid`, `msclkid`), junto con `first_landing_url`, `last_page_url` y `referrer`.
* El orquestador de Retia requiere obligatoriamente `name` y `phone` en todo lead.

---

## 5. Verificación Local (Node 20)

Este proyecto utiliza Vite 8 y requiere Node `v20.19.0+` (ej. `v20.20.2` vía `nvm`).

```bash
# Verificación estática de tipos TypeScript
npm run lint

# Pruebas unitarias de negocio y validadores
node --experimental-strip-types --test src/data/businessPlan.test.ts
```

