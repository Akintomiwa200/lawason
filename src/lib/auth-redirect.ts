export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function loginHref(returnPath = "/") {
  const path = safeReturnPath(returnPath);
  if (path === "/") {
    return "/login";
  }

  return `/login?next=${encodeURIComponent(path)}`;
}

export function registerHref(returnPath = "/") {
  const path = safeReturnPath(returnPath);
  if (path === "/") {
    return "/register";
  }

  return `/register?next=${encodeURIComponent(path)}`;
}
