# Tour Weaver v1.5.1

Plataforma profesional para la creación y exhibición de tours virtuales 360°. Unificada con auditoría de seguridad integral, soporte SEO dinámico y compartición inteligente mediante códigos QR.

### Características v1.5.1:
- **Blindaje CSP Estricto**: Eliminación total de `'unsafe-eval'` y endurecimiento de políticas de ejecución de scripts para máxima protección contra XSS.
- **Validación de Integridad en DB**: Reglas de Firestore reforzadas con verificaciones de existencia (`exists()`) para garantizar que las métricas de visitas correspondan a propiedades reales.
- **Seguridad Auditada (OWASP ZAP)**: Implementación de cabeceras de seguridad avanzadas (`Content-Security-Policy`, `X-Frame-Options`, `Permissions-Policy`, `HSTS`) para protección contra inyección y clickjacking.
- **Optimización de Despliegue**: Configuración nativa de infraestructura mediante `render.yaml` con escalado inteligente (3 instancias) para resiliencia DoS.
- **Privacidad Administrativa**: Ofuscación de errores de autenticación y persistencia de sesión volátil (`browserSessionPersistence`).
- **SEO Inmobiliario Avanzado**: Estructura dinámica de metadatos para previsualizaciones de alta fidelidad en redes sociales.
- **Integridad Referencial**: Limpieza automática de hotspots huérfanos y registro de unicidad de Slugs atómico.
