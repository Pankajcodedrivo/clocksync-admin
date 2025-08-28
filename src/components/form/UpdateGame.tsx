import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { useAddGame } from "./useAddGame";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { gameDetails } from "../../service/apis/game.api";
import { images } from "../../constants";

const UpdateGame = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = params;
  const { addGameFormik, loading } = useAddGame(id);
  const [homeLogoPreview, setHomeLogoPreview] = useState<string | null>(null);
  const [awayLogoPreview, setAwayLogoPreview] = useState<string | null>(null);

  useEffect(() => {
       // 🚨 if path is update but no ID, redirect to list
    if (location.pathname.includes("/update") && !id) {
      navigate("/admin/games", { replace: true });
      return;
    }
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

            {/* Field */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <Input
                  type="text"
                  title="Field"
                  id="fieldId"
                  placeholder="Enter field id"
                  name="fieldId"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.fieldId}
                  required
                  errorMsg={
                    addGameFormik.touched.fieldId && addGameFormik.errors.fieldId
                      ? addGameFormik.errors.fieldId
                      : ""
                  }
                />
              </div>
            </div>

            {/* Assign User */}
            <div className={form.profileformcol}>
              <div className="formgrp">
                <Input
                  type="text"
                  title="Scorekeeper"
                  id="assignUserId"
                  placeholder="Enter scorekeeper ID"
                  name="assignUserId"
                  onChange={addGameFormik.handleChange}
                  value={addGameFormik.values.assignUserId}
                  required
                  errorMsg={
                    addGameFormik.touched.assignUserId && addGameFormik.errors.assignUserId
                      ? addGameFormik.errors.assignUserId
                      : ""
                  }
                />
              </div>
            </div>

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

            {/* End Date */}
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
