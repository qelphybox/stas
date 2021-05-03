const http = require('http')
const querystring = require('querystring')

class CallbackServer {
    #server;
    #youtube;

    constructor() {
        // FIXME: youtube service constrained is a singleton for now, but proper DI should be considered
        // this.#youtube = require('./youtube')
        this.#server = http.createServer(
            this.#oAuth2Listener
        )
    }

    async #oAuth2Listener(req, res) {
        const queryObj = querystring.parse(req.qs);
        // this.#youtube.submitConsentCode(queryObj.code)
        res.end("Unimplemented yet")
    }

    async start() {
        this.#serverIfValid()
            .then((aliveServer) => {
                aliveServer.listen(
                    process.env.CALLBACK_SERVER_PORT
                )
            })
            .catch(console.error)
    }

    async stop() {
        this.#serverIfValid()
            .then((aliveServer) => {
                aliveServer.stop()
                this.#server = null
            })
            .catch(console.error)
    }

    async #serverIfValid() {
        return new Promise((resolve, reject) => {
            if (this.#server)
                resolve(this.#server)
            else
                reject("Server is already down")
        })
    }

}

module.exports = new CallbackServer()
