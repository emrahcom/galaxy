export function internalServerError(): Response {
  const body = {
    error: {
      message: "Internal Server Error",
    },
  };

  return new Response(JSON.stringify(body), {
    status: 500,
  });
}

// -----------------------------------------------------------------------------
export function methodNotAllowed(): Response {
  const body = {
    error: {
      message: "Method Not Allowed",
    },
  };

  return new Response(JSON.stringify(body), {
    status: 405,
  });
}

// -----------------------------------------------------------------------------
export function notFound(): Response {
  const body = {
    error: {
      message: "Not Found",
    },
  };

  return new Response(JSON.stringify(body), {
    status: 404,
  });
}

// -----------------------------------------------------------------------------
export function ok(body: string): Response {
  return new Response(body, {
    status: 200,
  });
}

// -----------------------------------------------------------------------------
export function unauthorized(): Response {
  const body = {
    error: {
      message: "Unauthorized",
    },
  };

  return new Response(JSON.stringify(body), {
    status: 401,
  });
}
