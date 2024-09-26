# Fanout forward starter kit for JavaScript

[![Deploy to Fastly](https://deploy.edgecompute.app/button)](https://deploy.edgecompute.app/deploy)

Learn about Fastly Compute with Fanout using a basic starter that sends connections through the Fanout GRIP proxy to a backend.

**For more details about this and other starter kits for Fastly Compute, see the [Fastly Documentation Hub](https://www.fastly.com/documentation/solutions/starters/)**.

## Setup

To create an application using this starter kit, create a new directory for your application and switch to it, and then type the following command:

```shell
npm create @fastly/compute@latest -- --language=javascript --starter-kit=fanout-forward
```

The app expects a configured backend named "origin" that points to an origin server. For example, if the server is available at domain `example.com`, then you'll need to create a backend on your Fastly Compute service named "origin" with the destination host set to `example.com` and port `443`. Also set `Override Host` to the same host value.

> [!NOTE]
> Fastly's [local development server](https://www.fastly.com/documentation/guides/compute/testing/#running-a-local-testing-server) does not support Fanout features. To experiment with Fanout, you will need to publish this project to your Fastly Compute service.

To build and deploy your application to your Fastly account, type the following command. The first time you deploy the application, you will be prompted to create a new service in your account.

```shell
npm run deploy
```

After deploying the app and setting up the backend configuration, all connections received by the service will be passed through the Fanout proxy to the origin. If WebSocket-over-HTTP mode is enabled on your service, then client WebSocket activity will be converted into HTTP when sending to the origin.

## Security issues

Please see [SECURITY.md](SECURITY.md) for guidance on reporting security-related issues.
