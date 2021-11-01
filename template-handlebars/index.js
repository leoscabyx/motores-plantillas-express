const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const fs = require ( 'fs' ) 

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const handlebars = require('express-handlebars')

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "layout.hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
    })
)

app.set("view engine", "hbs")

app.set("views", "./views")

// app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

const productos = []

app.get("/", (req, res) => {
    // res.send("ok")
    res.render("index", { page: "Inicio", productos })
})

// app.post("/", (req, res) => {
//     // res.send("ok")
//     const { title, price, thumbnail } = req.body
//     const nuevoProducto = { title, price, thumbnail }
//     productos.push(nuevoProducto)
//     res.render("index", { page: "Inicio", productos })
// })

// app.get("/productos", (req, res) => {
//     // res.send("ok")
//     res.render("productos", { productos, page: "Productos" })
// })

io.on('connection', async (socket) => { 
    //"connection" se ejecuta la primera vez que se abre una nueva conexión
    console.log('Usuario conectado') // Se imprimirá solo la primera vez que se ha abierto la conexión

    socket.on('producto', (data) => {
        productos.push(data)
        io.sockets.emit('productos', productos)
    })
    
    socket.emit('productos', productos)

    const leerMsjs = async () => {
        try {
            const msjs = await fs.promises.readFile('./mensajes.txt', 'utf-8')
            let dataObjeto = null
            if (!msjs) {
                dataObjeto = []
            }else{
                dataObjeto = JSON.parse(msjs)
            }
            return dataObjeto
        } catch (error) {
            console.log(error)
        }
    }

    socket.on('msj', async (data) => {
        try {
            const msjs = await leerMsjs()
            msjs.push(data)
            await fs.promises.writeFile('./mensajes.txt', JSON.stringify(msjs, null, 2))
            io.sockets.emit('msjs', msjs)
        } catch (error) {
            console.log(error)
        }
    })

    const getMsjs = await leerMsjs()
    // console.log(getMsjs)
    socket.emit('msjs', getMsjs)
    
})

const PORT = process.env.PORT || 8080

const server = httpServer.listen(PORT, () => {
    console.log(`Ya me conecte al puerto ${server.address().port} !!`)
})

server.on('error', (error) =>{
    console.log('hubo un error....')
    console.log(error)
})