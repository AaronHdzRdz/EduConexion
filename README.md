# EduConexion

EduConexion es una plataforma full-stack para gestionar estudiantes, materias y calificaciones.
Backend en Go (Gin + Gorm) con PostgreSQL, y frontend en React (Vite + Tailwind) servido por Nginx.

---

## 🔧 Tecnologías

* **Backend**: Go 1.24, Gin, Gorm, JWT
* **Base de datos**: PostgreSQL
* **Frontend**: React 19, Vite, Tailwind CSS, Heroicons, FontAwesome
* **Servidor estático**: Nginx
* **Orquestación**: Docker & Docker Compose

---

## 🚀 Requisitos

* [Docker](https://www.docker.com/get-started) (versión ≥ 20.10)
* [Docker Compose](https://docs.docker.com/compose/install/) (versión ≥ 1.29)

---

## 🛠️ Instalación y ejecución

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/AaronHdzRdz/EduConexion.git
   cd EduConexion
   ```

2. **Levantar la aplicación**

   ```bash
   docker-compose up --build -d
   ```

   Este comando:

   * Construye las imágenes de `backend`, `frontend` y el contenedor de `database`.
   * Crea un volumen `postgres_data` para persistencia de datos.
   * Expone:

     * Backend en el puerto **3000**
     * Frontend (Nginx) en el puerto **5173**

3. **Verificar que todo corra bien**

   ```bash
   docker-compose logs -f
   ```

4. **Detener y borrar contenedores**

   ```bash
   docker-compose down
   ```

---

## 🔗 Acceso a la aplicación

* **Localmente**: abre en tu navegador [http://localhost:5173](http://localhost:5173)

* **Desde otra máquina en la misma red**:

  1. Obtén la **IPv4** de tu computadora:

     * **Windows**: ejecuta `ipconfig` en PowerShell o Símbolo del sistema y busca la **Dirección IPv4** bajo el adaptador de red activo.
     * **macOS/Linux**: ejecuta `ifconfig` o `ip addr show` en la terminal y localiza el valor `inet` de la interfaz activa (por ejemplo, `en0`, `eth0`).
  2. En el navegador de otro dispositivo, ingresa:

     ```
     http://<TU_DIRECCIÓN_IPV4>:5173
     ```

---

## ⚙️ Configuración

* En `docker-compose.yml` encontrarás las variables de entorno para el backend:

  * `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  * **¡No olvides** cambiar `JWT_SECRET: your_jwt_secret_here` por tu clave secreta 🤫

---

## 📂 Estructura de carpetas

```
EduConexion/
├── backend/         # API en Go
│   ├── cmd/         # Punto de entrada (main.go)
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── Dockerfile
├── frontend/        # App React + Vite
│   ├── public/
│   ├── src/
│   ├── dist/        # Build
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

---
