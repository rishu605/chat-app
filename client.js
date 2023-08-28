const net = require("net")
const readline = require("readline/promises")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const clearLine = (dir) => {
    return new Promise((resolve) => {
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}

let id;

const socket = net.createConnection({port: 3000, host: "127.0.0.1"}, async () => {
    console.log("Connected to the server")

    const ask = async () => {
        const message = await rl.question("Enter a message >")
        await moveCursor(0, -1)
        await clearLine(0) // Clear the current line the cursor is in
        
        socket.write(`${id}-message-${message}`)
    }

    ask()

    socket.on("data", async (data) => {
        console.log()
        await moveCursor(0, -1)
        await clearLine(0)
        if(data.toString("utf-8").substring(0, 2) === "id") {
            // When we are getting an id
            id = data.toString("utf-8").substring(3) //Grab everyhting till last
            console.log(`Your id is ${id} \n`)
        } else {
            // When we are getitng a message
            console.log(data.toString("utf-8"))
        }
        ask()
    })

})

socket.on("end", () => {
    console.log("Connection was ended")
})

socket.on("error", (err) => {
    console.log(err)
})