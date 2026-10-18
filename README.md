# Nexa AI — prototipo inicial

Este proyecto es una primera versión web de Nexa AI: interfaz adaptable a móviles, selección de idioma o detección automática, tono cálido y conexión a un modelo mediante una función de servidor.

## Importante sobre el coste

- La web estática puede alojarse en un plan gratuito compatible.
- Hugging Face Inference Providers puede tener una cuota gratuita limitada; no garantiza uso ilimitado ni que este modelo esté disponible en toda cuenta.
- Este prototipo no incluye pagos ni cuentas de usuario. Añadiremos Nexa Plus y donaciones después de comprobar el chat y revisar los requisitos legales y de pago.
- No prometas privacidad absoluta: no envíes datos personales sensibles.

## Archivos

- `index.html`: interfaz del chat.
- `functions/api/chat.js`: función de servidor que conecta con Hugging Face sin exponer el token al navegador.

## Publicar con Cloudflare Pages (sin instalar programas)

1. Crea una cuenta en GitHub y otra en Cloudflare.
2. En GitHub, crea un repositorio nuevo llamado `nexa-ai`. Para la primera prueba, puedes dejarlo público.
3. Sube `index.html` a la raíz del repositorio.
4. Sube la carpeta `functions` conservando esta ruta exacta: `functions/api/chat.js`.
5. En Cloudflare, abre Workers & Pages y crea una aplicación Pages conectada a ese repositorio.
6. Usa la configuración de sitio estático sin comando de compilación y con el directorio de salida ` / ` (la raíz del repositorio; si el panel no acepta `/`, deja el campo vacío).
7. En la configuración del proyecto Pages, abre Settings > Variables and Secrets (o Functions > Variables, según el panel) y añade `HF_TOKEN` como **secret**, no como variable pública.
8. En Hugging Face, crea un token desde Settings > Access Tokens con los permisos necesarios para usar Inference Providers. Copia el token solo en el campo secreto de Cloudflare.
9. Vuelve a desplegar el sitio y prueba un mensaje corto.

## Si algo falla

- `Falta configurar HF_TOKEN`: el secreto no está configurado con ese nombre o no se ha redeplegado.
- Error de permisos o modelo: comprueba el acceso a Inference Providers y la disponibilidad del modelo configurado en `functions/api/chat.js`.
- Límite temporal o créditos: espera a que se renueve la cuota o cambia a otro proveedor gratuito disponible; no añadas una tarjeta si tu objetivo es mantener $0.
- Nunca pegues el token en un mensaje, en `index.html` ni en un repositorio.

## Siguientes mejoras

1. Elegir un modelo multilingüe que realmente esté disponible con la cuota de la cuenta.
2. Añadir límites antiabuso y protección contra spam.
3. Añadir aviso de privacidad y condiciones.
4. Diseñar donaciones voluntarias y un plan Plus opcional. No recolectar pagos hasta haber probado el producto y revisar las reglas del proveedor de pagos.
