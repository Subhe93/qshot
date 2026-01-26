export default defineEventHandler((event) => {
  const forwarded = getRequestHeader(event, "x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : event.node.req.socket.remoteAddress;
  return { ip };
});
