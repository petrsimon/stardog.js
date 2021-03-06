const { fetch } = require('../fetch');

const { httpBody } = require('../response-transforms');

const jsonify = res => {
  res.headers.append('content-type', 'application/json');
  return res;
};

const consistency = (conn, database, options = {}, params = {}) => {
  const headers = conn.headers();
  headers.append('Accept', 'text/boolean');

  const uri = `${conn.uri(
    database,
    'reasoning',
    'consistency'
  )}${options.namedGraph ? `?graph-uri=${options.namedGraph}` : ''}`;

  return fetch(uri, {
    headers,
  }).then(httpBody);
};

// contentType - application/x-turtle, text/turtle, application/rdf+xml, text/plain, application/x-trig, text/x-nquads, application/trix
const explainInference = (conn, database, inference, config, params) => {
  const headers = conn.headers();
  headers.append('content-type', config.contentType);
  headers.append('accept', 'application/json');

  return fetch(conn.uri(database, 'reasoning', 'explain'), {
    method: 'POST',
    headers,
    body: inference,
  })
    .then(jsonify)
    .then(httpBody);
};

const explainInconsistency = (conn, database, options = {}, params = {}) => {
  const headers = conn.headers();
  headers.append('accept', 'application/json');
  const uri = `${conn.uri(
    database,
    'reasoning',
    'explain',
    'inconsistency'
  )}${options.namedGraph ? `?graph-uri=${options.namedGraph}` : ''}`;

  return fetch(uri, {
    method: 'POST',
    headers,
  })
    .then(jsonify)
    .then(httpBody);
};

// contentType - application/x-turtle, text/turtle, application/rdf+xml, text/plain, application/x-trig, text/x-nquads, application/trix
const explainInferenceInTransaction = (
  conn,
  database,
  transactionId,
  inference,
  config,
  params = {}
) => {
  const headers = conn.headers();
  headers.append('Content-Type', config.contentType);
  if (config.encoding) {
    headers.append('Content-Encoding', config.encoding);
  }
  return fetch(conn.uri(database, 'reasoning', transactionId, 'explain'), {
    method: 'POST',
    headers,
    body: inference,
  }).then(httpBody);
};

const explainInconsistencyInTransaction = (
  conn,
  database,
  transactionId,
  options = {},
  params = {}
) => {
  const headers = conn.headers();
  const uri = `${conn.uri(
    database,
    'reasoning',
    transactionId,
    'explain',
    'inconsistency'
  )}${options.namedGraph ? `?graph-uri=${options.namedGraph}` : ''}`;

  return fetch(uri, {
    method: 'POST',
    headers,
  }).then(httpBody);
};

const schema = (conn, database, params = {}) => {
  const headers = conn.headers();
  headers.append('Accept', 'application/ld+json');

  return fetch(conn.uri(database, 'reasoning', 'schema'), {
    headers,
  }).then(httpBody);
};

module.exports = {
  consistency,
  explainInference,
  explainInconsistency,
  explainInferenceInTransaction,
  explainInconsistencyInTransaction,
  schema,
};
