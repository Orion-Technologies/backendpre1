import { Router } from "express";
import ProductManager from '../ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
    const productManager = new ProductManager('./database/db.json')
    const data = await productManager.getProducts()
    //res.json({data})
    // let products = JSON.parse(data)
    let products = data

    if(req.query.limit) {
        const limit = parseInt(req.query.limit)
        if(!isNaN(limit)){
            products = products.slice(0, limit)
        }
    }
    console.log(products)
    res.json({ data: products })
})

router.get('/:id', async (req, res) => {
    const productManager = new ProductManager('./database/db.json')
    const data = await productManager.getProducts()
    let products = data
    if(req.params.id){
        const id = parseInt(req.params.id)
        if(!isNaN(id)){
            products = products.filter(product => product.id === id)
        }
    }
    console.log(products)
    res.json({ data:products })
})

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock} = req.body

    const productManager = new ProductManager('./database/db.json')
    const addedProduct = await productManager.addProduct(title, description, price, thumbnail, code, stock)
        if(!addedProduct) {
            return res.status(500).json({error: "En este momento no es posible agregar tu producto, ententa de nuevo"})
        }
    res.status(201).json(addedProduct)
})

router.put('/:id', async(req, res) => {
    const id = parseInt(req.params.id)
    // if id is not a numbert or is empty
    if(isNaN(id)){
        return res.status(400).json({error:'ID invalido'})
    }
    const productManager = new ProductManager('./database/db.json')

    // here I'm updating my data
    const updateData = req.body

    // using updateProduct method to update the json
    const updatedProduct = await productManager.updateProduct(id, updateData)
    
    // validating my info
    if(updatedProduct) {
        res.json(updatedProduct)
    } else {
        res.status(404).json({ error: 'El producto no pudo ser actualizado'})
    }
})

router.delete('/:id', async(req, res) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)){
        return res.status(400).json({error: "ID invalido"})
    }
    const productManager = new ProductManager('./database/db.json')

    // here I'm updating my data
    const updateData = req.body

    // using deleteProduct method to delete product
    const deleteProduct = await productManager.deleteProduct(id)

    // validating my info
    if(deleteProduct) {
        res.json(deleteProduct)
    } else {
        res.status(400).json({ error: "No se pudo borrar el producto"})
    }
})

export default router