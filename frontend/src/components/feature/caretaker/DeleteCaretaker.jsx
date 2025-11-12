import { DeleteEntityComponent, EntityDetailsCard } from "../../common/index.js";
import {
  useCaretakerByIdQuery,
  useDeleteCaretakerMutation,
} from "../../../utils/queries.js";

export default function DeleteCaretaker() {
  const renderCaretakerDetails = (caretaker) => (
    <EntityDetailsCard
      heading="Caretaker Details"
      fields={[
        { label: "Caretaker ID", value: caretaker.caretakerId },
        { label: "Name", value: `${caretaker.firstName} ${caretaker.surname}` },
        { label: "Profession", value: caretaker.profession },
        { label: "Email", value: caretaker.email },
      ]}
    />
  );

  return (
    <DeleteEntityComponent
      entityType="caretaker"
      entityDisplayName="Caretaker"
      entityIdParam="caretakerId"
      useEntityByIdQuery={useCaretakerByIdQuery}
      useDeleteEntityMutation={useDeleteCaretakerMutation}
      renderEntityDetails={renderCaretakerDetails}
      basePath="/caretakers"
    />
  );
}
