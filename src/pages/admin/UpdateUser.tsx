import Userupdate from "../../components/form/UpdateUser";
import withRole from "../withRole";

function UpdateUser() {
  return (
    <section>
      <Userupdate />
    </section>
  );
}

export default withRole(UpdateUser, ["admin","event-director"]);
