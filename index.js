const BASE_URL = "https://cfw-takehome.developers.workers.dev/api/variants";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Responds to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  };
  const json = await fetchResponse(BASE_URL);
  const variant = getVariantURL(json);
  const html = await fetchResponse(variant);
  return new Response(html, init);
}

/**
 * Gets random route from JSON
 * @param {any} json
 */
function getVariantURL(json) {
  const variants = json.variants;
  const rand = getRandom(0, variants.length);
  const url = variants[rand];
  return url;
}

/**
 * Gets response body from `url`
 * @param {string} url - url to fetch
 */
async function fetchResponse(url) {
  const response = await fetch(url);
  const result = await gatherResponse(response);
  return result;
}

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type");
  if (contentType.includes("application/json")) {
    return await response.json();
  } else if (contentType.includes("application/text")) {
    return await response.text();
  } else if (contentType.includes("text/html")) {
    return await response.text();
  } else {
    return await response.text();
  }
}

/**
 * Returns a random number from lower..upper
 * @param {number} lower - lower limit, inclusive
 * @param {number} upper - upper limit, exclusive
 */
function getRandom(lower, upper) {
  return Math.floor(Math.random() * (upper - lower) + lower);
}
