# Roadmap Final 2026 — Perfil Software/ML/Platform Engineer

**Periodo:** 25 agosto — 31 diciembre 2026 (~18 semanas)

---

## Libros (9, en orden de lectura)

| # | Libro | Autor | Por qué |
|---|---|---|---|
| 1 | AI Engineering *(en curso)* | Chip Huyen | Base de sistemas con LLMs en producción |
| 2 | Clean Code | Robert C. Martin | Fundamentos de código mantenible |
| 3 | The Pragmatic Programmer | Thomas & Hunt | Hábitos y criterio de ingeniería |
| 4 | Clean Architecture | Robert C. Martin | Principios de diseño de sistemas |
| 5 | Software Architecture: The Hard Parts | Ford, Richards, Neal, Dehghani | Trade-offs arquitectónicos reales |
| 6 | Building Microservices | Sam Newman | Arquitectura distribuida aplicada |
| 7 | Designing Data-Intensive Applications | Martin Kleppmann | Bases de datos + sistemas distribuidos (soporta Databricks) |
| 8 | Fundamentals of Data Engineering | Reis & Housley | Pipelines y arquitectura de datos moderna |
| 9 | Designing Machine Learning Systems | Chip Huyen | MLOps y sistemas de ML en producción |

## Certificaciones / Cursos (en paralelo)

1. **Databricks Certified Data Engineer Associate**
2. **Google Cloud — Associate Cloud Engineer / Professional Data Engineer**
3. **Docker + Kubernetes** (curso práctico)
4. *(Opcional, diciembre)* **HashiCorp Terraform Associate**

---

## Cronograma mes a mes

### Agosto (25–31) — Cierre
- Terminar **AI Engineering**

### Septiembre — Fundamentos de código
- Semana 1-2: **Clean Code**
- Semana 3-4: **The Pragmatic Programmer**
- En paralelo: empezar a estudiar para **Databricks Data Engineer Associate**

### Octubre — Arquitectura
- Semana 1-2: **Clean Architecture**
- Semana 3-4: **Software Architecture: The Hard Parts**
- En paralelo: terminar prep de Databricks → **rendir el examen a fin de mes**

### Noviembre — Sistemas distribuidos y datos
- Semana 1-2: **Building Microservices**
- Semana 3-4: **Designing Data-Intensive Applications** (puede extenderse a diciembre)
- En paralelo: arrancar curso de **Docker + Kubernetes**

### Diciembre — Datos, ML y cierre de certificación
- Semana 1: terminar **Designing Data-Intensive Applications**
- Semana 2: **Fundamentals of Data Engineering**
- Semana 3: **Designing Machine Learning Systems**
- Semana 4: repaso + **rendir examen de GCP**

---

## Proyectos aplicados (uno por libro/curso)

La idea: cada lectura o certificación termina con algo tangible en tu portafolio/GitHub, no solo con notas.

### 1. AI Engineering → **Asistente RAG sobre documentos propios**
- **Idea:** Un chatbot que responde preguntas sobre un set de documentos (ej. tus propios apuntes o documentación técnica de un proyecto).
- **Objetivo:** Aplicar los conceptos de evaluación, retrieval, prompting y arquitectura de sistemas con LLMs que cubre el libro.
- **Alcance:** Pipeline de ingestión + embeddings + vector store + endpoint de consulta + una evaluación básica de calidad de respuestas (no hace falta fine-tuning ni UI elaborada).

### 2. Clean Code → **Refactor de un proyecto propio existente**
- **Idea:** Tomar un repo tuyo (idealmente uno "sucio" de hace tiempo) y refactorizarlo.
- **Objetivo:** Practicar nombres significativos, funciones pequeñas, eliminación de duplicación y código auto-explicativo.
- **Alcance:** Antes/después documentado en el README del repo, con métricas simples (líneas por función, complejidad ciclomática si quieres usar una herramienta de linting).

### 3. The Pragmatic Programmer → **CLI tool con buenas prácticas**
- **Idea:** Una herramienta de línea de comandos pequeña y útil para ti (ej. un gestor de tareas, un generador de changelogs, un limpiador de archivos).
- **Objetivo:** Aplicar DRY, "tracer bullets" (construir de punta a punta rápido), manejo de errores y automatización.
- **Alcance:** CLI funcional con tests básicos, empaquetado (pip/npm) y README claro. No necesita features extensas, sí buena base.

### 4. Clean Architecture → **Reestructurar una app en capas**
- **Idea:** Tomar el CLI o el proyecto refactorizado del punto 2 y reorganizarlo en capas (entidades, casos de uso, adaptadores, frameworks).
- **Objetivo:** Entender de forma práctica la independencia de frameworks y la regla de dependencia.
- **Alcance:** Diagrama de capas en el README + separación real de carpetas/módulos + al menos un caso de uso testeado de forma aislada (sin DB ni framework real).

### 5. Software Architecture: The Hard Parts → **Documento de decisión arquitectónica (ADR) + prototipo**
- **Idea:** Elegir un problema real (ej. cómo dividir un monolito, cómo manejar consistencia entre dos servicios) y documentar el trade-off como lo haría un arquitecto.
- **Objetivo:** Practicar el razonamiento de trade-offs (no hay solución perfecta, hay decisiones con costos).
- **Alcance:** 1-2 ADRs (Architecture Decision Records) escritos + un prototipo mínimo que valide la decisión elegida (no todo el sistema, solo la parte crítica de la decisión).

