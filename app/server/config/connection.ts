import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config';

const uri: string = process.env.MONGO_URI || 'mongodb://localhost/EmberBed';

mongoose.connect(uri).then(() => console.log('Mongo Connected')).catch((err) => console.error(err));
console.log(mongoose.connection);

export default mongoose.connection;
