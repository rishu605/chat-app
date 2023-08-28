const net = require("net")

const server = net.createServer()

// Array of client sockets
const clients = []

server.on("connection", (socket) => {
    const clientId = clients.length + 1
    clients.map((client) => {
        client.socket.write(`User ${clientId} joined!`)
    })
    socket.write(`id-${clientId}`)
    console.log("A new connection to the server made")

    socket.on("data", (data) => {
        const dataString = data.toString("utf-8")
        const id = dataString.substring(0, dataString.indexOf("-"))
        const message = dataString.substring(dataString.indexOf("-message-") + 9)
        clients.map((client) => {
            client.socket.write(`User ${id}: ${message}`)
        })
        // socket.write(data)
    })
    // Broadcast to everyone whenever anyone leaves the chatroom
    socket.on("end", () => {
        clients.map(client => {
            client.socket.write(`User ${clientId} left!`)
        })
        console.log(clients)
    })

    clients.push({id: clientId.toString(), socket})
})

server.listen(3000, "127.0.0.1", () => {
    console.log(`Server started at`,server.address())
})