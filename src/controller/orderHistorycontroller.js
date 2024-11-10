// // const orderHistoryService = require('../service/orderHistoryservice');

// // Function to fetch all order histories
// const getAllOrderHistories = async (req, res) => {
//     try {
//         const orderHistories = await orderHistoryService.getAllOrderHistories();
//         res.status(200).json(orderHistories);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching all order histories', error: error.message });
//     }
// };

// // Function to fetch a specific order history by ID
// const getOrderHistoryById = async (req, res) => {
//     try {
//         const userId = res.locals.userId
//         console.log(userId)
//         const orderHistory = await orderHistoryService.getOrderHistoryById(userId);
//         if (!orderHistory) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.status(200).json(orderHistory);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching order history', error: error.message });
//     }
// };


// module.exports = {
//     getAllOrderHistories,
//     getOrderHistoryById
// };
