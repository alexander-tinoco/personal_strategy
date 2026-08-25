# Roadmap 2026

App local tipo Notion para seguir el [roadmap de estudio ago–dic 2026](docs/roadmap-final-ago-dic-2026.md): 9 libros, 4 certificaciones y 12 proyectos aplicados.

## Uso

1. Levantar la base de datos + API (Postgres en Docker, con volumen persistente):

   ```bash
   docker compose up -d
   ```

2. Levantar el frontend:

   ```bash
   npm install
   npm run dev
   ```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`). El backend escucha en `http://localhost:4000`; si querés apuntar el frontend a otra URL, definí `VITE_API_URL` antes de `npm run dev`.

Para apagar todo: `docker compose down` (esto NO borra los datos, viven en el volumen `roadmap_db_data`). Solo se perderían con `docker compose down -v`.

## Qué hace

- **Hoy**: libro(s) activo(s) con el ritmo de lectura necesario para hoy (se recalcula solo con lo que falta), checklist del proyecto activo con estado, formulario para registrar horas leídas, y botones para marcar el libro/proyecto como terminado.
- **Calendario**: grilla mensual navegable. Cada día muestra el libro y proyecto activos; al hacer clic se abre un panel con el detalle completo (ritmo, checklist, registrar horas, marcar terminado).
- Los 9 libros y sus 9 proyectos se leen/hacen en cadena: si terminás uno antes o después de lo planeado, el resto del calendario se recorre solo. Los 3 proyectos de certificación (Databricks, Docker+K8s, GCP) corren en paralelo con ventana propia.

## Persistencia

El progreso (horas leídas, checklist, libros/proyectos completados) se guarda en una base **Postgres corriendo en Docker** (`docker-compose.yml`), con un volumen (`roadmap_db_data`) que sobrevive a reinicios de la PC y a recrear los contenedores (`docker compose down` + `up`). Mientras no borres el volumen explícitamente (`docker compose down -v`), los datos quedan.

Si el backend no está corriendo, la barra lateral muestra "🔴 Sin conexión al backend" y los cambios no se guardan (solo viven en memoria de esa sesión del navegador). Además hay botones de **Exportar/Importar backup** (JSON) en la barra lateral, como respaldo manual adicional.

## Datos de duración de audiolibros

Verificados en Audible/Amazon en agosto 2026. *Software Architecture: The Hard Parts*, *Building Microservices* y *Designing Data-Intensive Applications* se confirmaron cruzando Audible con una segunda fuente porque el fetch directo a audible.com estuvo bloqueado durante la búsqueda. El detalle de horas, fuente y progreso de cada libro está en el panel de día del Calendario y en la sección Hoy.
