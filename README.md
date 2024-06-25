# Grow Your Three

Grow Your Three es una aplicación web desarrollada con Ionic y React, con un backend basado en Node.js y MongoDB. La aplicación está diseñada para promover el desarrollo sostenible y ayudar a los usuarios a reducir su huella de carbono mediante la realización de diversas actividades y comportamientos ecológicos.

## Funcionalidades

- **Registro e Inicio de Sesión**: Los usuarios pueden registrarse y iniciar sesión. La autenticación se maneja con JSON Web Tokens (JWT).
- **Roles de Usuario**: La aplicación tiene roles de usuario y administrador. Los administradores pueden asignar logros a los usuarios y cambiar el rol de los usuarios.
- **Calculadora de CO2**: Los usuarios pueden calcular su huella de carbono basada en sus actividades diarias.
- **Logros**: Los usuarios pueden desbloquear logros basados en actividades sostenibles. Los logros están categorizados y pueden tener diferentes niveles (Bronce, Plata, Oro).
- **Foros**: Los usuarios pueden crear, comentar y dar like o dislike a las publicaciones. Los administradores pueden eliminar publicaciones.
- **Recomendaciones Diarias**: Los usuarios pueden ver recomendaciones diarias para reducir su huella de carbono.
- **Gestión de Contraseñas**: Los usuarios pueden cambiar su contraseña desde la página de perfil.

## Tecnologías Utilizadas

- **Frontend**: Ionic, React
- **Backend**: Node.js, Express.js, MongoDB
- **Autenticación**: JSON Web Tokens (JWT)

## Requisitos

- Node.js
- MongoDB

## Instalación

### 1. Clonar el Repositorio

git clone https://github.com/K4pocha/Proyecto-Ing.Web-2024.git
cd grow-your-three

### 2. Configurar el Backend

#### Instalar Dependencias

cd backend
npm install express mongoose jsonwebtoken bcryptjs cors dotenv

(Pueden faltar dependencias que haya olvidado, verificar al compilar)

#### Configurar Variables de Entorno

Crear un archivo `.env` en la carpeta `backend` con el siguiente contenido:

MONGODB_URI=mongodb://localhost:27017/grow-your-tree
JWT_SECRET=tu_secreto_jwt


#### Iniciar el Servidor

node server.js


### 3. Configurar el Frontend

#### Instalar Dependencias

cd ../frontend
npm install @ionic/react react-router-dom axios react-hook-form

(Pueden faltar dependencias que haya olvidado, verificar al compilar)


#### Iniciar la Aplicación

ionic serve


## Estructura del Proyecto




## Uso

### Roles de Usuario

- **Usuarios**: Pueden calcular su huella de carbono, ver y desbloquear logros, participar en foros y ver recomendaciones diarias.
- **Administradores**: Pueden asignar logros a los usuarios, cambiar roles de usuario y eliminar publicaciones en los foros.

### Recomendaciones Diarias

Las recomendaciones diarias se pueden actualizar desde el backend. La ruta para actualizar las recomendaciones es `/recommendations` y solo puede ser accedida por los administradores.

### Gestión de Logros

Los logros se pueden asignar y quitar a los usuarios desde la página de gestión de usuarios (`/manageUsers`). Los logros tienen diferentes categorías y niveles, y se muestran tanto en la página de logros como en el perfil del usuario.

## Seguridad

La aplicación implementa varias medidas de seguridad:

- **Autenticación JWT**: Se utiliza JSON Web Tokens para la autenticación y autorización de usuarios.
- **Encriptación de Contraseñas**: Las contraseñas se encriptan antes de almacenarlas en la base de datos.
- **Roles y Permisos**: Los roles de usuario y administrador aseguran que solo los usuarios autorizados puedan realizar ciertas acciones.
- **Variables de Entorno**: Se utilizan variables de entorno para proteger datos sensibles como la URI de MongoDB y el secreto JWT.

## Próximos Pasos (Actualizaciones futuras pendientes)

- Migrar de archivos JSON a una base de datos como MongoDB.
- Implementar autenticación y autorización con JWT.
- Añadir encriptación de contraseñas utilizando bcrypt.
- Mejorar la seguridad implementando CAPTCHA en formularios de registro e inicio de sesión.
- Implementar gestión de roles (usuario y administrador).

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube los cambios a tu fork (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.


=======

Grow Your Tree fue desarrollado por [https://github.com/K4pocha] - [https://github.com/nidiabugueno/] - [https://github.com/xksis]

=======

