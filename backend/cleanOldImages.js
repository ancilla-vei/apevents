const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();  // loads .env from same folder (backend/)

const Gallery  = require('./models/Gallery');
const Category = require('./models/Category');
const Service  = require('./models/Service');
const Settings = require('./models/Settings');

async function clean() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  const g = await Gallery.deleteMany({ image: /localhost/ });
  console.log(`Deleted ${g.deletedCount} gallery images`);

  const c = await Category.updateMany(
    { photo: /localhost/ },
    { $set: { photo: null } }
  );
  console.log(`Cleared ${c.modifiedCount} category photos`);

  const s = await Service.updateMany(
    { image: /localhost/ },
    { $set: { image: null } }
  );
  console.log(`Cleared ${s.modifiedCount} service images`);

  const st = await Settings.updateMany(
    { $or: [{ logo: /localhost/ }, { backgroundImage: /localhost/ }] },
    { $set: { logo: null, backgroundImage: null } }
  );
  console.log(`Cleared ${st.modifiedCount} settings images`);

  await mongoose.disconnect();
  console.log('Done ✅');
}

clean().catch(console.error);