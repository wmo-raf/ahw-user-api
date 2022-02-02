import config from "config";
import bunyan = require("bunyan");
import type Logger from "bunyan";
import bformat from "bunyan-format";

// @ts-ignore
import gelfy = require("gelfy");

const formatOut = bformat({ outputMode: "long" });
const formatErr = bformat({ outputMode: "long" }, process.stderr);

const streams: Record<string, unknown>[] = [
    {
        stream: formatOut,
        level: config.get("logger.level") || "debug",
    },
    {
        stream: formatErr,
        level: "warn",
    },
];

if (config.get("logger.toFile")) {
    streams.push({
        level: config.get("logger.level") || "debug",
        path: config.get("logger.dirLogFile"),
    });
}

// log to graylog if configured
if (config.get("logger.graylog.host") && config.get("logger.graylog.port")) {
    const bunyanStream = gelfy.createBunyanStream({
        host: config.get("logger.graylog.host"),
        port: config.get("logger.graylog.port"),
        protocol: "udp",
    });

    streams.push({
        stream: bunyanStream,
        type: "raw",
        level: "info",
    });
}

const logger: Logger = bunyan.createLogger({
    name: config.get("logger.name"),
    src: true,
    streams,
});

export default logger;
