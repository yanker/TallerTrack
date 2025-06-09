# MIS NOTAS

Este proyecto ha sido creado para una necesidad propia. Con ello he conseguido:

- Poder hacer uso de la IA y poner en práctica los consejos de Daniel Primo en WebReactiva y su especial ESPERANDO A ESKAINET.
- Ver la potencia de la IA en hacer trabajos en cuestión de minutos y en técnologías que desconozco practicando el VIBECODING & AI First
- Conocer la potencia de la IA con los tier gratuitos y hasta donde se puede llegar.
- Probar herramientas aconsejadas por WebReactiva en la newsletter de los domingos, como es CHEF que lo he usado para este proyecto.
- Comprobar la potencia de la IA para reconocer un proyecto y generar la documentación de ella como es la USAGE_GUIDE.md yel README.md
- He vuelto a usar VERCEL (también recomendado por malandriners y WebReactiva) y es una maravilla para estas cosas :)

## PROBLEMAS ENCONTRADOS

- He tenido un problema el cual se escapa ya a mi razonamiento y al del ChatGPT que es, el porque no puedo utilizar la base de datos en producción de CONVEX, he realizado numerosos cambios y nada, he tenido que dejar la base de datos de DEV para desplegar la app, no es un problema porque no es una app crucial, pero como se dice "no estoy enfadao, pero me da coraje"

- Decir que cuando se me acabó el tier gratuito de CHEF me dejó bajar el código y pude terminarlo con COPILOT en vsCode

## HERRAMIENTAS UTILIZADAS

- CHEF
- CONVEX
- COPILOT
- VERCEL
- GIT
- VSCODE

## URL VERCEL

https://taller-tracker.vercel.app/

## REFLEXIÓN

- Luego en mis peripecias y tiempo invertido para poner la database de CONVEX, me pude generar la dist, probarla en local con el servidor serve dist, hacer distintas pruebas, crear ramas de versiones funcionales, renombrar... he aprendido mucho aquí

- Para practicar con el VIBECONDING es IMPRENCIDIBLE el uso de GIT y crear ramas cuando vas a crear un nuevo HITO para luego fusionar con MAIN cuando lo tienes OK.

# NOTAS DESARROLLO

Si se crea un nueva sección y necesitamos publicar la nueva tabla en CONVEX deberemos realizar el comendo `npx convex deploy`

Generamos la build `npm run build`, y luego si lo queremos probar en local la dist, hacemos `serve dist` (ya paquete instalado globalmente en local)
