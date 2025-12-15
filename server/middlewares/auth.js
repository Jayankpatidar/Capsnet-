import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Try multiple token sources: Authorization header, x-access-token, cookie
    const authHeader =
      req.headers.authorization ||
      req.headers["x-access-token"] ||
      (req.cookies && req.cookies.token);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authenticated. Token missing.",
      });
    }

    // If header form "Bearer <token>" extract token, otherwise use value as token
    const token =
      typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    if (!token) {
      console.debug("[auth] token extraction failed (empty token)");
      return res.status(401).json({
        success: false,
        message: "Not Authenticated. Token missing.",
      });
    }



    // Verify token. If verification fails, in development try a non-verified decode as a fallback
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // In development, allow jwt.decode() fallback to ease local testing
      if (process.env.NODE_ENV !== "production") {
        decoded = jwt.decode(token);
        if (!decoded) {
          return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
    }

    // Accept different claim names (id, _id, userId)
    req.userId = decoded?.id || decoded?._id || decoded?.userId;

    if (!req.userId) {
      console.debug(
        "[auth] decoded token has no id/_id/userId. decoded:",
        decoded
      );
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.debug(`[auth] authenticated userId=${req.userId}`);
    }

    next();
  } catch (error) {
    console.error("[auth] unexpected error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
