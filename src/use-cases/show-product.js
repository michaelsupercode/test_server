const { findById } = require("../db-access/products-dao");

async function showProduct({ productId }) {
    const product = await findById(productId)
    const productView = productToProductView(product)
    return productView
}

function productToProductView(product) {
    console.log("inside productToProductView:", product)
    const productCopy = {...product }

    delete productCopy.stockCount

    productCopy.isAvailible = product.stockCount > 0
    productCopy.isLimited = product.stockCount < 10

    return productCopy
}

module.exports = {
    showProduct
}