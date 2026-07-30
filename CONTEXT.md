# Contexto de la Aplicación: FitPulse

**FitPulse** es una aplicación web de entrenamiento y gestión de rutinas de gimnasio optimizada con un enfoque **Mobile-First**. Está diseñada para una experiencia fluida e intuitiva mediante gestos táctiles con una sola mano en smartphones, preparada para ser empaquetada como App móvil nativa mediante **CapacitorJS**.

---

## 🛠️ Stack Tecnológico

1. **Framework Base**: [Astro](https://astro.build/) (v6.4+) con la integración de React para islas interactivas.
2. **Biblioteca de UI**: [React](https://react.dev/) (v19) para toda la lógica interactiva.
3. **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) configurado como plugin de Vite (`@tailwindcss/vite`), con una base de diseño premium de estilo oscuro y acentos lima.
4. **Estado Global**: [Zustand](https://zustand.docs.pmnd.rs/) (v5.0+) sincronizado de manera reactiva con la base de datos en la nube.
5. **Base de Datos & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Supabase Auth) para persistencia multi-dispositivo y autenticación segura con Google OAuth.
6. **Iconografía**: `lucide-react` para iconos interactivos limpios y consistentes.

---

## 📂 Estructura de Directorios y Archivos

A continuación se detalla la función de cada archivo en el proyecto bajo `src/`:

```text
src/
├── data/
│   └── exercises.js          # Catálogo de 38 ejercicios con descripción, pasos de ejecución, consejos, dificultad y equipamiento. Colores por grupo muscular.
├── db/
│   └── supabase.js           # Inicialización del cliente de Supabase con fallback de variables de entorno.
├── layouts/
│   └── MobileLayout.astro    # Layout base móvil con importación de tipografía 'Inter', metatags y el AppInitializer.
├── pages/                    # Enrutamiento estático de Astro
│   ├── index.astro           # Ruta raíz: Renderiza <RoutineManager client:only="react" /> (Vista de Inicio).
│   ├── workout.astro         # Vista activa del entrenamiento: Renderiza <WorkoutActive client:only="react" />.
│   ├── history.astro         # Vista de historial de entrenamientos: Renderiza <HistoryView client:only="react" />.
│   ├── stats.astro           # Vista de estadísticas y Récords Personales: Renderiza <StatsView client:only="react" />.
│   ├── settings.astro        # Vista de ajustes globales: Renderiza <SettingsView client:only="react" />.
│   └── login.astro           # Vista de login: Renderiza <GoogleLogin client:only="react" />.
├── store/
│   └── useGymStore.js        # Estado global de la app (Zustand sincronizado en tiempo real con Supabase).
├── styles/
│   └── global.css            # Archivo global de Tailwind CSS v4, animaciones CSS personalizadas y variables de tema.
└── components/               # Componentes React (Islas interactivas)
    ├── AppInitializer.jsx   # Inicializa la sesión, sincroniza el tema visual y renderiza la pantalla de carga de FitPulse.
    ├── BottomNav.jsx         # Barra de navegación inferior móvil persistente y reactiva.
    ├── ProfileHeader.jsx     # Encabezado del dashboard que saluda según la hora y muestra la foto de perfil de Google.
    ├── GoogleLogin.jsx       # Interfaz de inicio de sesión con Google OAuth mediante Supabase.
    ├── RoutineManager.jsx    # Dashboard de rutinas con CRUD rápido, tarjetas dinámicas y banner de sesión activa.
    ├── RoutineEditor.jsx     # Editor interactivo y detallado de rutinas (agregar/quitar ejercicios, series, reps, peso/tiempo).
    ├── ExerciseSelector.jsx  # Selector de ejercicios modal con fotos, badges de dificultad y acceso directo a ficha técnica.
    ├── ExerciseDetail.jsx    # Ficha técnica completa: foto hero, figura anatómica, pasos de ejecución y consejos.
    ├── BodyFigure.jsx        # Figura anatómica SVG (frontal/dorsal) con resaltado por grupo muscular. Reemplaza las imágenes webp de músculos.
    ├── WorkoutActive.jsx     # Panel de entrenamiento en ejecución con figura muscular de fondo y botón "¿cómo se hace?".
    ├── Timer.jsx             # Temporizador de descanso en pantalla completa con controles rápidos.
    ├── HistoryView.jsx       # Historial de entrenamientos con desglose de volumen total y series.
    ├── StatsView.jsx         # Gráficas semanales, calendario de consistencia mensual, PRs y resúmenes de rendimiento.
    └── SettingsView.jsx      # Configuración de unidades (kg/lbs), descanso, temas visuales y cierre de sesión.
```

---

## 💾 Persistencia y Estado Global (`store/useGymStore.js`)

El estado local en Zustand actúa como fuente de verdad instantánea para garantizar que la UI se sienta fluida e instantánea. Paralelamente, todas las modificaciones se propagan de forma asíncrona a Supabase para su almacenamiento en la nube y sincronización multi-dispositivo.

### Esquema de Datos en Supabase (PostgreSQL):

1. **`profiles`**: Almacena los ajustes del usuario (`theme`, `rest_duration`, `weight_unit`, `weight_increment`, `weekly_goal`, `default_sets`, `default_reps`, `default_duration`). Se crea automáticamente al registrarse a través de un trigger de base de datos.
2. **`routines`**: Colección de rutinas del usuario con su respectiva lista de ejercicios en formato JSONB. Si un nuevo usuario inicia sesión por primera vez, el frontend autosembrarás las 3 rutinas por defecto (Empuje, Tirón, Pierna) en Supabase.
3. **`workouts_history`**: Registro cronológico de todos los entrenamientos finalizados con sus detalles y series completadas.
4. **`personal_records`**: Historial de récords personales por ejercicio (`max_weight`, `max_volume`), actualizados en la base de datos tras finalizar cada entreno.

### Lógica de Estadísticas y Calorías Dinámicas:

- **`calculateRecordStreak(history)`**: Calcula la racha máxima histórica real del usuario leyendo dinámicamente los entrenamientos en Supabase en lugar de usar un valor estático.
- **`getExerciseCalories(ex)`**: Fórmula matemática que estima kilocalorías quemadas según sets, duración y grupo muscular (ej. Cardio ~10 kcal/min, Pecho/Espalda/Pierna ~6 kcal/set, etc.).
- **`getRoutineStats(routine, restDuration)`**: Suma el consumo calórico de todos sus ejercicios y proyecta la duración estimada en minutos de la rutina basándose en descansos.

### Inicialización y Seguridad:

- El componente `AppInitializer` comprueba el estado de la sesión de Supabase al arrancar la app. Si la sesión existe, descarga en paralelo todos los datos del usuario e inhabilita la pantalla de carga. Si no existe sesión, redirige de inmediato a `/login`.
- Todas las tablas en Supabase tienen habilitado **Row Level Security (RLS)** y políticas estrictas vinculadas al ID del usuario autenticado (`auth.uid() = user_id` o `auth.uid() = id`).

---

## 🎨 Sistema de Diseño y Estilos

El diseño es premium, inmersivo y responsivo, enfocado en el uso táctil en móviles.

- **Paleta de Colores Inteligente y Reactiva**:
  - **Fondo base**: Oscuro puro (`#0a0a0f` o `slate-950`).
  - **Color primario/Acento**: Dinámico según la configuración del usuario (temas: `lime`, `cyan`, `rose`, `amber`, `purple`), inyectado dinámicamente como variables CSS (`--accent-color`).
  - **Inversión de Variables CSS para Modo Claro**: En lugar de duplicar modificadores oscuros de Tailwind en cada elemento, `global.css` mapea los colores de la paleta Slate de Tailwind v4 (`--color-slate-950` a `--color-slate-50`) a variables CSS dinámicas. En modo claro (`[data-theme-mode="light"]`), estas variables se invierten a nivel de raíz, permitiendo que la UI cambie a esquema de día automáticamente manteniendo legibilidad perfecta y contrastes premium en todas las tarjetas (`gradient-card`), barras y elementos translúcidos (`gradient-glass`).
- **Mobile UX**:
  - Botones y zonas de toque táctil de al menos **48px** de altura.
  - Navegación inferior flotante fija (`BottomNav`) para alcance rápido del pulgar.
  - Uso de vibración del dispositivo en eventos críticos (como el fin del temporizador de descanso) a través de `navigator.vibrate()`.
  - Inputs optimizados con `inputmode="decimal"` y botones `+/-` de gran tamaño para evitar el teclado nativo molesto en medio del entrenamiento.

---

## ⚠️ Reglas y Buenas Prácticas de Desarrollo

1. **Directiva `client:only="react"`**:
   - Dado que todo el estado del usuario, ajustes, entrenamientos y rutinas depende de la sesión asíncrona de Supabase que se establece en el navegador, **todos los componentes interactivos React deben ser cargados en Astro usando `client:only="react"`**.
2. **Idioma**:
   - Toda la interfaz del usuario, catálogo de ejercicios predeterminados y mensajes de estado deben mantenerse en **Español**.
3. **Optimización Mobile-First**:
   - Nunca agregues elementos que causen desbordamiento horizontal en pantallas móviles (ancho mínimo recomendado 320px).
4. **Configuración de Tailwind v4**:
   - En Tailwind CSS v4, toda la configuración de temas, colores personalizados y fuentes se realiza directamente en `src/styles/global.css` usando la directiva `@theme`.
