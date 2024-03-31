export const socketEvents = socket => {
  console.log('helper called');

  const engine = socket.io.engine;
  console.log('engine transport name', engine.transport.name);

  socket.on('connect', () => {
    console.log('connect', socket.connected);
  });

  socket.on('disconnect', reason => {
    console.log('disconnect', reason);
  });

  engine.once('upgrade', () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log('upgrade', engine.transport.name); // in most cases, prints "websocket"
  });

  engine.on('packet', ({type, data}) => {
    // called for each packet received
    console.log('packet', type, data);
  });

  engine.on('packetCreate', ({type, data}) => {
    // called for each packet sent
    console.log('packetCreate', type, data);
  });

  engine.on('drain', () => {
    // called when the write buffer is drained
    console.log('drain');
  });

  engine.on('close', reason => {
    // called when the underlying connection is closed
    console.log('close', reason);
  });

  socket.on('error', error => {
    console.log('socket error ', error);
  });

  socket.on('reconnect', attempt => {
    console.log('reconnect: ', attempt);
  });

  socket.on('reconnect_attempt', attempt => {
    console.log('reconnect_attempt: ', attempt);
  });

  socket.on('reconnect_error', error => {
    console.log('reconnect_error: ', error);
  });

  socket.on('reconnect_failed', () => {
    console.log('reconnect_failed');
  });
};
