import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { useAddGame } from "./useAddGame";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { gameDetails, getallfield, getallScorekeeper } from "../../service/apis/game.api";
import { images } from "../../constants";
import { getUpcomingEvent } from "../../service/apis/event.api";
import { complex } from "../../interfaces/Itable";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
interface Field {
  _id: string;
  name: string;
}

interface Scorekeeper {
  id: string;
  fullName: string;
}

const UpdateGame = () => {
  const params = useParams();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const preselectedEventId = location.state?.eventId || "";
  // You can now use `preselectedEventId` to prefill your event dropdown
  // Example:
  const [eventData, setEventData] = useState<complex[]>([]);
  const [eventId, setEventId] = useState(preselectedEventId);
  const navigate = useNavigate();
  const { id } = params;
  const { addGameFormik, loading } = useAddGame(id,user);

  const [homeLogoPreview, setHomeLogoPreview] = useState<string | null>(null);
  const [awayLogoPreview, setAwayLogoPreview] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [scorekeepers, setScorekeepers] = useState<Scorekeeper[]>([]);

  // Redirect if /update but no ID
  useEffect(() => {
    if (location.pathname.includes("/update") && !id) {
      navigate("/games", { replace: true });
      return;
    }
  }, [id, location.pathname, navigate]);

  const utcToLocalString = (utcString:any) => {
    const date = new Date(utcString);       // UTC string from server
    const tzOffset = date.getTimezoneOffset(); // in minutes

    // Optional: get local YYYY-MM-DDTHH:mm format for input fields
    const localDate = new Date(date.getTime() - tzOffset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = utcToLocalString(dateString);
    return date; // "YYYY-MM-DDTHH:mm"
  };

  // Fetch game details if update
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const gameData = await gameDetails(id);
          if (gameData.game) {
            const data = gameData.game;
            addGameFormik.setValues({
              homeTeamLogo: null,
              homeTeamName: data?.homeTeamName || "",
              awayTeamLogo: null,
              awayTeamName: data?.awayTeamName || "",
              fieldId: data?.fieldId?._id || "",
              assignUserId: data?.assignUserId?.id || "",
              startDateTime: formatDateForInput(data?.startDateTime),
              eventId:data?.eventId || ""
              /*endDateTime: formatDateForInput(data?.endDateTime),*/
            });
            setEventId(data?.eventId || "");
            setHomeLogoPreview(data?.homeTeamLogo || "");
            setAwayLogoPreview(data?.awayTeamLogo || "");
          }
        } catch (error) {
          console.error("Error fetching game data:", error);
        }
      };
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    if (preselectedEventId) {
      addGameFormik.setFieldValue("eventId", preselectedEventId);
    }
  }, [preselectedEventId]);
  const fetchEvent = async () => {
  try {
    const response = await getUpcomingEvent();

    if (response) {
      setEventData(response.events);
    }
  } catch (err:any) {
  } finally {
  }
};

  // Fetch dropdown data (fields + scorekeepers)
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const fieldRes = await getallfield();
        const scorekeeperRes = await getallScorekeeper();

        if (fieldRes.field) setFields(fieldRes.field);
        if (scorekeeperRes.scoreKeeper) setScorekeepers(scorekeeperRes.scoreKeeper);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdowns();
    fetchEvent();
  }, []);

  const handleImageChange = (e: any, field: "homeTeamLogo" | "awayTeamLogo") => {
    const file = e.target.files[0];
    if (file) {
      addGameFormik.setFieldValue(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          if (field === "homeTeamLogo") setHomeLogoPreview(reader.result);
          if (field === "awayTeamLogo") setAwayLogoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="editgame" className={`${form.myprofilewrapper} dashboard-card-global`}>
      <div className="profile-card">
        <div className={form.profile_flex}>
          <h2>{id ? "Update Game" : "Add Game"}</h2>
          <Link to="/games" state={{ fromPage: location.state?.fromPage }}>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form
          onSubmit={addGameFormik.handleSubmit}
          autoComplete="off"
          className="formaddgame from-fix-global-wrap"
        >
          <div className="profile-picture-upload-wrapper">
            {/* Home Team Logo */}
            <div className="profile-picture-upload">
              <div className="uploadimage center">
                <div className="upimg">
                  <img src={homeLogoPreview || images.homeNoImage} alt="Home Logo" />
                  <input
                    className="choosefile"
                    id="homeTeamLogo"
                    name="homeTeamLogo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "homeTeamLogo")}
                  />
                  <div className="overlay">
                    <span className="icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Away Team Logo */}
            <div className="profile-picture-upload">
              <div className="uploadimage center">
                <div className="upimg">
                  <img src={awayLogoPreview || images.awayNoImage} alt="Away Logo" />
                  <input
                    className="choosefile"
                    id="awayTeamLogo"
                    name="awayTeamLogo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "awayTeamLogo")}
                  />
                  <div className="overlay">
                    <span className="icon">
                      <FontAwesomeIcon icon={faUpload} />
                    </span>
                  </div>
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
                  title="Home Team"
                  id="homeTeamName"
                  placeholder="Enter home team name"
                  name="homeTeamName"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.homeTeamName}
                  required
                  errorMsg={
                    addGameFormik.touched.homeTeamName && addGameFormik.errors.homeTeamName
                      ? addGameFormik.errors.homeTeamName
                      : ""
                  }
                />
              </div>
            </div>

            {/* Away Team Name */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <Input
                  type="text"
                  title="Away Team"
                  id="awayTeamName"
                  placeholder="Enter away team name"
                  name="awayTeamName"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.awayTeamName}
                  required
                  errorMsg={
                    addGameFormik.touched.awayTeamName && addGameFormik.errors.awayTeamName
                      ? addGameFormik.errors.awayTeamName
                      : ""
                  }
                />
              </div>
            </div>

            {/* Field (Dropdown) */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="fieldId">Field</label>
                <select
                  id="fieldId"
                  name="fieldId"
                  value={addGameFormik.values.fieldId}
                  onChange={addGameFormik.handleChange}
                >
                  <option value="">-- Select Field --</option>
                  {fields.map((field) => (
                    <option key={field._id} value={field._id}>
                      {field.name}
                    </option>
                  ))}
                </select>
                {addGameFormik.touched.fieldId && addGameFormik.errors.fieldId && (
                  <div className="error">{addGameFormik.errors.fieldId}</div>
                )}
              </div>
            </div>

            {/* Scorekeeper (Dropdown) */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="assignUserId">Scorekeeper</label>
                <select
                  id="assignUserId"
                  name="assignUserId"
                  value={addGameFormik.values.assignUserId}
                  onChange={addGameFormik.handleChange}
                >
                  <option value="">-- Select Scorekeeper --</option>
                  {scorekeepers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                {addGameFormik.touched.assignUserId && addGameFormik.errors.assignUserId && (
                  <div className="error">{addGameFormik.errors.assignUserId}</div>
                )}
              </div>
            </div>
            {user?.role === "event-director" && (
                <div className={form.profileformcol}>
                  <div className="formgrp">
                    <label htmlFor="eventId">Event</label>
                    <select
                      id="eventId"
                      name="eventId"
                      value={addGameFormik.values.eventId || eventId} // ✅ use preselectedEventId if passed
                      onChange={addGameFormik.handleChange}
                      required
                    >
                      <option value="">-- Select Event --</option>
                      {eventData.map((ev) => (
                        <option key={ev._id} value={ev._id}>
                          {ev.eventName}
                        </option>
                      ))}
                    </select>
                    {addGameFormik.touched.eventId && addGameFormik.errors.eventId && (
                      <div className="error">{addGameFormik.errors.eventId}</div>
                    )}
                  </div>
                </div>
              )}

            {/* Start Date */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <Input
                  type="datetime-local"
                  title="Start Date"
                  id="startDateTime"
                  name="startDateTime"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.startDateTime}
                  required
                  errorMsg={
                    addGameFormik.touched.startDateTime && addGameFormik.errors.startDateTime
                      ? addGameFormik.errors.startDateTime
                      : ""
                  }
                />
              </div>
            </div>

            {/* End Date
            <div className={form.profileformcol}>
              <div className="formgrp">
                <Input
                  type="datetime-local"
                  title="End Date"
                  id="endDateTime"
                  name="endDateTime"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.endDateTime}
                  required
                  errorMsg={
                    addGameFormik.touched.endDateTime && addGameFormik.errors.endDateTime
                      ? addGameFormik.errors.endDateTime
                      : ""
                  }
                />
              </div>
            </div>*/}
          </div>
               
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={`${form.profileformcol} submit-btn-wrap`}>
              <button className="custom-button submit-btn">
                {id ? "Update Game" : "Add Game"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateGame;