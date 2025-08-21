import GoodsReceivedNotice from "../models/grn.model.js"

export const issueGRN = async (order, received_quantity) => {
    try {
        const grn = new GoodsReceivedNotice({
            purchase_order : order._id,
            received_quantity : received_quantity,
            status : received_quantity === purchase_order.item.quantity ? "COMPLETE" : "PARTIAL",
            total_value : received_quantity * purchase_order.item.unit_price
        });
        await grn.save();
    } catch (error) { 
        throw new Error(error)
    }
}