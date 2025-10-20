import listingService from '../Services/listingService.js';

async function createListing(req, res) {
    const id = req.user.userId;
  console.log(`[createListing] Entry: landlordId="${id}"`);
  try {
    const files = req.files || [];

    if (!files.length) {
      console.log("[createListing] No files uploaded");
    }

    const imageUrls = files.map(file => file.path);
    const data = { ...req.body, imagesURL: imageUrls };

    const newListing = await listingService.createListing(id, data);
    console.log(`[createListing] Exit: Listing created with id="${newListing?.listingId}"`);
    res.status(201).json(newListing);
  } catch (error) {
    console.error(`[createListing] Error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

export default {
    createListing
};