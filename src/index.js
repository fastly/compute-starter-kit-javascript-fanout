/// <reference types="@fastly/js-compute" />

import { env } from "fastly:env";
import { createFanoutHandoff } from "fastly:fanout";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

/**
 * @param { FetchEvent } event
 */
async function handleRequest(event) {
  // Log service version
  console.log("FASTLY_SERVICE_VERSION:", env('FASTLY_SERVICE_VERSION') || 'local');

  // The createFanoutHandoff() function creates a Response instance which informs Fastly to pass the
  // original Request through Fanout, to the declared backend.

  // NOTE: As of this writing, the request handed off to Fanout is the original request as it arrived at
  // Compute@Edge. Modifications made to the request (such as to its headers) before calling createFanoutHandoff()
  // will not be seen by the backend.
  return createFanoutHandoff(event.request, 'backend');
}
