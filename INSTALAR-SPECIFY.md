# Instalación de Spec-Kit (`specify`) en un proyecto

Instrucciones para una IA asistente que necesite instalar y dejar operativo **GitHub Spec-Kit** (`specify-cli`) en un proyecto local del usuario, en Windows + PowerShell.

La IA que ejecute esto ya conoce la ruta absoluta del proyecto destino; en este documento se referencia como `<PROJECT_PATH>`.

---

## 1. Entorno objetivo

- **SO:** Windows 10/11
- **Shell primario:** Windows PowerShell 5.1 (`powershell.exe`)
- **Usuario:** cuenta estándar, sin privilegios de administrador
- **Editor/agente:** Claude Code (Desktop)
- **Repositorio origen:** https://github.com/github/spec-kit

## 2. Prerrequisitos que deben existir

Verificar (no reinstalar si ya están):

- **Git** 2.40+
- **Python** 3.11+ (viene como `python` desde `WindowsApps`)
- **`uv`** (gestor de paquetes/entornos de Astral)
- **`specify`** (CLI de spec-kit, instalado como uv tool)

Comando de verificación en PowerShell:

```powershell
foreach ($c in 'git','python','uv','specify') {
  $cmd = Get-Command $c -ErrorAction SilentlyContinue
  if ($cmd) { "$c OK -> $($cmd.Source)"; & $c --version }
  else { "$c FALTA" }
}
```

## 3. Instalación de dependencias faltantes

Ejecutar solo lo que falte de la verificación anterior.

### 3.1. Instalar `uv` (si falta)

```powershell
python -m pip install --user --upgrade uv
```

Si `uv` no aparece en el PATH después, se puede invocar como `python -m uv` o desde:

```
C:\Users\<USUARIO>\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\LocalCache\local-packages\Python312\Scripts\uv.exe
```

### 3.2. Instalar `specify` (si falta o para actualizar)

Desde la rama principal del repo oficial:

```powershell
python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git --force
```

`--force` sobreescribe si ya había una versión instalada.

El ejecutable queda en:

```
C:\Users\<USUARIO>\.local\bin\specify.exe
```

Esa carpeta se agrega automáticamente al PATH de usuario. Si la sesión de PowerShell actual no la ve, ejecutar en esa sesión:

```powershell
$env:PATH = "$env:USERPROFILE\.local\bin;$env:PATH"
```

Para actualizaciones futuras:

```powershell
python -m uv tool upgrade specify-cli
```

### 3.3. Comprobar `specify`

```powershell
specify check
```

Debe terminar mostrando **"Specify CLI is ready to use!"** y marcar Claude Code como `available`.

## 4. Inicialización en el proyecto

### 4.1. Entrar a la carpeta del proyecto

**Importante:** siempre entre comillas dobles, porque las rutas de Windows frecuentemente contienen espacios (`OneDrive - APYMSA`, `GIT SUCURSALES`, etc.). Sin comillas, PowerShell corta la ruta en el primer espacio y falla con `CommandNotFoundException`.

```powershell
cd "<PROJECT_PATH>"
```

### 4.2. Inicializar spec-kit en el proyecto

Para un proyecto **existente** (recomendado, respeta los archivos que ya haya):

```powershell
specify init --here --integration claude --script ps --force
```

Para crear una **carpeta nueva** desde cero:

```powershell
specify init <NOMBRE_PROYECTO> --integration claude --script ps
```

Flags:

- `--here`: inicializa en el directorio actual (no crea subcarpeta).
- `--integration claude`: instala los assets como skills de Claude Code (en versiones recientes; en versiones antiguas de `specify-cli` (≤ 1.0.12) el flag equivalente era `--ai claude`).
- `--script ps`: genera los scripts auxiliares como PowerShell `.ps1` (por defecto en otros entornos es `sh`).
- `--force`: no pide confirmación aunque la carpeta no esté vacía. Omitir si se prefiere que pregunte.

Si `--integration` no existe en la versión instalada, probar `--ai claude` como fallback.

### 4.3. Verificar la instalación en el proyecto

```powershell
Get-ChildItem .claude\skills; Get-ChildItem .specify -ErrorAction SilentlyContinue
```

