export default (_, res) => {
  // Set response headers & information
  res.statusCode = 200;
  res.json({ data: "It works!" });
}