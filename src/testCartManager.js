import CartManager from "./CartManager.js";

async function testCartManager() {
    const cartManager = new CartManager('database/cartDb.json')

    // test createCart method
    const newCart = await cartManager.createCart()
    console.log("Creando carrito: ", newCart )

    // test getCarts
    const carts = await cartManager.getCarts()
    console.log("Carts: ", carts )
}

testCartManager()