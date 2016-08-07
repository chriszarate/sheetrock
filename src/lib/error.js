class SheetrockError extends Error {
  constructor(message = '', code = null) {
    super();
    this.name = 'SheetrockError';
    this.code = code;
    this.message = message;
  }
}

export default SheetrockError;
