// XSS Protection Middleware
// Sanitizes user input to prevent XSS attacks

const sanitizeInput = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    if (typeof obj === "string") {
      // Remove dangerous characters and HTML tags
      return obj.replace(/[<>\"'&]/g, (char) => {
        const escapeMap = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "&": "&amp;",
        };
        return escapeMap[char];
      });
    }
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Sanitize the key
      const sanitizedKey = sanitizeInput(key);
      // Sanitize the value
      sanitized[sanitizedKey] = sanitizeInput(obj[key]);
    }
  }

  return sanitized;
};

const xssProtection = (req, res, next) => {
  // Sanitize query parameters
  if (req.query && Object.keys(req.query).length > 0) {
    req.query = sanitizeInput(req.query);
  }

  // Sanitize request body
  if (req.body && Object.keys(req.body).length > 0) {
    req.body = sanitizeInput(req.body);
  }

  // Sanitize URL parameters
  if (req.params && Object.keys(req.params).length > 0) {
    req.params = sanitizeInput(req.params);
  }

  // Set security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  );

  next();
};

module.exports = xssProtection;
