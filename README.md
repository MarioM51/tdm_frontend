# Frontend

## Subir fotografias

Para subir fotos se usa la aplicacion "Camera FV-5 Lite" configurada en 1280x720 (0.92MP 16:9) con un formato de imagen PNG con un nivel de calidad d 90 (Fine)

## Problemas de rutas al poner admin en sub ruta

```r
sed -i -e 's|/assets/|./assets/|g' ./../api/public/admin-spa/index.html && \
sed -i -e 's|/favicon.ico|./favicon.ico|g' ./../api/public/admin-spa/index.html && \
sed -i -e 's|assets/|./admin/assets/|g' ./../api/public/admin-spa/assets/index.*.js && \
sed -i -e 's|"/favicon.ico|"./favicon.ico|g' ./../api/public/admin-spa/assets/*.js && \
sed -i -e 's|"favicon.ico|"./favicon.ico|g' ./../api/public/admin-spa/assets/*.js

```

## Compilar y observar estilos

```r
npx tailwindcss --watch --config ./tailwind.config.cjs \
  --input ./src/common/input.css \
  --output ./../api/public/static_003/tailwin.css
```

## Compilar y observar pwa

```r
npx vite build --watch --base http://192.168.1.81/admin/ --outDir ./../api/public/admin-spa
```

## Compilar y observar componentes

```r
npx rollup --watch --config ./rollup.config.js
```
