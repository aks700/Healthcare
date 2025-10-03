import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
            type: String, required: true
        },
        docId: {
            type: String, required: true
        },
        slotDate: {
            type: String, required: true
        },
        slotTime: {
            type: String, required: true
        },
        userData: {
            type: Object, required: true
        },
        docData: {
            type: Object, required: true
        },
        amount: {
            type: Number, required: true
        },
        date: {
            type: Number, required: true
        },
        cancelled: {
            type: Boolean, default: false
        },
        payment: {
            type: Boolean, default: false
        },
        isCompleted: {
            type: Boolean, default: false
        },
    }
)


// Pre-update middleware to handle video access on updates
appointmentSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    
    // If payment status or completion status changes, update video access
    if (update.hasOwnProperty('payment') || update.hasOwnProperty('isCompleted') || update.hasOwnProperty('cancelled')) {
        const payment = update.payment !== undefined ? update.payment : this.payment;
        const isCompleted = update.isCompleted !== undefined ? update.isCompleted : this.isCompleted;
        const cancelled = update.cancelled !== undefined ? update.cancelled : this.cancelled;
        
        update.canAccessVideo = payment && !cancelled && !isCompleted;
        
        // If appointment is completed or cancelled, end any active video call
        if (isCompleted || cancelled) {
            update['videoCall.isActive'] = false;
            if (!update['videoCall.endedAt']) {
                update['videoCall.endedAt'] = new Date();
            }
        }
    }
    
    next();
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel