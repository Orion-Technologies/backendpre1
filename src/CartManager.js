import { createRequire } from 'module'
import ProductManager from './ProductManager.js'

const require = createRequire(import.meta.url)
const fs = require('fs')
const { title } = require('process')

class CartManager {
    #path
    #format
    #carts
    #name

    constructor(path) {
        this.#name = "Carrito"
        this.#path = path
        this.#format = "utf-8"
        this.#carts = []
    }

    autoId = () => {
        if(this.#carts.length === 0) {
            return 1
        } else {
            const maxId = Math.max(...this.#carts.map(cart => cart.id))
            return maxId + 1
        }
    }

    // when I read the file and it is empty or parsing error returning an empty array
    async getCarts() {
        try {
            const fileContent = await fs.promises.readFile(this.#path, this.#format)
            return fileContent ? JSON.parse(fileContent) : []
        } catch (e) {
            
            console.error("Error al leer el archivo: ", e.message)
            return []
        }
    }

    async getProducts() {
        const productManager = await ProductManager('database/db.json')
    }

    async createCart(products = []) {
        this.#carts = await this.getCarts()
        const id = this.autoId()
        const cartName = this.#name
        const cart = {id, cartName, products }
        const cartIdValidate = cartId => cartId.id === id
        if(this.#carts.some(cartIdValidate)){
            console.log("El carrito ya existe")
        } else {
            this.#carts.push(cart)
            await fs.promises.writeFile(
                this.#path,
                JSON.stringify(this.#carts, null, "\t")
            )
            return cart
        }
    }

    async addProductToCart(cartId, productId) {
        this.#carts = await this.getCarts()
        let cart = this.#carts.find(c => c.id === cartId)
        if(!cart){
            return null
        }
        let productEntry = cart.products.find(p => p.id === productId)
        if(productEntry) {
            productEntry.quantity += 1
        } else {
            cart.products.push({id: productId, quantity:1})
        }
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#carts, null, "\t"))
        return cart
    }
}

export default CartManager