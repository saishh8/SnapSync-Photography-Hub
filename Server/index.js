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
const bodyParser = require('body-parser');

require('dotenv').config();





const stripe =require('stripe')(process.env.STRIPE);
const endpointSecret = process.env.ENDPOINT_SECRET;

const app = express();








app.use('/uploads', express.static('uploads'));
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;


mongoose.connect(process.env.DB_URI)



app.use(cors({
    origin: 'http://localhost:3000',
  }));


app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
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


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await Photographer.findOne({ email });
  
  if (!userDoc) {
    return res.status(404).json('User not found');
  }
  
  console.log('userDoc:', userDoc);
  console.log('isVerified:', userDoc.isVerified);

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    if (userDoc.isVerified) {
      const token = jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret
      );
      return res.status(200).send({
        msg: "Login Successful...!",
        email: userDoc.email,
        token,
      });
    } else {
      return res
        .status(403)
        .json('User is not verified. Please verify your account to log in.');
    }
  } else {
    return res.status(422).json('Password is incorrect');
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

//custom payment approach

// app.post('/create-payment-intent', async (req, res) => {
//   try {
//     // Calculate the payment amount based on the final price (use the 'price' variable)
//     const price = parseFloat(req.body.price); // Ensure 'price' is passed in the request

//     // Generate a Payment Intent with the calculated 'price'
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: price * 100, // Stripe expects the amount in cents
//       currency: 'usd',
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


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

 

  

  //Older apporach for stripe checkout

  // app.post("/api/create-checkout-session", async (req, res) => {
  //   const { products } = req.body;
  //   // const{ servicename, price, ownerId, userid, startDate, endDate } = products; //old version
  //   const{ servicename, price, ownerId, userid, startDate, startTime,endTime, duration} = products;
  //   //console.log(ownerId);
  //   //console.log(userid);
  // // console.log(products);
  // // console.log("service name:",products.servicename);
  // // console.log('serviceprice',products.price);
  
  //   // Continue with creating the session and responding with the session ID.
  //   const lineItem = {
  //     price_data: {
  //       currency: 'inr',
  //       product_data: {
  //         name: products.servicename,
  //       },
  //       unit_amount: products.price * 100,
  //     },
  //     quantity: 1,
  //   };
    
  //   //Old apporach

  //   // const session = await stripe.checkout.sessions.create({
  //   //   payment_method_types: ["card"],
  //   //   line_items: [lineItem],
  //   //   mode: "payment",
  //   //   success_url: `http://localhost:3000/success?ownerId=${ownerId}&userId=${userid}&startDate=${startDate}&endDate=${endDate}&serviceName=${servicename}&price=${price}`,
  //   //   //success_url: `http://localhost:3000/success?product=${products}`,
  //   //   cancel_url: "http://localhost:3000/cancel",
  //   // });

  //   // New approach
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"],
  //     line_items: [lineItem],
  //     mode: "payment",
  //     success_url: `http://localhost:3000/success?ownerId=${ownerId}&userId=${userid}&startDate=${startDate}&startTime=${startTime}&endTime=${endTime}&duration=${duration}&serviceName=${servicename}&price=${price}`,
  //     //success_url: `http://localhost:3000/success?product=${products}`,
  //     cancel_url: "http://localhost:3000/cancel",
  //   });
  
  //   res.json({ id: session.id });
  // });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { serviceName, price, ownerId, userId, startDate, startTime, endTime, duration } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: { name: serviceName },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            metadata: {
                serviceName,
                price,
                ownerId,
                userId,
                startDate,
                startTime,
                endTime,
                duration,
            },
            success_url: `http://localhost:3000/success?ownerId=${ownerId}&userId=${userId}&startDate=${startDate}&startTime=${startTime}&endTime=${endTime}&duration=${duration}&serviceName=${serviceName}&price=${price}`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        // Include both session ID and URL in the response
        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Unable to create checkout session" });
    }
  });
  

  app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const body = req.body

    console.log(body);
    console.log('Raw body length:', body.length);
    console.log('Raw body as string:', body.toString());
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Stripe Signature:', sig);



    
    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { ownerId, userId, startDate, startTime, endTime, duration, serviceName } = session.metadata;

            // Ensure that all required fields are present
            if (!ownerId || !userId || !startDate || !startTime || !endTime || !duration || !serviceName) {
                console.error('Missing required metadata fields');
                return res.status(400).send('Missing required metadata fields');
            }

            // Update the booking to "booked"
            Bookings.findOneAndUpdate(
                { 
                    photographerId: ownerId, 
                    userId: userId, 
                    startDate:startDate, 
                    startTime:startTime, 
                    endTime:endTime, 
                    duration:duration, 
                    serviceName:serviceName 
                },
                { status: 'booked' },
                { new: true }
            )
                .then((updatedBooking) => {
                    console.log('Booking updated to booked:', updatedBooking);
                })
                .catch((err) => {
                    console.error('Error updating booking:', err);
                });
            break;

        case 'payment_intent.succeeded':
            // Handle payment_intent.succeeded if you're not using Checkout
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
});


  //Create Client booking for the first time
  
  app.post('/create-booking', async (req, res) => {
    try {
      // const { userId, photographerId, serviceName, totalPrice, startDate, endDate } = req.body; // old approach
      const { userId, photographerId, serviceName, totalPrice, startDate, startTime, endTime, duration } = req.body;
      //const startDateTime = new Date(startDate);
      //const endDateTime = new Date(endDate);
      // Check if a booking with the same properties already exists
      const existingBooking = await Bookings.findOne({
        userId,
        photographerId,
        serviceName,
        totalPrice,
        startDate,
        startTime,
        endTime,
        duration
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
        startTime,
        endTime,
        duration
      });
  
      res.status(201).json({ booking });
    } catch (error) {
      console.log(error);
      
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



//fetch photographer's bookings
app.get('/api/photographer/:photographerId/bookings', async (req,res)=>{

    const {photographerId} = req.params;

    try {
      
      const bookings = await Bookings.find({photographerId:photographerId});
      res.status(200).json(bookings);
      
    } catch (error) {

      console.log('Error fetching photgrapher\'s bookings');
      res.status(500).json({error:'Error fetching bookings'});
      
    }
});


//accept or reject photography commission request
app.patch('/api/photographer/bookings/:id/respond', async(req,res)=>{

    const {id} = req.params; //booking id
    const {action} = req.body; //either pass accepted or rejected
    const {photographerId}= req.body; // ensure the photohrapherId is passed in the body

    try {

      const currentBooking = await Bookings.findOne({_id:id,photographerId:photographerId});

      if (!currentBooking){

        return res.status(404).json({error:'Booking not found'});
       
      }


      if(action == 'accepted'){

        currentBooking.status = 'payment pending';

      }
      else if (action == 'rejected'){

        currentBooking.status = 'rejected';

      }
      else{

        return res.status(400).json({error:'Invalid action'});
      }


      const success = await currentBooking.save();

      if(success){

        res.status(200).json({message:`Booking ${action} successfully`})
      }
      else{

        res.status(500).json({error:'Error occured saving booking'});
      }

      
    } catch (error) {

      console.log('Error updating booking status');
      res.status(500).json({error:'Error updating booking status'});
    }


});


//update commission booking status to booked

app.patch('/api/bookings/:id/payment', async(req,res)=>{
      
    const {id} = req.params;

    try{
      const currentBooking = await Bookings.findById(id);

      if(!currentBooking || currentBooking.status !== 'payment pending') {
        return res.status(400).json({ error: 'Invalid booking for payment' });
      }

      currentBooking.status = 'booked';
      await currentBooking.save();

      res.status(200).json({ message: 'Payment successful, booking confirmed', booking });
    }catch (error) {
      console.log(error);
      
      res.status(500).json({ error: 'Failed to update payment status' });
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
  app.listen(4000,()=>`Server is running on port 4000`);
  