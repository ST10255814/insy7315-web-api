import { DeleteEntityComponent } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useListingByIdQuery,
  useDeleteListingMutation,
} from "../../../utils/queries.js";

export default function DeleteProperty() {
  const renderPropertyDetails = (property) => (
    <div className="pl-1">
      <div className="space-y-1">
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Property Details</div>
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-bold text-red-800 mr-2">ID:</span>
          <span className="font-semibold text-gray-900">{property.listingId}</span>
        </div>
        <div className="text-sm font-bold text-red-800 mb-1">
          <span className="font-bold text-red-800 mr-2">Title:</span>
          <span className="font-semibold text-gray-900 ml-2">{property.title}</span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-bold text-red-800 mr-2">Address:</span>
          <span className="font-semibold text-gray-900">{property.address}</span></div>
        <div className="text-sm text-gray-700">
          <span className="font-bold text-red-800 mr-2">Price:</span>
          <span className="font-semibold text-gray-700">R{formatAmount(property.price)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <DeleteEntityComponent
      entityType="property"
      entityDisplayName="Property"
      entityIdParam="propertyId"
      useEntityByIdQuery={useListingByIdQuery}
      useDeleteEntityMutation={useDeleteListingMutation}
      renderEntityDetails={renderPropertyDetails}
      basePath="/properties"
    />
  );
}