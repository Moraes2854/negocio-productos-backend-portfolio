<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


1. Clonar proyecto
2. ```npm install```
3. Verificar el archivo ```.env```
4. Levantar la base de datos
```
docker-compose up -d
```
6. Levantar servidor: ```npm run start:dev```
7. Utilizar en ```http://localhost:${PORT}```
8. Utilizar seed ejecutando una peticion post al endpoint ```http://localhost:${PORT}/api/seed```