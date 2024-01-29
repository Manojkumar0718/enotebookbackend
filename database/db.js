import { connect } from "mongoose";

const connectToMongo = async () => {
    try {
        await connect("mongodb+srv://manojkumar:manoj@enotebookdatabase.0tjxmqy.mongodb.net/eNotebook")
        console.log("<---Connected Successfully--->")
    } catch (error) {
        console.log(error)
    }
}

export default connectToMongo;
