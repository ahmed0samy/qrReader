const mongoose = require('mongoose');
const dotenv = require('dotenv');

export const connectToDb = async () => {

dotenv.config(); // Load environment variables

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {})
.catch((err) => console.error('Error connecting to MongoDB:', err));

};
