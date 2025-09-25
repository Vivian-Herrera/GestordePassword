Trabajo final modulo cyberseguridad - Maestría UCB
# Gestor de Contraseñas 

Está compuesta por:

- Frontend: Vue 3
- Backend: Node.js + Express
- Base de datos: SQLite (usando better-sqlite3)
- Seguridad: Cifrado AES-256 y hash con bcrypt


## Clonar y ejecutar el proyecto

### 1. Clonar el repositorio

--en una terminal(-- bash) ejecutar el siguietne comando
git clone https://github.com/Vivian-Herrera/GestordePassword.git
cd GestordePassword
--

---

##  Backend

### 2. Ir al directorio del backend e instalar dependencias


cd BackEnd
npm install


### 3. Crear el archivo `.env`

Crea un archivo `.env` en la raíz del backend con este contenido:

---env
ENCRYPTION_KEY=12345678901234567890123456789012
IV=1234567890123456
MASTER_PASSWORD_HASH=<REEMPLAZAR_CON_HASH_GENERADO>
---

>  Puedes generar el hash para la contraseña maestra (en este caso `123456`) con este comando:

---bash
node -e "console.log(require('bcrypt').hashSync('123456', 10))"
-------

Copia el hash y reemplaza en `MASTER_PASSWORD_HASH`.

### 4. Ejecutar el backend

---bash
node index.js
---

Servidor disponible en: [http://localhost:3000](http://localhost:3000)

---

## Frontend

### 5. Ir al directorio del frontend

---bash
cd ../GestorPassword
---

### 6. Instalar dependencias

---bash
npm install
---

### 7. Ejecutar Vue

---bash
npm run dev
---

La aplicación estará disponible en: [http://localhost:5173](http://localhost:5173)

---

##  Funcionalidades

- Ingreso con contraseña maestra
- Crear nuevas contraseñas (nombre, usuario, contraseña)
- Ver lista de contraseñas guardadas (desencriptadas)
- Eliminar contraseñas

---

## Seguridad

- Contraseña maestra protegida con **bcrypt**
- Contraseñas de usuario cifradas con **AES-256-CBC**
- Datos almacenados cifrados en **SQLite**
- Ninguna contraseña se guarda en texto plano

---

## Vivian Amparo Herrera Aduviri