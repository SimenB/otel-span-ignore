"use strict";

const {
  NodeTracerProvider,
  RandomIdGenerator,
} = require("@opentelemetry/sdk-trace-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");

const idGenerator = new RandomIdGenerator();

const exporter = new CollectorTraceExporter();
const provider = new NodeTracerProvider({
  idGenerator,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-service",
  }),
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

registerInstrumentations({
  instrumentations: [
    getNodeAutoInstrumentations({
      // load custom configuration for http instrumentation
      "@opentelemetry/instrumentation-http": {
        ignoreIncomingRequestHook: (request) =>
          request.url?.endsWith("/ignore"),
      },
    }),
  ],
});

module.exports.idGenerator = idGenerator;
