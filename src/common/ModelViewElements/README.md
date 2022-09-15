# Politicas de uso

Usar los Writable en el viewModel, y luego por medio de getters
usar los Readable en la vista, para poder leer en la vista
pero no poder modificar, y aun asi en el viewModel tener un gran
control de los diferentes elementos de la UI, ver ejemplo, en.

- src\common\security\UserAdminModelView.ts
- src\common\security\UserAdmin.svelte
