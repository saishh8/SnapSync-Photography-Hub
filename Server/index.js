const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User.js')
const Photographer= require('./models/Photographer.js'); //photogrpaher model
const Profile = require('./models/Profile.js');  //profile model  
const Bookings = require('./models/Booking.js');  //profile model  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const stripe =require('stripe')("sk_test_51O2C7vSFVwLZwqIqjaMnygaWOBS5WLvW4cBMNDvx8Q6hGjWfirZc3FDYrLm0HmQDfq1dgl6xl3kA8UOJR78V7PnL00N0pwoVED")
const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

// mongoose.connect('mongodb+srv://dhruvsanghavi000:Y4Gx0re0bQXtBRYJ@cluster0.vnncwzl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
//dhruvsanghavi000 
//Y4Gx0re0bQXtBRYJ

mongoose.connect('mongodb+srv://saish:kTtDJDDxGUIZnqtK@snapsync.lqlcj.mongodb.net/?retryWrites=true&w=majority&appName=SnapSync')

//saish
//kTtDJDDxGUIZnqtK

app.use(cors({
    origin: 'http://localhost:3000',
  }));

app.get('/test',(req,res)=>{
    res.json('test OK');
});

app.post('/register',async (req,res)=>{
    const {name,email,password,contact,portfolio,address} = req.body;
    try{
        const userDoc = await Photographer.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
            contact,
            portfolio,
            address
          });
          res.json(userDoc);
    }catch (e) {
        res.status(422).json(e);
      }
});
app.post('/uregister', async (req, res) => {
    const { fname, lname, contact, email, password } = req.body;
  
    try {
      // Hash the password using bcrypt
      const hashedPassword = bcrypt.hashSync(password, 10); // Use a salt factor of 10
  
      // Use User.create to create and save the user to the database
      const userDoc = await User.create({
        fname,
        lname,
        contact,
        email,
        password: hashedPassword, // Store the hashed password
      });
  
      res.status(201).json(userDoc); // Send a success response with the user document
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(422).json({ error: 'Registration failed' });
    }
  });
  app.post('/ulogin',async(req,res)=>{
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
        
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk){
            const token = jwt.sign({
                email:userDoc.email,
                id:userDoc._id
            },jwtSecret);
            res.status(200).send({
                msg: "Login Successful...!",
                email: userDoc.email,
                token
            });          
        }else {
            res.status(422).json('pass not ok');
          }
    }
    else{
        res.json('not found');
    }

})

// app.post('/login',async(req,res)=>{
//     const {email,password} = req.body;
//     const userDoc = await Photographer.findOne({email});
//     if (userDoc) {
        
//         const passOk = bcrypt.compareSync(password, userDoc.password);
//         if (passOk){
//             const token = jwt.sign({
//                 email:userDoc.email,
//                 id:userDoc._id
//             },jwtSecret);
//             res.status(200).send({
//                 msg: "Login Successful...!",
//                 email: userDoc.email,
//                 token
//             });          
//         }else {
//             res.status(422).json('pass not ok');
//           }
//     }
//     else{
//         res.json('not found');
//     }

// })

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await Photographer.findOne({ email });
  console.log('userDoc:', userDoc);
console.log('isVerified:', userDoc.isVerified);
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      if (userDoc.isVerified) {
        const token = jwt.sign({
          email: userDoc.email,
          id: userDoc._id
        }, jwtSecret);
        res.status(200).send({
          msg: "Login Successful...!",
          email: userDoc.email,
          token
        });
      } else {
        res.status(403).json('User is not verified. Please verify your account to log in.');
      }
    } else {
      res.status(422).json('Password is incorrect');
    }
  } else {
    res.status(404).json('User not found');
  }
});



