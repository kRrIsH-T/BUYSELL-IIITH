import mongoose from 'mongoose';
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connection to MongoDB successful ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in connecting to MongoDB ${error}`);
    }
}
export default connectDB;