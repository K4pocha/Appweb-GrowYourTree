# Grow Your Three

Grow Your Three es una aplicación web desarrollada con Ionic y React que tiene como objetivo fomentar el desarrollo sostenible según la agenda 2030 de la ONU. La aplicación permite a los usuarios registrarse, iniciar sesión, calcular su huella de CO2, acceder a logros, ver su perfil y participar en foros.

## Características

- Registro e inicio de sesión de usuarios.
- Cálculo de la huella de CO2.
- Acceso a logros.
- Visualización y edición del perfil del usuario.
- Participación en foros con publicaciones y comentarios.
- Gestión de sesión de usuario con autenticación básica.

## Requisitos Previos

- Node.js (versión 12 o superior)
- npm (versión 6 o superior)
- Ionic CLI

## Instalación

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. Clona este repositorio:

    ```sh
    git clone https://github.com/tu-usuario/grow-your-three.git
    cd grow-your-three
    ```

2. Instala las dependencias del proyecto:

    ```sh
    npm install
    ```

3. Instala las dependencias de Ionic:

    ```sh
    npm install -g @ionic/cli
    ```


5. Inicia el servidor backend:

    ```sh
    node server.js
    ```

6. Inicia la aplicación frontend:

    ```sh
    ionic serve
    ```

## Uso

Una vez que la aplicación y el backend estén en funcionamiento, abre tu navegador web y visita `http://localhost:8100` para ver la aplicación.

### Funcionalidades Principales

- **Registro:** Los usuarios pueden registrarse proporcionando un nombre, apodo, correo electrónico y contraseña.
- **Inicio de Sesión:** Los usuarios pueden iniciar sesión con su correo electrónico o apodo y contraseña.
- **Cálculo de CO2:** Los usuarios pueden calcular su huella de CO2.
- **Logros:** Los usuarios pueden ver sus logros.
- **Perfil:** Los usuarios pueden ver y editar su perfil.
- **Foros:** Los usuarios pueden crear publicaciones y comentarios en los foros.

## Estructura del Proyecto

- **src/components:** Contiene los componentes de React utilizados en la aplicación.
- **src/pages:** Contiene las páginas principales de la aplicación.
- **src/contexts:** Contiene los contextos de React para manejar el estado global de la aplicación.
- **server.js:** Archivo del servidor backend que maneja las rutas y la lógica de negocio.
- **data/users.json:** Archivo JSON que actúa como base de datos para almacenar la información de los usuarios.
- **data/posts.json:** Archivo JSON que actúa como base de datos para almacenar las publicaciones.

## Notas

- Este proyecto utiliza archivos JSON para almacenar datos. Se espera próximamente migrar a MongoDB para un uso en producción.
- La autenticación y autorización básica están implementadas. Se implementara próximamente la seguridad usando JWT y bcrypt para el manejo de sesiones y contraseñas.

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

