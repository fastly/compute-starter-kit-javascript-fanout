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

  if (event.request.method === 'GET' || event.request.method === 'HEAD') {
    // If it's a GET or HEAD request, then we will pass it through Fanout

    // NOTE: In an actual app we would be more selective about which requests
    // are handed off to Fanout, because requests that are handed off to Fanout
    // do not pass through the Fastly cache. For example, we may examine the
    // request path or the existence of certain headers.

    // createFanoutHandoff() creates a Response instance
    // passing the original request, through Fanout, to the declared backend.

    // NOTE: The request handed off to Fanout is the original request
    // as it arrived at Fastly Compute. Any modifications made to the request
    // before calling createFanoutHandoff() will not be seen by the backend.
    return createFanoutHandoff(event.request, "origin");
  }

  return fetch(event.request, { backend: "origin" });
}
