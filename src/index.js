/// <reference types="@fastly/js-compute" />

import { env } from "fastly:env";
import { createFanoutHandoff } from "fastly:fanout";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

/**
 * @param { FetchEvent } event
 */
async function handleRequest(event) {
  // Log service version.
  console.log("FASTLY_SERVICE_VERSION:", env("FASTLY_SERVICE_VERSION") || "local");

  // createFanoutHandoff() creates a Response instance
  // passing the original request, through Fanout, to the declared backend.

  // NOTE: The request handed off to Fanout is the original request 
  // as it arrived at Compute@Edge. Any modifications made to the request 
  // before calling createFanoutHandoff() will not be seen by the backend.
  return createFanoutHandoff(event.request, "origin");
}
