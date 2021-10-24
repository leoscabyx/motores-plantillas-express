const express = require('express')
const app = express()

app.set("view engine", "pug")

app.set("views", "./views")

// app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

const productos = []

app.get("/", (req, res) => {
    // res.send("ok")
    res.render("index", { page: "Inicio" })
})

app.post("/productos", (req, res) => {
    // res.send("ok")
    const { title, price, thumbnail } = req.body
    const nuevoProducto = { title, price, thumbnail }
    productos.push(nuevoProducto)
    res.redirect("/")
})

app.get("/productos", (req, res) => {
    // res.send("ok")
    res.render("productos", { productos, page: "Productos" })
})


const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log(`Ya me conecte al puerto ${server.address().port} !!`)
})

server.on('error', (error) =>{
    console.log('hubo un error....')
    console.log(error)
})