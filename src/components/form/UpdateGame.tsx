import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { useAddGame } from "./useAddGame";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useLocation } from "react-router-dom";
import { gameDetails } from "../../service/apis/game.api";
import { images } from "../../constants";

const UpdateGame = () => {
  const params = useParams();
  const location = useLocation();
  const { id } = params;
  const { addGameFormik, loading } = useAddGame(id);
  const [homeLogoPreview, setHomeLogoPreview] = useState<string | null>(null);
  const [awayLogoPreview, setAwayLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const gameData = await gameDetails(id);
          if (gameData.status === 200) {
            const data = gameData.gameData;
            addGameFormik.setValues({
              homeTeamLogo: null,
              homeTeamName: data?.homeTeamName || "",
              awayTeamLogo: null,
              awayTeamName: data?.awayTeamName || "",
              fieldId: data?.fieldId || "",
              assignUserId: data?.assignUserId || "",
              startDateTime: data?.startDateTime || "",
              endDateTime: data?.endDateTime || "",
            });
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
          <Link to="/admin/games" state={{ fromPage: location.state?.fromPage }}>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form
          onSubmit={addGameFormik.handleSubmit}
          autoComplete="off"
          className="formaddgame from-fix-global-wrap"
        >
          {/* Home Team Logo */}
          <div className="profile-picture-upload">
            <div className="uploadimage center">
              <div className="upimg">
                <img src={homeLogoPreview || images.noimage} alt="Home Logo" />
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
                <img src={awayLogoPreview || images.noimage} alt="Away Logo" />
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

          <div className={`${form.profileform} from-fix-global`}>
            {/* Home Team Name */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="homeTeamName">
                  Home Team <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  id="homeTeamName"
                  placeholder="Enter home team name"
                  name="homeTeamName"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.homeTeamName}
                />
                {addGameFormik.touched.homeTeamName &&
                  addGameFormik.errors.homeTeamName && (
                    <div className="error">{addGameFormik.errors.homeTeamName}</div>
                  )}
              </div>
            </div>

            {/* Away Team Name */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="awayTeamName">
                  Away Team <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  id="awayTeamName"
                  placeholder="Enter away team name"
                  name="awayTeamName"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.awayTeamName}
                />
                {addGameFormik.touched.awayTeamName &&
                  addGameFormik.errors.awayTeamName && (
                    <div className="error">{addGameFormik.errors.awayTeamName}</div>
                  )}
              </div>
            </div>

            {/* Field */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="fieldId">
                  Field <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  id="fieldId"
                  placeholder="Enter field id"
                  name="fieldId"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.fieldId}
                />
                {addGameFormik.touched.fieldId && addGameFormik.errors.fieldId && (
                  <div className="error">{addGameFormik.errors.fieldId}</div>
                )}
              </div>
            </div>

            {/* Assign User */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="assignUserId">
                  Scorekeeper <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  id="assignUserId"
                  placeholder="Enter scorekeeper ID"
                  name="assignUserId"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.assignUserId}
                />
                {addGameFormik.touched.assignUserId &&
                  addGameFormik.errors.assignUserId && (
                    <div className="error">{addGameFormik.errors.assignUserId}</div>
                  )}
              </div>
            </div>

            {/* Start Date */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="startDateTime">
                  Start Date <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="datetime-local"
                  id="startDateTime"
                  name="startDateTime"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.startDateTime}
                />
                {addGameFormik.touched.startDateTime &&
                  addGameFormik.errors.startDateTime && (
                    <div className="error">{addGameFormik.errors.startDateTime}</div>
                  )}
              </div>
            </div>

            {/* End Date */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="endDateTime">
                  End Date <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="datetime-local"
                  id="endDateTime"
                  name="endDateTime"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.endDateTime}
                />
                {addGameFormik.touched.endDateTime &&
                  addGameFormik.errors.endDateTime && (
                    <div className="error">{addGameFormik.errors.endDateTime}</div>
                  )}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className={`${form.profileformcol} submit-btn-wrap`}>
              <button className="custom-button submit-btn">Save</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateGame;
