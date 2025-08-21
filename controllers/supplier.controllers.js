import { adminCreateSupplier, adminDeleteSupplier, getAllSuppliers } from "../services/admin.services.js";

export const createSupplier = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await adminCreateSupplier(name, email, password, res);
        return res.status(200).json({ message: "Supplier created. They will need to login, to be verified" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const deleteSupplier = async (req, res) => {
    const { supplierId } = req.params;
    try {
        await adminDeleteSupplier(supplierId, res);
        return res.status(200).json({ message : "Supplier and their pending supplies deleted" });        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
};

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await getAllSuppliers();
        return res.status(200).json({ suppliers })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error"})
    }
}