import http from "http";

const regex = /Content-Length:\s*(\d+)/i;
const soi = Buffer.from([0xff, 0xd8]);
const eoi = Buffer.from([0xff, 0xd9]);

const webStream = {
  get: function (url, callback) {
    const clientRequest = http.get(url, function (response) {
      let buffer = null;

      let reading = false;
      let contentLength = null;
      let bytesWritten = 0;

      response.on("data", function (chunk) {
        const start = chunk.indexOf(soi);
        const end = chunk.indexOf(eoi);
        const len = (regex.exec(chunk.toString("ascii")) || [])[1];

        if (buffer && (reading || start > -1)) {
          const bufStart = start > -1 && start < end ? start : 0;
          const bufEnd = end > -1 ? end + eoi.length : chunk.length;

          chunk.copy(buffer, bytesWritten, bufStart, bufEnd);

          bytesWritten += bufEnd - bufStart;

          if (end > -1 || bytesWritten === contentLength) {
            callback(buffer);

            buffer = null;
            contentLength = null;
            bytesWritten = 0;
            reading = false;
          } else {
            reading = true;
          }
        }

        if (len) {
          contentLength = +len;
          buffer = Buffer.alloc(+len);
          bytesWritten = 0;

          const hasStart = typeof start !== "undefined" && start > -1;
          const hasEnd = typeof end !== "undefined" && end > -1 && end > start;

          if (hasStart) {
            let bufEnd = chunk.length;

            if (hasEnd) {
              bufEnd = end + eoi.length;
            }

            chunk.copy(buffer, 0, start, bufEnd);

            bytesWritten = chunk.length - start;

            if (hasEnd) {
              callback(buffer);

              buffer = null;
              contentLength = null;
              bytesWritten = 0;
              reading = false;
            } else {
              reading = true;
            }
          }
        }
      });
    });

    clientRequest.on("error", function (err) {
      console.log(err);
    });

    return {
      url: url,
      handler: clientRequest,
      on: function (type, listener) {
        clientRequest.on(type, listener);
      },
      abort: function () {
        clientRequest.abort();
      },
    };
  },
};

export default class WebCamera {
  port: string;
  screenshot: Buffer;

  constructor(port) {
    this.port = port;
  }

  async fetch() {
    return new Promise((resolve, reject) => {
      webStream.get(`http://localhost:${this.port}`, (data) => {
        resolve(data);
      });
    });
  }
}
