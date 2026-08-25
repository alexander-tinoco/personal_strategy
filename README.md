# Roadmap 2026

App local tipo Notion para seguir el [roadmap de estudio ago–dic 2026](docs/roadmap-final-ago-dic-2026.md): 9 libros, 4 certificaciones y 12 proyectos aplicados.

## Uso

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Qué hace

- **Hoy**: libro(s) activo(s) con el ritmo de lectura necesario para hoy (se recalcula solo con los días restantes), checklist del proyecto activo, y un formulario para registrar horas leídas.
- **Calendario**: día por día desde hoy hasta el 31 de diciembre, con el ritmo planeado y el proyecto de cada fecha.
- **Libros**: las 9 lecturas con duración (verificada en Audible), progreso y fuente de cada dato.
- **Proyectos**: los 12 proyectos aplicados con su checklist de requisitos ("Alcance" del roadmap).
- **Certificaciones**: Databricks, GCP, Docker+K8s y Terraform (opcional), con fechas de examen.
- **Roadmap original**: el markdown fuente, sin editar.

El progreso (horas registradas y checkboxes) se guarda en `localStorage` del navegador — es local a esta máquina/navegador, no se sincroniza.

## Datos de duración de audiolibros

Verificados en Audible/Amazon en agosto 2026 (ver columna "Fuente" en la vista Libros). *Software Architecture: The Hard Parts*, *Building Microservices* y *Designing Data-Intensive Applications* se confirmaron cruzando Audible con una segunda fuente porque el fetch directo a audible.com estuvo bloqueado durante la búsqueda.
