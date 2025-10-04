import express from 'express'
import {
    addDoctor, allDoctors, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard
} from '../controllers/adminController.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'
import upload from '../middlewares/multer.js'

const adminRouter = express.Router()

adminRouter.post("/add-doctor", authAdmin,upload.none(), addDoctor)
// adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor)
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availablity", authAdmin, changeAvailablity)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/dashboard", authAdmin, adminDashboard)




export default adminRouter