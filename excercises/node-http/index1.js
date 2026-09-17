import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const hostname = "localhost";
const port = 3000;

const publicDirectory = path.join(import.meta.dirname, "public");

function sendHtml(res, statusCode, html) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(html);
}

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return sendHtml(
      res,
      405,
      `<h1>405 - Method ${req.method} is not supported</h1>`,
    );
  }

  const pathname = new URL(req.url, `http://${req.headers.host ?? hostname}`)
    .pathname;

  const pages = {
    "/": "index.html",
    "/index.html": "index.html",
    "/aboutus.html": "aboutus.html",
  };

  const fileName = pages[pathname];

  if (!fileName) {
    return sendHtml(res, 404, `<h1>404 - ${pathname} was not found</h1>`);
  }

  const filePath = path.join(publicDirectory, fileName);

  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.error(error);

      return sendHtml(res, 500, "<h1>500 - Unable to read the file</h1>");
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(data);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
