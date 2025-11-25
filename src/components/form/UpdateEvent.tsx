import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { useAddEvent } from "./useAddEvent";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { eventDetails } from "../../service/apis/event.api";
import { images } from "../../constants";
import { getallEventDirectors } from "../../service/apis/eventDirector.api";

interface EventDirector {
  id: string;
  fullName: string;
}

const UpdateEvent = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = params;
  const { addEventFormik, loading } = useAddEvent(id);
  const [eventDirectors, setEventDirectors] = useState<EventDirector[]>([]);
  const [eventLogoPreview, setEventLogoPreview] = useState<string | null>(null);
  // Redirect if /update but no ID
  useEffect(() => {
    if (location.pathname.includes("/update") && !id) {
      navigate("/events", { replace: true });
      return;
    }
  }, [id, location.pathname, navigate]);

  const utcToLocalString = (utcString: any) => {
  const date = new Date(utcString);
  const tzOffset = date.getTimezoneOffset(); // in minutes

  // Convert to local date (only YYYY-MM-DD)
  const localDate = new Date(date.getTime() - tzOffset * 60 * 1000);
  return localDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  return utcToLocalString(dateString); // "YYYY-MM-DD"
};


  // Fetch event details if update
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const eventData = await eventDetails(id);
          if (eventData.event) {
            const data = eventData.event;
            addEventFormik.setValues({
              eventLogo:null,
              eventName: data?.eventName || "",
              assignUserId: data?.assignUserId?.id || "",
              startDate: formatDateForInput(data?.startDate),
              endDate: formatDateForInput(data?.endDate),
            });
            setEventLogoPreview(data?.eventLogo || "");
          }
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  // Fetch dropdown data (fields + scorekeepers)
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const eventDirectorsRes = await getallEventDirectors();
        if (eventDirectorsRes.eventDirectors) setEventDirectors(eventDirectorsRes.eventDirectors);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      addEventFormik.setFieldValue('eventLogo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEventLogoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="editevent" className={`${form.myprofilewrapper} dashboard-card-global`}>
      <div className="profile-card">
        <div className={form.profile_flex}>
          <h2>{id ? "Update Event" : "Add Event"}</h2>
          <Link to="/events" state={{ fromPage: location.state?.fromPage }}>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form
          onSubmit={addEventFormik.handleSubmit}
          autoComplete="off"
          className="formaddevent from-fix-global-wrap"
        >
          
            {/* Home Team Logo */}
            <div className="profile-picture-upload">
              <div className="uploadimage center">
                <div className="upimg">
                  <img src={eventLogoPreview || images.homeNoImage} alt="Home Logo" />
                  <input
                    className="choosefile"
                    id="eventLogo"
                    name="eventLogo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                  />
                  <div className="overlay">
                    <span className="icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          <div className={`${form.profileform} from-fix-global`}>
            {/* Home Team Name */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <Input
                  type="text"
                  title="Event Name"
                  id="eventName"
                  placeholder="Enter Event name"
                  name="eventName"
                  onChange={addEventFormik.handleChange}
                  value={addEventFormik.values.eventName}
                  required
                  errorMsg={
                    addEventFormik.touched.eventName && addEventFormik.errors.eventName
                      ? addEventFormik.errors.eventName
                      : ""
                  }
                />
              </div>
            </div>

            {/* Scorekeeper (Dropdown) */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="assignUserId">Event Director<span style={{ color: "red" }}>*</span></label>
                <select
                  id="assignUserId"
                  name="assignUserId"
                  value={addEventFormik.values.assignUserId}
                  onChange={addEventFormik.handleChange}
                >
                  <option value="">-- Select Event Director --</option>
                  {eventDirectors.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                {addEventFormik.touched.assignUserId && addEventFormik.errors.assignUserId && (
                  <div className="error">{addEventFormik.errors.assignUserId}</div>
                )}
              </div>
            </div>

            {/* Start Date */}
<div className={form.profileformcol}>
  <div className="formgrp">
    <Input
      type="date"
      title="Start Date"
      id="startDate"
      name="startDate"
      min={new Date().toISOString().split("T")[0]}   // disable past dates
      onChange={addEventFormik.handleChange}
      value={addEventFormik.values.startDate}
      required
      errorMsg={
        addEventFormik.touched.startDate && addEventFormik.errors.startDate
          ? addEventFormik.errors.startDate
          : ""
      }
    />
  </div>
</div>

{/* End Date */}
<div className={form.profileformcol}>
  <div className="formgrp">
    <Input
      type="date"
      title="End Date"
      id="endDate"
      name="endDate"
      min={addEventFormik.values.startDate || new Date().toISOString().split("T")[0]} 
      // disable before start date OR past dates
      onChange={addEventFormik.handleChange}
      value={addEventFormik.values.endDate}
      required
      errorMsg={
        addEventFormik.touched.endDate && addEventFormik.errors.endDate
          ? addEventFormik.errors.endDate
          : ""
      }
    />
  </div>
</div>

          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={`${form.profileformcol} submit-btn-wrap`}>
              <button className="custom-button submit-btn">
                {id ? "Update Event" : "Add Event"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;