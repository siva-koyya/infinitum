const express= require("express")
const multer =require("multer")
const router=express.Router()
const fs = require('fs');
const path = require('path');
const mongoose =require("mongoose")
// const {uploadDir}=require("../storage/multer")
const {upload}=require("../storage/multer")
const Event =require("../schema/eventSchema")
// router.use(express.json())

router.get("/event",async(req,res)=>{
    const response= await Event.find()
    res.json(response)
})
router.get("/event/:id",async(req,res)=>{
    const id=req.params.id

   const response= await Event.findById(id)
   res.json(response)
})


// router.post("/event", upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 5 }]), async (req, res) => {
//     const { eventname, user } = req.body;
//   console.log(req.files)
//     // Handle images
//     const images = req.files['images'] ? req.files['images'].map(file => ({
//       _id: new mongoose.Types.ObjectId(),  // Generate a new ObjectId for each image
//       path: file.path.replace(/\\/g, '/'),
//       createdAt: new Date()
//     })) : [];
  
//     // Handle videos
//     const videos = req.files['videos'] ? req.files['videos'].map(file => ({
//       _id: new mongoose.Types.ObjectId(),  // Generate a new ObjectId for each video
//       path: file.path.replace(/\\/g, '/'),
//       createdAt: new Date()
//     })) : [];
  
//     // Create new event
//     const newEvent = new Event({
//       eventname,
//       user,
//       images,
//       videos  // Include videos here
//     });
  
//     try {
//       await newEvent.save();
//       res.status(200).json({ message: "Event created successfully", event: newEvent });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error creating event", error });
//     }
//   });
  
router.post('/event', upload.any(), async (req, res) => {
    try {
      const { eventname, user } = req.body;
  
      const images = req.files
        .filter(file => file.mimetype.startsWith('image/'))
        .map(file => ({
          _id: new mongoose.Types.ObjectId(),
          path: file.path.replace(/\\/g, '/'),
          createdAt: new Date()
        }));
  
      const videos = req.files
        .filter(file => file.mimetype.startsWith('video/'))
        .map(file => ({
          _id: new mongoose.Types.ObjectId(),
          path: file.path.replace(/\\/g, '/')
        }));
  
      const newEvent = new Event({
        eventname,
        user,
        images,
        videos
      });
  
      await newEvent.save();
      res.status(200).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating event', error });
    }
  });
  
  router.patch('/event/:id', upload.any(), async (req, res) => {
    const eventId = req.params.id;
    const updateData = req.body;

    try {
        // Fetch the current event
        const currentEvent = await Event.findById(eventId);
        if (!currentEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Handle new images and videos
        const newImages = req.files
            .filter(file => file.fieldname === 'files' && file.mimetype.startsWith('image'))
            .map(file => ({
                _id: new mongoose.Types.ObjectId(),
                path: file.path.replace(/\\/g, '/'),
                createdAt: new Date()
            }));

        const newVideos = req.files
            .filter(file => file.fieldname === 'files' && file.mimetype.startsWith('video'))
            .map(file => ({
                _id: new mongoose.Types.ObjectId(),
                path: file.path.replace(/\\/g, '/'),
                createdAt: new Date()
            }));

       

        // Combine existing and new images/videos
        const updatedImages = [...currentEvent.images, ...newImages];
        const updatedVideos = [...currentEvent.videos, ...newVideos];

        // Update the event document
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $set: {
                    ...updateData, // Update other fields
                    images: updatedImages,
                    videos: updatedVideos
                }
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error); // Log the error for debugging
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
});







const uploadDir = path.join(__dirname, '../uploads');


// router.delete('/event/:id', async (req, res) => {
//     const id = req.params.id;
//     console.log(`Deleting event with ID: ${id}`);

//     try {
//         // Find the event to retrieve image and video paths
//         const event = await Event.findById(id);
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         // Delete the event from the database
//         await Event.findByIdAndDelete(id);

//         // Helper function to delete files
//         const deleteFiles = (files) => {
//             return files.map(file => {
//                 const filePath = path.join(uploadDir, path.basename(file.path));
//                 console.log(`Deleting file: ${filePath}`); // Debugging line
//                 return new Promise((resolve, reject) => {
//                     fs.unlink(filePath, (err) => {
//                         if (err) {
//                             console.error(`Error deleting file ${filePath}:`, err);
//                             reject(err);
//                         } else {
//                             console.log(`File ${filePath} deleted successfully.`);
//                             resolve();
//                         }
//                     });
//                 });
//             });
//         };

//         // Create promises for deleting images and videos
//         const imageDeletePromises = deleteFiles(event.images || []);
//         const videoDeletePromises = deleteFiles(event.videos || []);

//         // Wait for all file deletions to complete
//         await Promise.all([...imageDeletePromises, ...videoDeletePromises]);

//         res.status(200).json({ message: "Event and associated files successfully deleted" });
//     } catch (error) {
//         console.error('Error deleting event:', error);
//         res.status(500).json({ message: "Error deleting event", error: error.message });
//     }
// });

router.delete('/event/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Deleting event with ID: ${id}`);

    try {
        // Find the event to retrieve image and video paths
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete the event from the database
        await Event.findByIdAndDelete(id);

        // Helper function to delete files
        const deleteFiles = (files) => {
            return files.map(file => {
                // Ensure the file path is correctly constructed
                const filePath = path.resolve(uploadDir, path.basename(file.path));
                
                return new Promise((resolve, reject) => {
                    fs.access(filePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            console.warn(`File not found: ${filePath}`); // Warn if file does not exist
                            return resolve(); // Resolve promise even if file doesn't exist
                        }
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file ${filePath}:`, err);
                                reject(err);
                            } else {
                                console.log(`File ${filePath} deleted successfully.`);
                                resolve();
                            }
                        });
                    });
                });
            });
        };

        // Create promises for deleting images and videos
        const imageDeletePromises = deleteFiles(event.images || []);
        const videoDeletePromises = deleteFiles(event.videos || []);

        // Wait for all file deletions to complete
        await Promise.all([...imageDeletePromises, ...videoDeletePromises]);

        res.status(200).json({ message: "Event and associated files successfully deleted" });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
});






module.exports = router