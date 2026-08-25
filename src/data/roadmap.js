// Datos extraídos de docs/roadmap-final-ago-dic-2026.md
// hours: duración total en horas (audiobook Audible cuando existe, si no estimado por páginas).
// Para "AI Engineering" hours = horas de lectura RESTANTES a hoy (25/08/2026), no la duración total.

export const books = [
  {
    id: 'ai-engineering',
    order: 1,
    title: 'AI Engineering',
    author: 'Chip Huyen',
    why: 'Base de sistemas con LLMs en producción',
    start: '2026-08-25',
    end: '2026-08-31',
    hours: 19,
    hoursIsRemaining: true,
    inProgress: true,
    source: 'Dato provisto por el usuario (horas restantes de lectura).',
  },
  {
    id: 'clean-code',
    order: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    why: 'Fundamentos de código mantenible',
    start: '2026-09-01',
    end: '2026-09-14',
    hours: 5.75, // 5h 45min
    source: 'Audible (narrador Theodore O\'Brien, Ascent Audio): 5h 45m.',
  },
  {
    id: 'pragmatic-programmer',
    order: 3,
    title: 'The Pragmatic Programmer (20th Anniversary Ed.)',
    author: 'David Thomas & Andrew Hunt',
    why: 'Hábitos y criterio de ingeniería',
    start: '2026-09-15',
    end: '2026-09-30',
    hours: 9.92, // 9h 55min
    source: 'Audible (narradora Anna Katarina): 9h 55m.',
  },
  {
    id: 'clean-architecture',
    order: 4,
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    why: 'Principios de diseño de sistemas',
    start: '2026-10-01',
    end: '2026-10-14',
    hours: 8.4, // 8h 24min
    source: 'Audible (narrador Theodore O\'Brien): 8h 24m.',
  },
  {
    id: 'hard-parts',
    order: 5,
    title: 'Software Architecture: The Hard Parts',
    author: 'Ford, Richards, Neal, Dehghani',
    why: 'Trade-offs arquitectónicos reales',
    start: '2026-10-15',
    end: '2026-10-31',
    hours: 12.88, // 12h 53min
    source: 'Audible (narradora Dena Dahilig): 12h 53m.',
  },
  {
    id: 'building-microservices',
    order: 6,
    title: 'Building Microservices (2nd Ed.)',
    author: 'Sam Newman',
    why: 'Arquitectura distribuida aplicada',
    start: '2026-11-01',
    end: '2026-11-14',
    hours: 21.25, // ~21h 15min
    source: 'Audible/Amazon (narrador Theodore O\'Brien), cruzado con audiobooksnow.com: ~21h 11-15m.',
  },
  {
    id: 'ddia',
    order: 7,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    why: 'Bases de datos + sistemas distribuidos (soporta Databricks)',
    start: '2026-11-15',
    end: '2026-12-07',
    hours: 20.93, // ~20h 56min (1ra edición, narrador Benjamin Lange)
    source: 'Audible (narrador Benjamin Lange, 1ra ed.): ~20h 56m. Existe 2da ed. 2024 (narr. Graham Mack) sin duración verificada.',
    densest: true,
  },
  {
    id: 'data-engineering-fundamentals',
    order: 8,
    title: 'Fundamentals of Data Engineering',
    author: 'Joe Reis & Matt Housley',
    why: 'Pipelines y arquitectura de datos moderna',
    start: '2026-12-08',
    end: '2026-12-14',
    hours: 17.52, // 17h 31min
    source: 'Audible (narrador Adam Verner): 17h 31m.',
  },
  {
    id: 'designing-ml-systems',
    order: 9,
    title: 'Designing Machine Learning Systems',
    author: 'Chip Huyen',
    why: 'MLOps y sistemas de ML en producción',
    start: '2026-12-15',
    end: '2026-12-21',
    hours: 12.92, // 12h 55min
    source: 'Audible (narradora Kathleen Li): 12h 55m.',
  },
]

// Ritmo diario elegido por el usuario (horas/día), distinto entre semana y
// sábado (domingo cuenta como día de semana). El resto del calendario
// (fechas de fin de libro/curso) se DERIVA de esto acumulando el ritmo de
// cada día hasta cubrir las horas totales — no es una simple división,
// porque el ritmo cambia el sábado.
export const dailyBudgetsByDay = {
  weekday: { reading: 2, course: 2, dev: 1 }, // lunes a viernes + domingo
  saturday: { reading: 1, course: 1, dev: 1 },
}

