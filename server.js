"use strict";

const { idGenerator } = require("./tracer");
const api = require("@opentelemetry/api");

const fastify = require("fastify");
const pino = require("pino");

const tracer = api.trace.getTracer("startup");

tracer.startActiveSpan("startup", async (span) => {
  const logger = pino({ transport: { target: "pino-pretty" } });

  const app = fastify({
    logger,
    genReqId() {
      const spanContext = api.trace.getActiveSpan()?.spanContext();

      if (spanContext) {
        logger.info(spanContext, "span context in `genReqId`");
      } else {
        logger.error("No active span in `genReqId`");
      }

      return spanContext?.traceId ?? idGenerator.generateTraceId();
    },
    disableRequestLogging: true,
  });

  app.get("/", (req, res) => {
    const spanContext = api.trace.getActiveSpan()?.spanContext();

    res.send(
      "Hello World! " +
        JSON.stringify(spanContext, null, 2) +
        "\nid: " +
        req.id +
        "\n",
    );
  });

  app.get("/ignore", (req, res) => {
    const spanContext = api.trace.getActiveSpan()?.spanContext();

    res.send(
      "Hello World! " +
        JSON.stringify(spanContext, null, 2) +
        "\nid: " +
        req.id +
        "\n",
    );
  });

  app.log.info("start listening");

  await app.listen({ port: 8081 });

  app.log.info("ready!");

  span.end();
});