### 6. Building Microservices → **Descomponer el monolito en 2-3 microservicios**
- **Idea:** Partir el proyecto de los puntos 2/4 (o uno nuevo simple) en microservicios independientes con comunicación entre ellos.
- **Objetivo:** Aplicar boundaries de servicio, comunicación (REST o mensajería), y despliegue independiente.
- **Alcance:** 2-3 servicios pequeños + un API gateway simple + docker-compose para levantarlos juntos. No hace falta service mesh ni Kubernetes todavía (eso viene en el proyecto de Docker/K8s).

### 7. Designing Data-Intensive Applications → **Pipeline con replicación/particionamiento**
- **Idea:** Montar un sistema simple que use una base de datos con réplicas o particionamiento (ej. Postgres con réplica de lectura, o un pequeño setup con Kafka para streaming).
- **Objetivo:** Ver en la práctica consistencia, replicación y trade-offs de latencia/disponibilidad que explica Kleppmann.
- **Alcance:** Entorno local (Docker) con al menos un patrón implementado (réplica de lectura, o partición por clave) y un documento explicando qué garantías de consistencia ofrece tu setup.

### 8. Fundamentals of Data Engineering → **Pipeline ETL/ELT orquestado**
- **Idea:** Pipeline que ingiere datos de una fuente (API pública o CSV), los transforma y los carga en un warehouse.
- **Objetivo:** Aplicar el ciclo de vida de datos completo: ingestión, transformación, almacenamiento, orquestación.
- **Alcance:** Orquestado con Airflow (o un scheduler simple), destino en BigQuery o un Postgres/Delta Lake local. Este proyecto conecta directamente con la práctica de Databricks.

### 9. Designing Machine Learning Systems → **Modelo servido en producción con monitoreo**
- **Idea:** Tomar un modelo simple (clasificación o regresión) y llevarlo a producción de verdad, no solo un notebook.
- **Objetivo:** Aplicar feature pipeline, serving, versionado de modelo y monitoreo básico de drift/performance.
- **Alcance:** Endpoint de inferencia (FastAPI o similar) + logging de predicciones + un dashboard mínimo de métricas. Es el proyecto que mejor cierra el año, integrando datos + ML + arquitectura.

---

### Databricks Certified Data Engineer Associate → **Pipeline de datos en Databricks**
- **Idea:** Recrear el pipeline ETL del proyecto 8, pero corriendo sobre Databricks con Delta Lake.
- **Objetivo:** Practicar Spark, Delta Lake, orquestación de jobs y buenas prácticas de la certificación en un entorno real.
- **Alcance:** Notebook(s) con ingestión, transformación y tablas Delta, más un job programado. Sirve como evidencia práctica además del examen.

### Google Cloud (Associate Cloud Engineer / Data Engineer) → **Despliegue de un componente en GCP**
- **Idea:** Migrar o desplegar una parte de tus proyectos anteriores (ej. el endpoint de ML del proyecto 9, o el pipeline de datos) a GCP.
- **Objetivo:** Practicar servicios clave según la ruta elegida (BigQuery, Cloud Run, Dataflow, o IAM/Compute si es Cloud Engineer).
- **Alcance:** Al menos un servicio corriendo en GCP con documentación de la arquitectura desplegada (diagrama simple + costos estimados).

### Docker + Kubernetes → **Contenerizar y orquestar los microservicios**
- **Idea:** Tomar el proyecto de microservicios (punto 6) y llevarlo a Kubernetes.
- **Objetivo:** Practicar contenerización real, manifiestos de despliegue, servicios y escalado básico.
- **Alcance:** Cluster local (Minikube/Kind) con los 2-3 microservicios desplegados, comunicándose vía Service/Ingress. No hace falta cloud todavía, con local es suficiente para aprender.

---

## Notas prácticas

- **No leas/estudies todo sin aplicar.** El objetivo de esta versión del roadmap es que en diciembre tengas ~10-12 proyectos reales en tu GitHub, no solo libros leídos.
- **Los proyectos no tienen que ser perfectos ni grandes.** El alcance está definido a propósito para que sean completables en 1-2 semanas cada uno, en paralelo a la lectura.
- **Reutiliza proyectos entre sí.** Verás que varios proyectos parten del mismo código base (CLI → capas → microservicios → Kubernetes). Esto es intencional: simula cómo evoluciona un sistema real y te ahorra tiempo.
- **Los exámenes de certificación son los checkpoints duros** — fin de octubre para Databricks, fin de diciembre para GCP.
- **Designing Data-Intensive Applications es el libro más denso** — si se atrasa, está bien que se extienda a la primera semana de diciembre.
- Al final de diciembre tendrás: 2 certificaciones cloud/data, 9 libros cubriendo código limpio, arquitectura, sistemas distribuidos, datos y ML, y ~12 proyectos aplicados — un perfil competitivo para roles de **Backend/Platform Engineer con orientación a datos y ML**.
