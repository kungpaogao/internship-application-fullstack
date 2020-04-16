const BASE_URL = "https://cfw-takehome.developers.workers.dev/api/variants";

class ElementHandler {
  /**
   * Constructs an ElementHandler
   * @param {string} attributeName - name of the attribute to edit
   * @param {string} content - new content
   * @param {string} oldContent - old content to replace (optional)
   */
  constructor(attributeName, content, oldContent) {
    this.attributeName = attributeName;
    this.content = content;
    this.oldContent = oldContent;
  }

  /**
   * If attribute exists on the element, set its content (use replace if
   * `oldContent` is provided).
   * Otherwise, just set the inner content of the element to `content`.
   * @param {Element} element
   */
  element(element) {
    const attribute = element.getAttribute(this.attributeName);
    if (attribute) {
      const newContent = this.oldContent
        ? attribute.replace(this.oldContent, this.content)
        : this.content;
      element.setAttribute(this.attributeName, newContent);
    } else {
      element.setInnerContent(this.content);
    }
  }
}

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
  const { rand, url } = getVariantInfo(json);
  const resp = await fetch(url);
  return new HTMLRewriter()
    .on("title", new ElementHandler("", "Andrew Gao - Cloudflare"))
    .on("h1#title", new ElementHandler("", `Andrew Gao (${rand + 1})`))
    .on(
      "p#description",
      new ElementHandler("", "I'm a computer science major at Cornell :)")
    )
    .on("a#url", new ElementHandler("", "Go to my website"))
    .on("a#url", new ElementHandler("href", "https://www.andrewgao.org/"))
    .transform(resp);
}

/**
 * Gets random route from JSON
 * @param {any} json
 */
function getVariantInfo(json) {
  const variants = json.variants;
  const rand = getRandom(0, variants.length);
  const url = variants[rand];
  return { rand, url };
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
