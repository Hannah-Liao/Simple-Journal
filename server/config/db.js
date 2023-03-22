const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectBD = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected: ${connect.connection.host}`);
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectBD;