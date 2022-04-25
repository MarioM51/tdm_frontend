# Construir componentes

1, Transcompilar estilos

```r
npx tailwindcss -i ./src/common/input.css -o ./../api/src/public/static/web_components/tailwin.css
```

2, transcompilar componentes

```r
npm run wc_build
```