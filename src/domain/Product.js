function makeProduct({ _id, title, description, price, variations, imageLink, stockCount, createdAt }) {
    if (!Array.isArray(variations)) {
        throw new Error("Product variations must be an array.")
    }

    return {
        title: title || "New Product",
        description,
        price,
        variations,
        imageLink: imageLink || "",
        stockCount,
        createdAt: createdAt || Date.now(),
        _id
    }
}

module.exports = {
    makeProduct
}