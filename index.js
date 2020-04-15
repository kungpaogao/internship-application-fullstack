const BASE_URL = "https://cfw-takehome.developers.workers.dev/api/variants";
const init = {
  headers: {
    "content-type": "application/json",
  },
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Responds the JSON string
 * @param {Request} request
 */
async function handleRequest(request) {
  const json = await getResponseJSON();
  return new Response(JSON.stringify(json));
}

/**
 * Gets response JSON from `BASE_URL`
 */
async function getResponseJSON() {
  const response = await fetch(BASE_URL);
  const json = await response.json();
  return json;
}

/**
 * Get a random number from 0..upper
 * @param {number} upper - upper limit
 */
function getRandom(upper) {}
