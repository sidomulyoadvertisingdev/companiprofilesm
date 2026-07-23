import sanitizeHtml from "sanitize-html";

export const safeHtmlOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img", "style", "table", "tr", "td", "tbody", "thead", "th", "col", "colgroup", "h1", "h2", "h3", "h4", "h5", "h6", "hr"
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["style", "class", "id", "align", "valign", "width", "height", "cellpadding", "cellspacing", "role"],
    "img": ["src", "alt", "style", "width", "height"],
    "a": ["href", "name", "target", "style"]
  },
  allowedSchemes: ["http", "https", "data"]
};

export function cleanHtml(html) {
  if (!html) return "";
  return sanitizeHtml(html, safeHtmlOptions);
}
