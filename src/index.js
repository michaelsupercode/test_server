const cors = require("cors")
const morgan = require("morgan")
const express = require("express")
const multer = require("multer")

const { listAllProducts } = require("./use-cases/list-all-products")
const { showProduct } = require("./use-cases/show-product")
const { createNewProduct } = require("./use-cases/create-new-product")
const { registerUser } = require("./use-cases/register-user")
const { addProductToUserWishlist } = require("./use-cases/add-product-to-user-wishlist")
const { login } = require("./use-cases/login-user")
const { showUserInfo } = require("./use-cases/show-user-info")
const { doAuthMiddleware } = require("./auth/auth-middleware")
const { imageBufferToBase64 } = require("./utils/hash")

const PORT = process.env.PORT || 7077
const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.get("/", ( _, res) => {
    res.send("..shopserver is running :)")
})

app.get("/api/products/all", async function getAllProductsController(_, res) {
    try {
        const products = await listAllProducts()
        res.json(products)
    } catch (error) {
        res.status(500).json({ err: error.message || "Unknown error while reading products." })
    }
})

app.get("/api/products/single/:id", async(req, res) => {
    try {
        const id = req.params.id

        const product = await showProduct({ productId: id })
        res.json(product)
    } catch (error) {
        res.status(500).json({ err: error.message || "Unknown error while reading product." })
    }
})

const upload = multer()
const uploadMiddleware = upload.single("productImage")
app.post("/api/products/add", doAuthMiddleware, uploadMiddleware, async(req, res) => {
    try {
        const productInfo = req.body

        const imageLink = imageBufferToBase64(req.file.buffer, req.file.mimetype, )
        const variations = JSON.parse(productInfo.variations)

        const product = await createNewProduct({...productInfo, variations, imageLink })
        res.json(product)
    } catch (error) {
        res.status(500).json({ err: error.message || "Unknown error while creating new product." })
    }
})

app.post("/api/users/register", async(req, res) => {
    try {
        const userInfo = req.body

        const user = await registerUser(userInfo)
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: error.message || "Unknown error while registering new user." })
    }
})

app.post("/api/users/login", async(req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const token = await login({ email, password })
        res.json({ token })
    } catch (error) {
        console.log(error)
        res.status(404).json({ err: "Not found." })
    }
})

app.get("/api/users/userInfo", doAuthMiddleware, async(req, res) => {
    try {
        const userId = req.userClaims.sub

        const userInfo = await showUserInfo({ userId })
        res.status(201).json(userInfo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ err: error.message || "Unknown error while getting your user info." })
    }
})

app.post("/api/users/addToWishlist", doAuthMiddleware, async(req, res) => {
    try {
        const userId = req.userClaims.sub
        const productId = req.body.productId

        const wishlist = await addProductToUserWishlist({ userId, productId })
        res.status(201).json({ wishlist })
    } catch (error) {
        res.status(500).json({ err: error.message || "Unknown error while adding product to user whishlist." })
    }
})

app.listen(PORT, () => console.log("Server listening on port", PORT))
