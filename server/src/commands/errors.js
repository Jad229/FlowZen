export function notFound(message) {
  const err = new Error(message);
  err.status = 404;
  return err;
}
