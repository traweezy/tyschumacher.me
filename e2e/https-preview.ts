// WebKit upgrades HTTP subresources under the production CSP, including loopback.
// Keep that policy intact and terminate TLS locally with a temporary certificate.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { request } from "node:http";
import { createServer } from "node:https";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = Number(process.argv[2] ?? 3000);
if (!Number.isInteger(port) || port < 1024 || port > 65534) {
  throw new Error("Expected a local preview port between 1024 and 65534.");
}

const directory = mkdtempSync(join(tmpdir(), "portfolio-https-"));
const key = join(directory, "key.pem");
const cert = join(directory, "cert.pem");
try {
  execFileSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-days",
      "1",
      "-subj",
      "/CN=localhost",
      "-addext",
      "subjectAltName=IP:127.0.0.1,DNS:localhost",
      "-keyout",
      key,
      "-out",
      cert,
    ],
    { stdio: "ignore" },
  );
} catch (error) {
  rmSync(directory, { recursive: true, force: true });
  throw error;
}

const server = createServer(
  { key: readFileSync(key), cert: readFileSync(cert) },
  (incoming, outgoing) => {
    const upstream = request(
      {
        hostname: "127.0.0.1",
        port,
        path: incoming.url,
        method: incoming.method,
        headers: {
          ...incoming.headers,
          host: `127.0.0.1:${port}`,
          "x-forwarded-proto": "https",
        },
        timeout: 15_000,
      },
      (response) => {
        outgoing.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(outgoing);
      },
    );
    upstream.on("timeout", () =>
      upstream.destroy(new Error("Preview request timed out.")),
    );
    upstream.on("error", () => {
      if (!outgoing.headersSent)
        outgoing.writeHead(502, { "content-type": "text/plain" });
      outgoing.end("Local preview unavailable.");
    });
    incoming.on("aborted", () => upstream.destroy());
    outgoing.on("close", () => {
      if (!outgoing.writableFinished) upstream.destroy();
    });
    incoming.pipe(upstream);
  },
);
server.requestTimeout = 20_000;
server.headersTimeout = 10_000;
server.listen(port + 1, "127.0.0.1");

const stop = () => {
  server.closeAllConnections();
  server.close(() => {
    rmSync(directory, { recursive: true, force: true });
    process.exit(0);
  });
};
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
