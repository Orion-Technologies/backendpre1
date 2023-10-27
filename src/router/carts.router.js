import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const router = Router()
const cartManager = new CartManager('./database/cartDb.json')
const productManager = new ProductManager('./database/db.json')

router.get('/:id', async (req, res) => {
    const cartManager = new CartManager('./database/cartDb.json')
    const data = await cartManager.getCarts()
    let carts = data

    if(req.query.id) {
        const id = parseInt(req.query.id)
        if(!isNaN(id)){
            carts = carts.filter(cart => cart.id === id)
        }
    }
    console.log(carts)
    res.json({data:carts})
})

router.post('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const newCart = await cartManager.createCart(products);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message})
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)
    
    if(isNaN(cartId) || isNaN(productId)){
        return res.status(400).json({error: "Carrito o producto ID invalido"})
    }

    const cartManager = new CartManager('./database/cartDb.json')
    const productManager = new ProductManager('./database/db.json')

    const product = await productManager.getProductsById(productId)
    if(!product){
        return res.status(404).json({error: "Product not found"})
    }

    const updatedCart = await cartManager.addProductToCart(cartId, productId)
    if(!updatedCart){
        return res.status(500).json({error: "No se pudo agregar el producto al carrito"})
    }
    res.json(updatedCart)
})

export default router
