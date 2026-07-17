export function parseUA(ua) {
  if (!ua) return { deviceType: "unknown", browser: "Other", os: "Other" };

  let deviceType = "desktop";
  if (/mobile|android.*mobile|iphone|ipod/i.test(ua)) deviceType = "mobile";
  else if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) deviceType = "tablet";

  let browser = "Other";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua) && !/opr|opera/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/mac/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  return { deviceType, browser, os };
}