Debe listar 10 carpetas bajo `.claude\skills\`:

```
speckit-analyze
speckit-checklist
speckit-clarify
speckit-constitution
speckit-converge
speckit-implement
speckit-plan
speckit-specify
speckit-tasks
speckit-taskstoissues
```

## 5. Uso desde Claude Code

Las skills solo aparecen cuando el **working directory** de la sesión de Claude Code es la carpeta del proyecto donde se ejecutó `specify init`.

> **Importante:** si ya tenías Claude Code abierto en otra carpeta (por ejemplo `GIT SUCURSALES` o el home del usuario), esa sesión **no verá** las skills aunque acabes de correr `specify init` en otra ruta. Hay que **cerrar** esa sesión y abrir una nueva apuntando a `<PROJECT_PATH>`. Recargar/reiniciar dentro de la misma sesión no basta.

### 5.1. Abrir una sesión en la carpeta correcta

**Opción A (app de escritorio):**

1. Menú → *New session* (o `Ctrl+N`).
2. En **Working directory** pega la ruta completa del proyecto, ej.: `C:\Users\jcastellanos\Documents\Exodus-sucursales-limpio`.
3. *Create*.

**Opción B (PowerShell / terminal):**

Abre una ventana **nueva** de PowerShell y ejecuta (siempre entre comillas si la ruta tiene espacios):

```powershell
cd "<PROJECT_PATH>"; claude
```

Ejemplo real para este equipo:

```powershell
cd "C:\Users\jcastellanos\Documents\Exodus-sucursales-limpio"; claude
```

Si `claude` no se encuentra en la sesión de PowerShell, agregar temporalmente al PATH:

```powershell
$env:PATH = "$env:USERPROFILE\.local\bin;$env:APPDATA\npm;$env:PATH"; claude
```

**Comprobar que estás en la carpeta correcta antes de invocar skills:** dentro del chat de Claude Code, ejecuta:

```
/status
```

o simplemente pídele *"¿cuál es tu working directory?"*. Debe reportar `<PROJECT_PATH>`. Si reporta cualquier otra cosa (por ejemplo `GIT SUCURSALES`, `Documents`, el home), las skills `/speckit-*` **no van a aparecer** — cierra y reabre siguiendo los pasos de arriba.

### 5.2. Comandos disponibles dentro del chat

Se invocan escribiendo `/` seguido del nombre de la skill:

| Comando | Rol |
|---|---|
| `/speckit-constitution` | Principios y reglas del proyecto |
| `/speckit-specify` | Qué construir y por qué (spec de negocio) |
| `/speckit-clarify` | Resolver ambigüedades de la spec (opcional) |
| `/speckit-plan` | Stack, arquitectura, decisiones técnicas |
| `/speckit-tasks` | Desglose accionable |
| `/speckit-analyze` | Revisar consistencia entre spec/plan/tasks (opcional) |
| `/speckit-implement` | Ejecutar las tareas |
| `/speckit-checklist` | Checklist genérico |
| `/speckit-converge` | Reconciliar cambios |
| `/speckit-taskstoissues` | Volcar tareas a issues |

### 5.3. Flujo recomendado

Ejecutar en orden, esperando el resultado de cada uno:

```
/speckit-constitution
/speckit-specify   <descripción del qué y por qué>
/speckit-plan      <preferencias técnicas / restricciones>
/speckit-tasks
/speckit-implement
```

Cada skill escribe/lee artefactos en `.specify/` y `specs/` del proyecto; la siguiente skill los consume.

## 6. Solución de problemas frecuentes

| Síntoma | Causa | Fix |
|---|---|---|
| `El término 'C:\Users\...\OneDrive' no se reconoce` al hacer `cd` | Ruta con espacios sin comillas | Envolver la ruta completa entre `"..."` |
| `specify` no se encuentra en PowerShell nuevo | `~\.local\bin` no está aún en PATH de esa sesión | Cerrar/abrir PowerShell, o `$env:PATH = "$env:USERPROFILE\.local\bin;$env:PATH"` |
| `No such option: --ai` | Versión reciente de spec-kit renombró el flag | Usar `--integration claude` |
| `No such option: --integration` | Versión antigua (≤ 1.0.12) | Actualizar con `python -m uv tool upgrade specify-cli` o usar `--ai claude` |
| `uv` reportado como faltante pero `python -m uv` sí funciona | Instalado por pip pero `Scripts` no está en PATH | Usar `python -m uv ...` o agregar `...\Python312\Scripts` al PATH |
| Las skills `/speckit-*` no autocompletan en Claude Code | La sesión no está abierta en la carpeta del proyecto | Cerrar la sesión actual y abrir una NUEVA con Working directory = `<PROJECT_PATH>`. Recargar la sesión existente no funciona. |
| `specify init` corrió OK pero las skills siguen sin aparecer | Estás en la sesión antigua (otra carpeta) | En PowerShell: `cd "<PROJECT_PATH>"; claude` — la sesión anterior no se recarga sola |
| `claude` no se reconoce en PowerShell | El binario de Claude Code no está en el PATH de esa sesión | `$env:PATH = "$env:USERPROFILE\.local\bin;$env:APPDATA\npm;$env:PATH"; claude` |
| `specify init` pregunta y bloquea en un script automatizado | Falta modo no interactivo | Agregar `--force --non-interactive --integration claude` |

## 7. Resumen ejecutable (todo en un bloque)

Para una IA que solo necesite copiar/pegar, dada `<PROJECT_PATH>`:

```powershell
# 1. Prerrequisitos
python -m pip install --user --upgrade uv
python -m uv tool install specify-cli --from git+https://github.com/github/spec-kit.git --force
$env:PATH = "$env:USERPROFILE\.local\bin;$env:PATH"

# 2. Verificación
specify check

# 3. Init en el proyecto
cd "<PROJECT_PATH>"
specify init --here --integration claude --script ps --force

# 4. Comprobación final
Get-ChildItem .claude\skills

# 5. Abrir Claude Code en el proyecto (sesión NUEVA, no la actual)
claude
```

Después de esto:

- Si tenías Claude Code abierto en otra carpeta, **ciérralo primero** — la sesión vieja no verá las skills aunque `specify init` ya haya corrido.
- El comando `claude` del bloque de arriba abre una sesión con working directory = la carpeta donde estás parado en PowerShell, por lo que las skills `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, etc. estarán disponibles en el chat.
- Alternativa: abrir la app de escritorio → *New session* → **Working directory** = `<PROJECT_PATH>`.
