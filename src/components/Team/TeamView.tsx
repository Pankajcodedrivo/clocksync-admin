import { useEffect, useState } from "react";
import Input from "../UI/input/Input";
import form from "../form/formcus.module.scss";
import { useTeamUser } from "./UseTeamAdd";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { Link } from "react-router-dom";
import { useParams,useLocation } from "react-router-dom";
import { TeamDetails } from "../../service/apis/team.api";

const TeamView = () => {
  const params = useParams();
    const location = useLocation();
  const { id } = params;
  const { addTeamFormik, loading } = useTeamUser(id);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const TeamData = await TeamDetails(id);
          if (TeamData.status === 200) {
            //console.log(TeamData);
            addTeamFormik.setValues({
              teamname: TeamData.teamData?.teamName || "",
              venue: TeamData.teamData?.location || "",
              teamlogo: TeamData.teamData?.teamLogo || "",
              random: TeamData.teamData?.randomNumber || "",
              seednumber: TeamData.teamData?.seedNumber || "",
            });
            setImagePreview(TeamData.teamData?.teamLogo || "");
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      addTeamFormik.setFieldValue("teamlogo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  if (isLoading) {
    return <LoadingSpinner />; 
  }
  return (
    <div id='editprofile' className={`${form.myprofilewrapper} dashboard-card-global`}>
      <div className='profile-card'>
        <div className={form.profile_flex}>
          <h2>{"Update Team"}</h2>
          <Link to='/admin/teams'state={{ fromPage: location.state?.fromPage }}>
            <button className="custom-button">Back</button>
          </Link>
        </div>

        <form
          onSubmit={addTeamFormik.handleSubmit}
          autoComplete='off'
          className='formadduser from-fix-global-wrap'
        >
          <div className={`${form.profileform}  from-fix-global`}>
            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Team Name <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type={"text"}
                  id='teamname'
                  placeholder={"Enter your team name"}
                  name='teamname'
                  onChange={addTeamFormik.handleChange}
                  value={addTeamFormik.values.teamname}
                />
                {addTeamFormik.touched.teamname &&
                  addTeamFormik.errors.teamname && (
                    <div className='error'>{addTeamFormik.errors.teamname}</div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'>
                  Location <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes='passwordlabel'
                  type='text'
                  id='venue'
                  name='venue'
                  placeholder={"Enter your location"}
                  value={addTeamFormik.values.venue}
                  onChange={addTeamFormik.handleChange}
                />
                {addTeamFormik.touched.venue && addTeamFormik.errors.venue && (
                  <div className='error'>{addTeamFormik.errors.venue}</div>
                )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className="formgrp">
                <label htmlFor="seednumber">
                  Seed Number <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  classes="passwordlabel"
                  type="number"
                  id="seednumber"
                  name="seednumber"
                  placeholder="Enter your seed number"
                  onChange={addTeamFormik.handleChange}
                  value={addTeamFormik.values.seednumber.toString()}
                />
                {addTeamFormik.touched.seednumber && addTeamFormik.errors.seednumber && (
                  <div className="error">{addTeamFormik.errors.seednumber}</div>
                )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='Name'> Bid Number - Random <span style={{ color: "red" }}>*</span></label>
                <Input
                  classes='passwordlabel'
                  type='number'
                  id='random'
                  name='random'
                  placeholder={"Enter your random number"}
                  value={addTeamFormik.values.random.toString()}
                  onChange={addTeamFormik.handleChange}
                />
                {addTeamFormik.touched.random &&
                  addTeamFormik.errors.random && (
                    <div className='error'>{addTeamFormik.errors.random}</div>
                  )}
              </div>
            </div>

            <div className={form.profileformcol}>
              <div className='formgrp'>
                <label htmlFor='profileImage'>Team Logo</label>
                <input
                  type='file'
                  id='teamlogo'
                  name='teamlogo'
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className='image-preview mt-20'>
                    <img
                      src={imagePreview}
                      alt='Preview'
                      width={100}
                      height={100}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
             <div className={`${form.profileformcol} submit-btn-wrap`}>
              {" "}
              <button className="custom-button submit-btn">Save</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TeamView;
