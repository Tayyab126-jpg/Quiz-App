# TellHub

## AI assistant and notifications

1. Copy `.env.example` to `.env` for local development and set `MONGO_URI`, `OPENROUTER_API_KEY`, and a strong random `SESSION_SECRET`. Keep `.env` private and use your hosting provider's secret manager in production.
2. Keep `OPENROUTER_MODEL=openrouter/auto` or choose a model that supports image and audio inputs. The API key is used only by the server and is never sent to the browser.
3. For notifications when TellHub is closed, generate a VAPID key pair with `npx web-push generate-vapid-keys`, then set both `WEB_PUSH_PUBLIC_KEY` and `WEB_PUSH_PRIVATE_KEY`. Set `WEB_PUSH_CONTACT` to a valid contact URI and `APP_URL` to the deployed TellHub URL. Restart the server after changing environment settings.
4. Sign in, open the side menu, and choose **Enable message & call alerts**. The browser will ask for notification permission. Message text is not included in push notification previews.

Browser notifications and microphone recording require HTTPS in production (localhost is also treated as a secure context by browsers).

The assistant sends the signed-in user's name, contact names, today's available statuses, and the current prompt or media to the configured OpenRouter model to generate a response. It does not send the user's TellHub chat history. The assistant history is stored in that user's browser storage. Do not send passwords or other secrets to the assistant.

## Account sign-up

New accounts are created immediately after the server validates the built-in, short-lived math CAPTCHA. Email OTP verification is not used. This lightweight challenge helps deter basic automated sign-ups, but is not as strong as a managed CAPTCHA provider.

## Deployment URLs

The browser loads `/runtime-config.js` from TellHub at startup. Set `PUBLIC_API_URL` and, when using a separate realtime host, `PUBLIC_SOCKET_URL` in `.env` for local development or in the Vercel project's Environment Variables. These are public service URLs, not secrets. Leave them blank when the browser should use the current site URL; Vercel's deployment or custom domain then works without changing source files. `APP_URL` is reserved for the app's public identity when making outbound AI requests.

When the web app and API are hosted on different origins, configure the API to allow the web app origin with CORS. Realtime chat requires a Socket.IO server that supports persistent WebSocket connections; serverless Vercel functions do not provide a persistent Socket.IO server, so set `PUBLIC_SOCKET_URL` to a separate compatible realtime host if needed.
