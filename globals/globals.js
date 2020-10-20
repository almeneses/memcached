const Globals = {
  OPERATIONS : {
    STORE: ["add", "set", "replace", "append", "prepend", "cas"],
    RETRIEVE: ["get", "gets"],
    QUIT: ["quit"]
  },

  RESPONSE : {
    ERROR: "ERROR\r\n",
    STORED: "STORED\r\n",
    NOT_STORED: "NOT_STORED\r\n",
    EXISTS: "EXISTS\r\n",
    NOT_FOUND: "NOT_FOUND\r\n",
    SERVER_ERROR: "SERVER_ERROR",
    CLIENT_ERROR: "CLIENT_ERROR",
  },

  ERRORS: {

    RECORD_BIGGER_THAN_ALLOWED: "The size of the value is greater than the allowed value",
    COMMAND_IN_BAD_FORMAT: "The given command or arguments do not comply with this memcached protocol"

  }
}

module.exports = Globals;