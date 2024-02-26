/// <reference types="@fastly/js-compute" />

import { env } from "fastly:env";
import { createFanoutHandoff } from "fastly:fanout";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

/**
 * @param { FetchEvent } event
 */
async function handleRequest(event) {
  // Log service version.
  console.log("FASTLY_SERVICE_VERSION: ", env("FASTLY_SERVICE_VERSION") || "local");

  let shouldHandoffToFanout = false;
  if (
    event.request.method === 'GET' &&
    event.request.headers.get('upgrade')?.split(',').some(x => x.trim() === 'websocket')
  ) {
    // If a GET request is an "Upgrade: websocket" request, then we also pass it through Fanout
    // to handle as WebSocket-over-HTTP.
    // For details on WebSocket-over-HTTP, see https://pushpin.org/docs/protocols/websocket-over-http/
    shouldHandoffToFanout = true;
  } else if (event.request.method === 'GET' || event.request.method === 'HEAD') {
    // If it's a GET or HEAD request, then we will pass it through Fanout
    shouldHandoffToFanout = true;
  }

  // NOTE: In an actual app we would be more selective about which requests
  // are handed off to Fanout, because requests that are handed off to Fanout
  // do not pass through the Fastly cache. For example, we may examine the
  // request path or the existence of certain headers.

  if (shouldHandoffToFanout) {
    // createFanoutHandoff creates a "Response" that, when processed by
    // event.respondWith(), will perform a passing off the original request,
    // through Fanout, to the declared backend.

    // NOTE: The request handed off to Fanout is the original request
    // as it arrived at Fastly Compute. Any modifications made to the request
    // before calling createFanoutHandoff() will not be seen by the backend.
    return createFanoutHandoff(event.request, "origin");
  }

  // Send the request to the declared backend normally.
  return fetch(event.request, { backend: "origin" });
}
