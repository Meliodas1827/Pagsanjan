// // resources/js/echo.ts (or echo.js)
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// // Type-safe way to extend window object
// declare global {
//   interface Window {
//     Pusher: typeof Pusher;
//     Echo: Echo <any>;
//   }
// }

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });