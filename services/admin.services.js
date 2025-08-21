export const createSupplier = async (req, res) => {
    const { } = req.body;
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
}