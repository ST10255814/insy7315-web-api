import api from "../lib/axios.js";

export async function getListingsByAdminId() {
  try {
    const response = await api.get("/api/listings", { withCredentials: true });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function createListing(listingData) {
  try {
    console.log('Creating listing with data:', listingData);
    console.log('Image files count:', listingData.imageFiles?.length || 0);
    const formData = new FormData();
    // Append text fields
    formData.append('title', listingData.title);
    formData.append('address', listingData.address);
    formData.append('description', listingData.description);
    formData.append('price', listingData.price);
    
    // Append amenities
    if (listingData.amenities && listingData.amenities.length > 0) {
      listingData.amenities.forEach((amenity) => {
        formData.append('amenities', amenity);
      });
    }
    
    // Append image files (use imageFiles, not imageURL which are just preview URLs)
    if (listingData.imageFiles && listingData.imageFiles.length > 0) {
      listingData.imageFiles.forEach((file) => {
        formData.append('imageURL', file);
      });
    }

    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await api.post(
      "/api/listings/create",
      formData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function countNumberOfListingsByAdminId() {
  try {
    const response = await api.get("/api/listings/count", { withCredentials: true });
    return response.data.data.count;
  } catch (error) {
    throw error;
  }
}

export async function countListingsAddedThisMonth() {
  try {
    const response = await api.get("/api/listings/count-this-month", { withCredentials: true });
    return response.data.data.count;
  } catch (error) {
    throw error;
  }
}