app.get('/user/:email',async(req,res)=>{
    const email = req.params.email;
   
    if (!email) {
        return res.status(400).send({ error: "Invalid Username" });
    }

    try {
        const user = await Photographer.findOne({ email: email });
        
        if (!user) {
            return res.status(404).send({ error: "Couldn't Find the User" });
        }

        // If you want to remove the password from the user object, you can do so here.
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        return res.status(200).send(userWithoutPassword);
        // return res.status(200).send(user);
    } catch (err) {
        // Handle any potential errors that may occur during database operations.
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

app.get('/client/:email',async(req,res)=>{
  const email = req.params.email;
  console.log(email);
  if (!email) {
      return res.status(400).send({ error: "Invalid Username" });
  }

  try {
      const user = await User.findOne({ email: email });
      
      if (!user) {
          return res.status(404).send({ error: "Couldn't Find the User" });
      }

      // If you want to remove the password from the user object, you can do so here.
      const userWithoutPassword = { ...user._doc };
      delete userWithoutPassword.password;

      return res.status(200).send(userWithoutPassword);
      // return res.status(200).send(user);
  } catch (err) {
      // Handle any potential errors that may occur during database operations.
      return res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    // Calculate the payment amount based on the final price (use the 'price' variable)
    const price = parseFloat(req.body.price); // Ensure 'price' is passed in the request

    // Generate a Payment Intent with the calculated 'price'
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe expects the amount in cents
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//////
const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const {path,originalname} = req.files[i];
      const parts=originalname.split('.');
      const ext=parts[parts.length-1];
      const newPath=path+'.'+ext;
      fs.renameSync(path,newPath);
      uploadedFiles.push(newPath);
    }
    res.json(uploadedFiles);
});
    

app.post('/saveProfile',async (req,res)=>{
  const { owner, title, description, city, addedPhotos, language , services } = req.body;
  try{
      const profileDoc = await Profile.create({
          owner,
          title,
          description,
          city,
          photos: addedPhotos,
          languages: language,
          services, // Include services
          });
          res.json(profileDoc);
  }
  catch(e){
      res.status(422).json(e);
  }
 
  
});

app.get('/allcards', async (req, res) => {
  try {
      const photographers = await Profile.find({}); // Use 'find' to query all documents in the collection
      res.json(photographers); // Send the data as JSON response
  } catch (err) {
      console.error("Error fetching photographers:", err); // Log the error
      res.status(500).json({ message: "Internal Server Error" });
  }
});
// app.get('/desc/:id', async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const profile = await Profile.findOne({_id :id});
//       if (profile) {
//         res.send(profile);
//       } else {
//         res.status(404).send('Profile not found');
//       }
//     } catch (err) {
//       res.status(500).send('Internal Server Error');
//     }
//   });
app.get('/desc/:id', async (req, res) => {
  const { id } = req.params; // Destructure id from req.params
  if (!id) {
      return res.status(400).send({ error: "Invalid id" });
  }
  try {
      const profile = await Profile.findById(id); // Use id as the argument
      if (!profile) {
          return res.status(404).send({ error: 'Profile not found' });
      }
      return res.status(200).send(profile);
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).send('Internal Server Error');
  }
});


app.get('/description/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findOne({ owner: id });
    if (profile) {
      res.send(profile);
    } else {
      res.status(404).send('Profile not found');
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

//Update user profile
  
app.put('/updateProfile', async (req, res) => {
  try {
    const updatedProfileData = req.body;

    const updatedProfile = await Profile.findOne({ owner: updatedProfileData.owner });

    if (!updatedProfile) {
      return res.status(404).send('Profile not found');
    }

    // Update the text data
    updatedProfile.title = updatedProfileData.title;
    updatedProfile.description = updatedProfileData.description;
    updatedProfile.city = updatedProfileData.city;
    updatedProfile.languages = updatedProfileData.language;
    updatedProfile.services = updatedProfileData.services;

    // Handle images
    if (updatedProfileData.addedPhotos) {
      updatedProfile.photos = updatedProfileData.addedPhotos; // Replace the entire photos array
    }

    // Save the updated profile
    await updatedProfile.save();

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

  // app.post("/api/create-checkout-session", async (req, res) => {
  //   const { product, selectedService } = req.body;
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     line_items: lineItems,
  //     mode: "payment",
  //     success_url: "http://localhost:3000/success", // Adjust the URLs as needed
  //     cancel_url: "http://localhost:3000/cancel", // Adjust the URLs as needed
  //   });
  
  //   res.json({ id: session.id });
  // });
  // app.post("/api/create-checkout-session", async (req, res) => {
  //   const { products } = req.body;
  
  //   const lineItems = products.map((product) => ({
  //     price_data: {
  //       currency: 'inr',
  //       product_data: {
  //         name: product.selectedService.name,
  //       },
  //       unit_amount: product.price * 100,
  //     },
  //     quantity: 1,
  //   }));
  
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     line_items: lineItems,
  //     mode: "payment",
  //     success_url: "http://localhost:3000/success",
  //     cancel_url: "http://localhost:3000/cancel",
  //   });
  
  //   res.json({ id: session.id });
  // });
  

  app.post("/api/create-checkout-session", async (req, res) => {
    const { products } = req.body;
    const{ servicename, price, ownerId, userid, startDate, endDate } = products;
    //console.log(ownerId);
    //console.log(userid);
  // console.log(products);
  // console.log("service name:",products.servicename);
  // console.log('serviceprice',products.price);
  
    // Continue with creating the session and responding with the session ID.
    const lineItem = {
      price_data: {
        currency: 'inr',
        product_data: {
          name: products.servicename,
        },
        unit_amount: products.price * 100,
      },
      quantity: 1,
    };
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [lineItem],
      mode: "payment",
      success_url: `http://localhost:3000/success?ownerId=${ownerId}&userId=${userid}&startDate=${startDate}&endDate=${endDate}&serviceName=${servicename}&price=${price}`,
      //success_url: `http://localhost:3000/success?product=${products}`,
      cancel_url: "http://localhost:3000/cancel",
    });
  
    res.json({ id: session.id });
  });
  
  app.post('/create-booking', async (req, res) => {
    try {
      const { userId, photographerId, serviceName, totalPrice, startDate, endDate } = req.body;
      //const startDateTime = new Date(startDate);
      //const endDateTime = new Date(endDate);
      // Check if a booking with the same properties already exists
      const existingBooking = await Bookings.findOne({
        userId,
        photographerId,
        serviceName,
        totalPrice,
        startDate,
        endDate,
      });
  
      if (existingBooking) {
        return res.status(409).json({ error: 'Booking already exists' });
      }
  
      // If no existing booking found, create and save the new booking
      const booking = await Bookings.create({
        userId,
        photographerId,
        serviceName,
        totalPrice,
        startDate,
        endDate,
      });
  
      res.status(201).json({ booking });
    } catch (error) {
      res.status(500).json({ error: 'Error creating the booking' });
    }
  });
  



app.get('/bookings/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const bookings = await Bookings.find({ userId: userId });

      res.status(200).json(bookings);
  } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Error fetching bookings' });
  }
});
  

app.get('/photographers', async (req, res) => {
  try {
    // Fetch all photographers from the database
    const allPhotographers = await Photographer.find();

    if (allPhotographers) {
      res.status(200).json(allPhotographers);
    } else {
      res.status(404).json({ error: 'No photographers found' });
    }
  } catch (error) {
    console.error('Error fetching photographers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/api/photographers/:photographerId/verify', async (req, res) => {
  const photographerId = req.params.photographerId;
  const isVerified = req.body.isVerified;

  try {
    const updatedPhotographer = await Photographer.findByIdAndUpdate(
      photographerId,
      { isVerified }, // Update the isVerified field
      { new: true } // Return the updated photographer document
    );

    if (!updatedPhotographer) {
      return res.status(404).json({ error: 'Photographer not found' });
    }

    res.status(200).json(updatedPhotographer);
  } catch (error) {
    console.error('Error updating photographer verification status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  app.listen(4000);
  