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
 * Responds to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const json = await getResponseJSON();
  const route = chooseRoute(json);
  return new Response(route);
}

/**
 * Chooses random route from JSON
 * @param {any} json
 */
function chooseRoute(json) {
  const variants = json.variants;
  const rand = getRandom(0, variants.length);
  const route = variants[rand];
  return route;
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
 * Returns a random number from lower..upper
 * @param {number} lower - lower limit, inclusive
 * @param {number} upper - upper limit, exclusive
 */
function getRandom(lower, upper) {
  return Math.floor(Math.random() * (upper - lower) + lower);
}
