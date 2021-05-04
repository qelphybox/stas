const http = require('http')
const url = require('url');
const gapi = require('./gapi')

class CallbackServer {
    #server;

    constructor() {
        this.#server = http.createServer(
            this.#oAuth2Listener
        )
    }

    #oAuth2Listener(req, res) {
        // FIXME deprecated
        const queryObj = url.parse(req.url, true).query;
        gapi.submitAuthCode(queryObj.code)
            .then(() => res.end("OK"))
            .catch(() => res.end("UNFORTUNATELY, NOT OK"))
    }

    async start() {
        this.#serverIfValid()
            .then((aliveServer) => {
                aliveServer.listen(
                    process.env.PORT
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
