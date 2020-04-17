const BASE_URL = "https://cfw-takehome.developers.workers.dev/api/variants";

/**
 * Class for replacing elements and attributes
 */
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
      // editing an attribute
      const newContent = this.oldContent
        ? attribute.replace(this.oldContent, this.content)
        : this.content;
      element.setAttribute(this.attributeName, newContent);
    } else {
      // no attribute provided/found, so edit inner content
      element.setInnerContent(this.content);
    }
  }
}

const rewriter = (num) =>
  new HTMLRewriter()
    .on("title", new ElementHandler("", "Andrew Gao - Cloudflare"))
    .on("h1#title", new ElementHandler("", `Andrew Gao (${num + 1})`))
    .on(
      "p#description",
      new ElementHandler("", "I'm a computer science major at Cornell :)")
    )
    .on("a#url", new ElementHandler("", "Go to my website"))
    .on("a#url", new ElementHandler("href", "https://www.andrewgao.org/"));

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Responds to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  // initial fetch for endpoints
  const json = await fetchResponse(BASE_URL);

  // default response
  let response = new Response("Default response");

  // get cookies
  const cookie = request.headers.get("cookie");

  if (cookie && cookie.includes("variant=0")) {
    // has cookie for variant 0
    response = getRewriteHTML(await fetch(json.variants[0]), 0);
  } else if (cookie && cookie.includes("variant=1")) {
    // has cookie for variant 1
    response = getRewriteHTML(await fetch(json.variants[1]), 1);
  } else {
    // no cookie, get random variant, set cookies
    const { num, url } = getVariantInfo(json);
    response = getRewriteHTML(await fetch(url), num);
    response.headers.append("Set-Cookie", `variant=${num}`);
  }

  return response;
}

/**
 * Gets the HTML response with correct headers and rewritten data
 * @param {Response} resp
 * @param {number} variant - variant number for replacing text
 */
function getRewriteHTML(resp, variant) {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  };
  return new Response(rewriter(variant).transform(resp).body, init);
}

/**
 * Gets random route from JSON
 * @param {any} json
 */
function getVariantInfo(json) {
  const variants = json.variants;
  const rand = getRandom(0, variants.length);
  const url = variants[rand];
  return { num: rand, url };
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
 * Source:
 * https://developers.cloudflare.com/workers/templates/pages/fetch_html/
 *
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
