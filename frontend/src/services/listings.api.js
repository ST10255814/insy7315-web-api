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
    
    // Append image files
    if (listingData.imageURL && listingData.imageURL.length > 0) {
      listingData.imageURL.forEach((url) => {
        formData.append('imageURL', url);
      });
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