// order: define el orden de la cadena de cursos (GCP -> Databricks -> Docker+K8s,
// pedido explícito: Google antes que Databricks). hours: estimación total de horas
// de estudio (junto con el ritmo diario de curso define cuántos días le toma a cada uno).
// Terraform queda sin order/hours: es opcional y no está paceado.
export const certs = [
  {
    id: 'gcp',
    order: 1,
    title: 'Google Cloud — Associate Cloud Engineer / Professional Data Engineer',
    hours: 40,
    note: 'Va primero por pedido explícito: terminarlo antes que Databricks.',
    optional: false,
  },
  {
    id: 'databricks',
    order: 2,
    title: 'Databricks Certified Data Engineer Associate',
    hours: 40,
    note: 'Self-study: curso + labs + documentación oficial.',
    optional: false,
  },
  {
    id: 'docker-k8s',
    order: 3,
    title: 'Docker + Kubernetes (curso práctico)',
    hours: 15,
    note: 'Curso práctico, sin examen formal.',
    optional: false,
  },
  {
    id: 'terraform',
    title: 'HashiCorp Terraform Associate',
    hours: null,
    note: 'Opcional, sin horas asignadas — solo si sobra tiempo después de los otros tres.',
    optional: true,
  },
]

// Un proyecto aplicado por libro (mismo id + '-project') y uno por certificación.
export const projects = [
  {
    id: 'rag-assistant',
    order: 1,
    bookId: 'ai-engineering',
    title: 'Asistente RAG sobre documentos propios',
    objetivo: 'Aplicar conceptos de evaluación, retrieval, prompting y arquitectura de sistemas con LLMs.',
    start: '2026-08-25',
    end: '2026-08-31',
    requirements: [
      'Pipeline de ingestión de documentos propios',
      'Generación de embeddings',
      'Vector store funcionando',
      'Endpoint de consulta (chat/QA)',
      'Evaluación básica de calidad de respuestas',
    ],
    note: 'No hace falta fine-tuning ni UI elaborada.',
  },
  {
    id: 'refactor-project',
    order: 2,
    bookId: 'clean-code',
    title: 'Refactor de un proyecto propio existente',
    objetivo: 'Practicar nombres significativos, funciones pequeñas, eliminación de duplicación y código auto-explicativo.',
    start: '2026-09-01',
    end: '2026-09-14',
    requirements: [
      'Elegir un repo propio (idealmente "sucio") para refactorizar',
      'Nombres significativos y funciones pequeñas',
      'Eliminar duplicación de código',
      'Documentar antes/después en el README',
      'Métricas simples (líneas por función / complejidad ciclomática)',
    ],
  },
  {
    id: 'cli-tool',
    order: 3,
    bookId: 'pragmatic-programmer',
    title: 'CLI tool con buenas prácticas',
    objetivo: 'Aplicar DRY, "tracer bullets", manejo de errores y automatización.',
    start: '2026-09-15',
    end: '2026-09-30',
    requirements: [
      'CLI funcional (gestor de tareas / generador de changelogs / limpiador de archivos)',
      'Tests básicos',
      'Empaquetado (pip/npm)',
      'README claro',
    ],
    note: 'No necesita features extensas, sí buena base.',
  },
  {
    id: 'layered-app',
    order: 4,
    bookId: 'clean-architecture',
    title: 'Reestructurar una app en capas',
    objetivo: 'Entender la independencia de frameworks y la regla de dependencia.',
    start: '2026-10-01',
    end: '2026-10-14',
    requirements: [
      'Tomar el CLI o el proyecto refactorizado y reorganizarlo en capas (entidades, casos de uso, adaptadores, frameworks)',
      'Diagrama de capas en el README',
      'Separación real de carpetas/módulos',
      'Al menos un caso de uso testeado de forma aislada (sin DB ni framework real)',
    ],
  },
  {
    id: 'adr-prototype',
    order: 5,
    bookId: 'hard-parts',
    title: 'Documento de decisión arquitectónica (ADR) + prototipo',
    objetivo: 'Practicar el razonamiento de trade-offs arquitectónicos.',
    start: '2026-10-15',
    end: '2026-10-31',
    requirements: [
      'Elegir un problema real (ej. dividir un monolito, consistencia entre servicios)',
      '1-2 ADRs (Architecture Decision Records) escritos',
      'Prototipo mínimo que valide la decisión elegida',
    ],
  },
  {
    id: 'microservices-split',
    order: 6,
    bookId: 'building-microservices',
    title: 'Descomponer el monolito en 2-3 microservicios',
    objetivo: 'Aplicar boundaries de servicio, comunicación y despliegue independiente.',
    start: '2026-11-01',
    end: '2026-11-14',
    requirements: [
      'Partir un proyecto existente en 2-3 microservicios independientes',
      'Comunicación entre servicios (REST o mensajería)',
      'API gateway simple',
      'docker-compose para levantarlos juntos',
    ],
    note: 'No hace falta service mesh ni Kubernetes todavía (eso va en el proyecto de Docker/K8s).',
  },
  {
    id: 'replication-pipeline',
    order: 7,
    bookId: 'ddia',
    title: 'Pipeline con replicación/particionamiento',
    objetivo: 'Ver en la práctica consistencia, replicación y trade-offs de latencia/disponibilidad.',
    start: '2026-11-15',
    end: '2026-12-07',
    requirements: [
      'Entorno local en Docker',
      'Al menos un patrón implementado (réplica de lectura o partición por clave)',
      'Documento explicando qué garantías de consistencia ofrece el setup',
    ],
  },
  {
    id: 'etl-pipeline',
    order: 8,
    bookId: 'data-engineering-fundamentals',
    title: 'Pipeline ETL/ELT orquestado',
    objetivo: 'Aplicar el ciclo de vida de datos completo: ingestión, transformación, almacenamiento, orquestación.',
    start: '2026-12-08',
    end: '2026-12-14',
    requirements: [
      'Ingesta de datos desde una fuente (API pública o CSV)',
      'Transformación de datos',
      'Carga en un warehouse (BigQuery / Postgres / Delta Lake local)',
      'Orquestado con Airflow o un scheduler simple',
    ],
    note: 'Conecta directamente con la práctica de Databricks.',
  },
  {
    id: 'ml-serving',
    order: 9,
    bookId: 'designing-ml-systems',
    title: 'Modelo servido en producción con monitoreo',
    objetivo: 'Aplicar feature pipeline, serving, versionado de modelo y monitoreo básico de drift/performance.',
    start: '2026-12-15',
    end: '2026-12-21',
    requirements: [
      'Endpoint de inferencia (FastAPI o similar)',
      'Logging de predicciones',
      'Dashboard mínimo de métricas',
      'Versionado del modelo',
    ],
    note: 'El proyecto que mejor cierra el año: integra datos + ML + arquitectura.',
  },
  {
    id: 'databricks-pipeline',
    order: 10,
    certId: 'databricks',
    title: 'Pipeline de datos en Databricks',
    objetivo: 'Practicar Spark, Delta Lake, orquestación de jobs y buenas prácticas de la certificación.',
    start: '2026-09-01',
    end: '2026-10-30',
    requirements: [
      'Recrear el pipeline ETL del proyecto 8 sobre Databricks con Delta Lake',
      'Notebook(s) con ingestión, transformación y tablas Delta',
      'Job programado',
    ],
  },
  {
    id: 'k8s-deploy',
    order: 11,
    certId: 'docker-k8s',
    title: 'Contenerizar y orquestar los microservicios',
    objetivo: 'Practicar contenerización real, manifiestos de despliegue, servicios y escalado básico.',
    start: '2026-11-01',
    end: '2026-11-30',
    requirements: [
      'Cluster local (Minikube/Kind)',
      '2-3 microservicios desplegados',
      'Comunicación vía Service/Ingress',
    ],
    note: 'No hace falta cloud todavía, con local alcanza.',
  },
  {
    id: 'gcp-deploy',
    order: 12,
    certId: 'gcp',
    title: 'Despliegue de un componente en GCP',
    objetivo: 'Practicar servicios clave según la ruta elegida (BigQuery, Cloud Run, Dataflow, o IAM/Compute).',
    start: '2026-11-01',
    end: '2026-12-29',
    requirements: [
      'Migrar o desplegar una parte de un proyecto anterior a GCP',
      'Al menos un servicio corriendo en GCP',
      'Documentación de la arquitectura desplegada (diagrama simple + costos estimados)',
    ],
  },
]

export const periodStart = '2026-08-25'
export const periodEnd = '2026-12-31'
