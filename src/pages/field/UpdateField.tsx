import FieldUpdate from "../../components/form/UpdateField";
import withRole from "../withRole";

function UpdateField() {
  return (
    <section>
      <FieldUpdate />
    </section>
  );
}

export default withRole(UpdateField, ["admin","event-director"]);
