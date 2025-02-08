const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

//use express static folder
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

//Connect to MongoDB
app.listen(port, () => {
  try {
    console.log(`Server is running ${port}`);
    mongoose.connect(
      'mongodb+srv://Byu:Byu@kohai.zxe75.mongodb.net/db_example'
    );
    console.log('db connection established');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

app.get('/demo', (req, res) => {
  res.send('Hello World!');
});

//AdminSchema
//Creating a table for admin
const adminSchemaStructure = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
    minlength: 6,
  },
});
const Admin = mongoose.model('admin', adminSchemaStructure);

//AdminPost
app.post('/Admin', async (req, res) => {
  try {
    const { adminName, adminEmail, adminPassword } = req.body;

    //Check if admin already exists
    let admin = await Admin.findOne({ adminEmail });

    if (admin) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Admin already exists' }] });
    }

    admin = new Admin({
      adminName,
      adminEmail,
      adminPassword,
    });

    //Save admin
    await admin.save();

    res.json({ message: 'Admin inserted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//AdminGet(Select all)
app.get('/Admin', async (req, res) => {
  try {
    const admin = await Admin.find();
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    } else {
      res.send(admin).status(200);
    }
  } catch (err) {
    console.error('Error Finding Admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//AdminGet(Select by a value)
app.get('/Admin/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findById(id);
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    } else {
      res.send(admin).status(200);
    }
  } catch (err) {
    console.error('Error Finding Admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//AdminGet(Select by filter)
app.get('/AdminFiltter/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.find({ adminName: id });
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    } else {
      res.send(admin).status(200);
    }
  } catch (err) {
    console.error('Error Finding Admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Admin Delete
app.delete('/Admin/:id', async (req, res) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    } else {
      res.json({ message: 'Admin deleted successfully', deletedAdmin });
    }
  } catch (err) {
    console.error('Error deleting Admin:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//UsertableSchema
//Creating a table for user
const userSchemaStructure = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
    minlength: 6,
  },
});
const User = mongoose.model('user', userSchemaStructure);

//Userpost(insert)
app.post('/User', async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    //Check if admin already exists
    let user = await User.findOne({ userEmail });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({
      userName,
      userEmail,
      userPassword,
    });

    //Save admin
    await user.save();

    res.json({ message: 'User inserted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
app.get('/User', async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      res.send(user).status(200);
    }
  } catch (err) {
    console.error('Error Finding User:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
