import { DeleteEntityComponent, EntityDetailsCard } from "../../common/index.js";
import { formatAmount } from "../../../utils/formatters.js";
import {
  useListingByIdQuery,
  useDeleteListingMutation,
} from "../../../utils/queries.js";

export default function DeleteProperty() {
  const renderPropertyDetails = (property) => (
    <EntityDetailsCard
      heading="Property Details"
      fields={[
        { label: "ID", value: property.listingId },
        { label: "Title", value: property.title },
        { label: "Address", value: property.address },
        { label: "Price", value: `R${formatAmount(property.price)}` },
      ]}
    />
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