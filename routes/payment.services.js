import Transaction from "../models/transaction.model.js"

export const paySupplier = async (invoice, amount, payment_method, notes) => {
    try {
        const payment = new Transaction({
            
        })
    } catch (error) {
        throw new Error(error)
    }
}