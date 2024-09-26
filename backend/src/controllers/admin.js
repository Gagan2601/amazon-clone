const errorHandler = require('../middlewares/errorHandler');
const Admin = require('../models/admin');
const Order = require('../models/order');
async function fetchCategoryWiseProduct(category) {
    let earnings = 0;
    try {
        let categoryOrders = await Order.find({
            "products.product.category": category,
        }).populate("products.product"); 
        for (let i = 0; i < categoryOrders.length; i++) {
            for (let j = 0; j < categoryOrders[i].products.length; j++) {
                const product = categoryOrders[i].products[j].product;
                earnings +=
                    categoryOrders[i].products[j].quantity *
                    (product.discountedPrice || product.originalPrice); 
            }
        }
        return earnings;
    } catch (error) {
        console.error(error);
        return 0; 
    }
}

exports.analytics = async (req, res) => {
    try {
        const totalEarnings = await fetchCategoryWiseProduct();
        const electronicsEarnings = await fetchCategoryWiseProduct("Electronics");
        const essentialEarnings = await fetchCategoryWiseProduct("Essentials");
        const applianceEarnings = await fetchCategoryWiseProduct("Appliances");
        const booksEarnings = await fetchCategoryWiseProduct("Books");
        const fashionEarnings = await fetchCategoryWiseProduct("Fashion");
        const earnings = {
            totalEarnings,
            electronicsEarnings,
            essentialEarnings,
            applianceEarnings,
            booksEarnings,
            fashionEarnings,
        };
        res.status(200).json(earnings);
      } catch (e) {
        errorHandler(err, req, res);
      }
}