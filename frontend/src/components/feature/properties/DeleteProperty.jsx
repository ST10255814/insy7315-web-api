import { DeleteEntityComponent } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useListingByIdQuery,
  useDeleteListingMutation,
} from "../../../utils/queries.js";

export default function DeleteProperty() {
  const renderPropertyDetails = (property) => (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Title:</span>
        <span className="font-medium text-blue-700">{property.title}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Address:</span>
        <span className="font-medium text-blue-700">{property.address}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Price:</span>
        <span className="font-medium text-blue-700">
          {formatAmount(property.price)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Property Type:</span>
        <span className="font-medium text-blue-700">
          {property.propertyType}
        </span>
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