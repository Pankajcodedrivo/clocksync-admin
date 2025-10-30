import EventUpdate from "../../components/form/UpdateEvent";
import withRole from "../withRole";

function UpdateEvent() {
  return (
    <section>
      <EventUpdate />
    </section>
  );
}
export default withRole(UpdateEvent, ["admin"]);
