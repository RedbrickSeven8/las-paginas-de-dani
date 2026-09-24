# PROJECT_MAP.md - Arquitectura del Proyecto: Las Páginas de Dani

## 1. Topología del Proyecto (Mermaid Graph)

```mermaid
flowchart TD
    subgraph Client ["Frontend Architecture (SPA / Vanilla Modular)"]
        HTML["index.html\n(HTML5 Semántico, SEO, OpenGraph, Schema.org)"]
        LEGAL_HTML["tratamiento-de-datos.html\n(Marco Legal Habeas Data Ley 1581/2012)"]
        
        subgraph Styles ["Módulo de Estilos (CSS Modular)"]
            MAIN_CSS["css/main.css\n(Variables, Reset anti-desbordamiento, Utility Classes)"]
            ANIM_CSS["css/animations.css\n(Keyframes, Transiciones, Hover Effects)"]
            COMP_CSS["css/components.css\n(Navbar Glassmorphism, Iframe Portafolio, Cookie Banner, Floating WA)"]
        end

        subgraph Scripts ["Módulo de Lógica JS (Separación de Incumbencias)"]
            APP_JS["js/app.js\n(Inicialización de módulos y ciclo de vida)"]
            NAV_JS["js/navigation.js\n(Scroll spy, Sticky Header, Mobile Drawer derecho)"]
            ANIM_JS["js/animations.js\n(ScrollObserver, Entrada/Salida, Lazy Animation)"]
            PRICING_JS["js/pricing.js\n(Selector de planes, FAQ Accordion)"]
            WHATSAPP_JS["js/whatsapp-modal.js\n(Captura Nombre + Dropdown Planes -> Formsubmit Email -> WhatsApp API +57 3058921629)"]
            COOKIES_JS["js/cookies.js\n(Banner no invasivo de cookies con persistencia)"]
            LAZY_JS["js/lazy-media.js\n(IntersectionObserver para imágenes y iframes)"]
        end

        subgraph Assets ["Recursos Estáticos"]
            IMG_LOGO["assets/images/logo.svg & logo-white.svg"]
            IMG_HERO["assets/images/hero-mockup.svg"]
            ICONS["assets/icons/* & SVG WhatsApp Sprite"]
        end

        HTML --> MAIN_CSS & ANIM_CSS & COMP_CSS
        LEGAL_HTML --> MAIN_CSS & ANIM_CSS & COMP_CSS
        HTML --> APP_JS
        APP_JS --> NAV_JS & ANIM_JS & PRICING_JS & WHATSAPP_JS & COOKIES_JS & LAZY_JS
        HTML --> IMG_LOGO & IMG_HERO & ICONS
    end

    subgraph External ["Integraciones y Servicios Externos"]
        FONTS["Google Fonts (Plus Jakarta Sans & Outfit)"]
        WHATSAPP_API["WhatsApp Direct: +57 3058921629"]
        EMAIL_DISPATCH["Email Dispatch: danicamarillo5215@gmail.com"]
        IFRAME_LIVE["Iframes Portafolio en Vivo (Gave, Impacto, Nexplay)"]
        SURGE_HOST["Surge.sh Hosting (las-paginas-de-dani.surge.sh)"]
        GITHUB_REPO["GitHub Repo (RedbrickSeven8/las-paginas-de-dani)"]
        GHA_WORKFLOW[".github/workflows/deploy.yml\n(Auto-Deploy en Surge en cada Push)"]
    end

    HTML -.-> FONTS
    HTML -.-> IFRAME_LIVE
    WHATSAPP_JS -.-> WHATSAPP_API
    WHATSAPP_JS -.-> EMAIL_DISPATCH
    GITHUB_REPO --> GHA_WORKFLOW --> SURGE_HOST
```

## 2. Nodos y Componentes

| Archivo / Carpeta | Responsabilidad |
|---|---|
| `index.html` | Estructura semántica completa (Header con fondo de alta gama, Hero, Beneficios con iconos llamativos, Servicios con botones de WhatsApp, Portafolio en vivo con Iframes ampliados, Proceso 24h en 3 pasos, FAQ, Horario actualizado, Modal Nombre+Planes, Botón flotante de WhatsApp fijo y Cookie Banner no invasivo). |
| `tratamiento-de-datos.html` | Documento legal completo de Política de Tratamiento de Datos Personales conforme a la Ley 1581 de 2012 de Colombia. |
| `css/main.css` | Design tokens, reset estricto anti-desbordamiento horizontal (`overflow-x: hidden`), botones con icono WhatsApp y tipografía responsiva. |
| `css/components.css` | Header con gradiente glassmorphism oscuro y línea superior animada, iframes en contenedores de 520px de altura con barra de navegador, menú hamburguesa alineado a la derecha, botón flotante de WhatsApp fijado con `position: fixed !important` y banner de cookies discreto. |
| `css/animations.css` | Keyframes de scroll reveal, float, pulse de WhatsApp y animaciones para modales. |
| `js/whatsapp-modal.js` | Modal simplificado (Nombre + Selección de Planes). Pre-selección inteligente según el botón pulsado en la web/portafolio, envío de datos a `danicamarillo5215@gmail.com` y redirección inmediata a WhatsApp (`+57 3058921629`). |
| `js/cookies.js` | Manejador de consentimiento de cookies no invasivo con almacenamiento en `localStorage`. |
| `js/navigation.js` | Navegación responsiva, scrollspy y menú móvil optimizado. |
| `.github/workflows/deploy.yml` | Integración continua con GitHub Actions para despliegue instantáneo en Surge.sh con cada push. |
