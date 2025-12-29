# 🏥 SAT Salud - Backend

![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-green)
![Express](https://img.shields.io/badge/express-4.x-blue)
![MySQL](https://img.shields.io/badge/mysql-8.x-orange)
![Socket.io](https://img.shields.io/badge/realtime-Socket.io-black)
![JWT](https://img.shields.io/badge/auth-JWT-red)

Microservicio central para el **Sistema de Asistencia Técnica (SAT)** de la **Unidad de TICs del Departamento de Salud de Alto Hospicio**. 

Este sistema administra la creación, asignación y resolución de tickets de soporte técnico, junto a la trazabilidad de auditoría, almacenamiento de evidencias y notificaciones en tiempo real para clientes web/móvil institucionales.

## 🚀 Características Principales

- **Ciclo de Tickets:** Creación → Revisión → Asignación por Administrador → Resolución por Técnico → Cierre.
- **Notificaciones en Tiempo Real:** Envío automático de eventos a técnicos mediante **Socket.io** cuando se les asigna un ticket.
- **Evidencias Técnicas:** Subida y almacenamiento seguro de archivos (imágenes/PDF) vinculados a tickets.
- **Auditoría:** Registro de cada acción realizada sobre un ticket (usuario, acción, fecha/hora).
- **Seguridad:** Autenticación **JWT** con roles diferenciados (Funcionario, Técnico, Admin).

## 🛠️ Tecnologías Usadas

- **Core:** Node.js + Express.js.
- **Base de Datos:** MySQL (Relacional)
- **Realtime:** Socket.io.
- **Carga de Archivos:** Multer (Gestión de almacenamiento local con UUID).
- **Seguridad:** Bcrypt (Hashing de Contraseñas) + JWT (Tokens).
- - **Caché/Colas (Opcional):** Redis

## 📂 Estructura del Proyecto

```text
/src
 ├── /config       # Configuración DB, Redis y Variables de Entorno
 ├── /controllers  # Lógica de negocio (Tickets, Auth, Stats)
 ├── /middlewares  # Autenticación, manejo de errores, uploads
 ├── /models       # Modelos SQL (Tickets, Historial, Evidencias)
 ├── /routes       # Endpoints de la API
 ├── /services     # Servicios externos (Socket.io, Storage)
 ├── /uploads      # Almacenamiento físico de evidencias
 └── server.js     # Entry point (HTTP + WebSockets)
 ```

## ⚙️ Variables de Entorno
Estos valores deben definirse en el archivo `.env` en desarrollo o en el servidor en producción. Se proporciona `.env.example` como referencia de configuración.

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_aqui
# Credenciales de conexión a MySQL (valores de ejemplo)
DB_HOST=localhost
DB_USER=usuario_db
DB_PASS=password_db
DB_NAME=nombre_base_datos
# Conexión a Redis (opcional)
REDIS_URL=redis://localhost:6379
```

## 💾 Script de Base de Datos (Inicialización)
Para desplegar, ejecute este script en MySQL para generar la estructura necesaria:

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    email VARCHAR(100),
    rol ENUM('admin', 'tecnico', 'funcionario') DEFAULT 'funcionario',
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tecnico_id INT NULL,
    titulo VARCHAR(150),
    descripcion TEXT,
    prioridad ENUM('baja', 'media', 'alta', 'critica'),
    estado ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
    categoria VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

## 🔌 Endpoints Principales

**🔐 Autenticación**
- **`POST /api/auth/login`**- Obtener Token JWT.

**🎫 Tickets**
- **`POST /api/tickets`**- Crear nuevo requerimiento (Emite evento Socket).
- **`GET /api/tickets`**- Listar (Admin ve todo, Funcionario solo los suyos).
- **`GET /api/tickets/:id`**- Ver detalle completo.
- **`PUT /api/tickets/:id`**- Gestión (Asignar técnico, cambiar estado).

**📎 Evidencias**
- **`POST /api/tickets/:id/evidencia`**- Subir archivo (Form-Data).
- **`GET /api/tickets/:id/evidencia`**- Listar archivos adjuntos.

**🧾 Historial / Estadísticas**
- **`GET /api/tickets/:id/historial`**- Ver bitácora de cambios.
- **`GET /api/stats/dashboard`**- Métricas para jefatura.

## 👥 Roles y Permisos

1. **Funcionario:** Cliente interno. Solo puede crear tickets, subir evidencias y ver sus propios casos.
2. **Técnico:** Resolutor. Puede ver la lista general de tickets y gestionar los que tenga asigandos solamente, subir evidencias técnicas y crear comentarios y cambios de estados (en_proceso, resuelto, cerrado).
3. **Administrador:** Gestión total. Acceso a dashboard de estadísticas y gestión de usuarios, asignar técnicos, cambiar prioridad y estado.

---
Desarrollado por **Josting Silva**  
Analista Programador – Unidad de TICs  
Departamento de Salud, Municipalidad de Alto Hospicio
