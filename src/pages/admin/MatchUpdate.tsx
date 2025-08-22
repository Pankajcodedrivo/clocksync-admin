import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import form from "../../components/form/formcus.module.scss";
import { useParams, Link } from "react-router-dom";
import {matchesDetails,addMatch,updateMatch,teamlistApi } from "../../service/apis/matches.api";
import Select from "react-select";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate,useLocation } from 'react-router-dom';

type Team = { _id: string; teamName: string };
type TeamOption = {value: string;label: string;};

const MatchUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<{
    zone: string;
    round: string;
    teamA: TeamOption | null;
    teamAName: string;
    teamB: TeamOption | null;
    teamBName: string;
    teamAScore: string;
    teamBScore: string;
    matchNumber:string;
    matchDate: string;
  }>({
    zone: "",
    round: "",
    teamA: null,
    teamAName: "",
    teamB: null,
    teamBName: "",
    teamAScore: "",
    teamBScore: "",
    matchNumber:"",
    matchDate: ""
  });

  const zones = [
    { id: "midwest", name: "MIDWEST" },
    { id: "south", name: "SOUTH" },
    { id: "east", name: "EAST" },
    { id: "west", name: "WEST" },
  ];

  const rounds = [
    { id: "1", name: "1st Round" },
    { id: "2", name: "2nd Round" },
    { id: "3", name: "Sweet 16" },
    { id: "4", name: "Elite 8" },
    { id: "5", name: "Final Four" },
    { id: "6", name: "Championship" },
    { id: "7", name: "First Four" },
  ];

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchTeams();
      if (id) {
        await fetchMatchDetails(id);
      }
      setLoading(false);
    };
    init();
  }, [id]);
  

  const fetchTeams = async () => {
    try {
      const res = await teamlistApi();
      const formattedTeams: TeamOption[] = res.results.map((team: Team) => ({
        value: team._id,
        label: team.teamName,
      }));
      setTeams(formattedTeams);
    } catch (err) {
      toast.error("Error fetching teams");
      console.error("Error fetching teams", err);
    }
  };
  
  const fetchMatchDetails = async (matchId: string) => {
    try {
      const res = await matchesDetails(matchId);
      if(res.status===200){
      const match = res.matchDetail;
      console.log(match);

      const TeamA = {
        value: match.homeTeam?.teamId ?? "",
        label: match.homeTeam?.shortName ?? "",
      };
      const TeamB = {
        value: match.awayTeam?.teamId ?? "",
        label: match.awayTeam?.shortName ?? "",
      };
      setFormData({
        zone: match.zone || "",
        round: match.round || "",
        teamA: TeamA ,
        teamAName:  match.homeTeam?.shortName || "",
        teamB: TeamB,
        teamBName: match.awayTeam?.shortName || "",
        teamAScore: match.homeTeam?.score?.toString() || "",
        teamBScore: match.awayTeam?.score?.toString() || "",
        matchNumber:match.matchNumber||"",
        matchDate: match.matchDate ? match.matchDate.split("T")[0] : "",
      });
    }
    } catch (err) {
      toast.error("Error fetching match details");
      console.error("Error fetching match details", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleSelectChange = (
    field: "teamA" | "teamB",
    selected: TeamOption | null
  ) => {
    if (!selected) return;
    const label = selected.label;

    setFormData((prev) => ({
      ...prev,
      [field]: { value: selected.value, label },
      [`${field}Name`]: label,
    }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const errors: { [key: string]: string } = {};
    const {zone,round,teamA,teamAName,teamB,teamBName,teamAScore,teamBScore,matchNumber} = formData;
    // Validations
    if (round !== "Final Four" && round !== "Championship" &&round !== "First Four" && !zone) {
      errors.zone = "Zone is required";
    }
    if (!round) errors.round = "Round is required";
    if (formData.teamA) {
      if (!formData.teamAName || formData.teamAName.trim() === '') {
        errors.teamAName = 'Team A short name is required';
      }
    }
    if (formData.teamB) {
      if (!formData.teamBName || formData.teamBName.trim() === '') {
        errors.teamBName = 'Team B short name is required';
      }
    }
    if (formData.teamA && formData.teamB &&formData.teamAName.trim() !== "" &&formData.teamBName.trim() !== "" &&
      formData.matchNumber == "") {
      errors.matchNumber = "Match Number is required";
    }
    if (id) {
      if (teamAScore === "") errors.teamAScore = "Team A score is required";
      if (teamBScore === "") errors.teamBScore = "Team B score is required";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
  
    let payload: any = {
      zone,
      round,
      matchNumber: Number(formData.matchNumber),
      matchDate: formData.matchDate,
      homeTeam: {
        teamId: teamA?.value||null,
        shortName: teamAName|| "TBD1",
      },
      awayTeam: {
        teamId: teamB?.value||null,
        shortName: teamBName|| "TBD2",
      },
    };
  
    if (id) {
      payload.homeTeam.score = Number(teamAScore);
      payload.awayTeam.score = Number(teamBScore);
    }
  
    if (id) {
     
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to update the match data?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });
  
      if (result.isConfirmed) {
        try {
          const response = await updateMatch(id,payload);
          if (response.status===200) {
            toast.success("Match updated successfully!");
          }
        } catch (err) {
          console.error("Error submitting match data", err);
          toast.error("Failed to update match.");
        }
      }
    } else {
      try {
        const response = await addMatch(payload);
        if (response.status===200) {
          toast.success("Match created successfully");
          navigate('/admin/match'); 
        }
      } catch (err) {
        console.error("Error submitting form", err);
        toast.error("Failed to create match");
      }
    }
  };
  

  return (
    <section>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`${form.myprofilewrapper} dashboard-card-global`} id='editprofile'>
          <div className='profile-card'>
            <div className={form.profile_flex}>
              <h2>{id ? "Update Match" : "Add Match"}</h2>
              <Link to='/admin/match'state={{ fromPage: location.state?.fromPage }} >
                <button className="custom-button">Back</button>
              </Link>
            </div>
            <form onSubmit={handleSubmit} className='formadduser from-fix-global-wrap'>
              <div className={`${form.profileform} from-fix-global`}>
                {/* Round select */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label className='block font-semibold mb-1'>
                     Match Round <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      name='round'
                      value={
                        rounds.find((r) => r.name === formData.round) || null
                      }
                      onChange={(selected) => {
                        setFormData((prev) => ({
                          ...prev,
                          round: selected?.name || "",
                        }));
                        setFormErrors((prev) => ({ ...prev, round: "" }));
                      }}
                      options={rounds}
                      getOptionLabel={(r) => r.name}
                      getOptionValue={(r) => r.id}
                      placeholder='Select Round'
                      isSearchable
                      className='react-select-container'
                      classNamePrefix='react-select'
                    />
                    {formErrors.round && (
                      <div className='error'>{formErrors.round}</div>
                    )}
                  </div>
                </div>
                {/* Zone select */}
                   <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label className='block font-semibold mb-1'>
                      Zone Name{" "}
                    {formData.round !== "Final Four" && formData.round !== "First Four" && formData.round !== "Championship" && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                    </label>
                    <Select
                      name='zone'
                      value={zones.find((z) => z.name === formData.zone) || null}
                      onChange={(selected) => {
                        setFormData((prev) => ({
                          ...prev,
                          zone: selected?.name || "",
                        }));
                        setFormErrors((prev) => ({ ...prev, zone: "" }));
                      }}
                      options={zones}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                      placeholder='Select Zone'
                      isSearchable
                      className='react-select-container'
                      classNamePrefix='react-select'
                    />
                    {formErrors.zone && (
                      <div className='error'> {formErrors.zone}</div>
                    )}
                  </div>
                </div>
                {/* Team A */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label className='block font-semibold mb-1'>
                     Select Team A
                    </label>
                    <Select
                      options={teams}
                      value={formData.teamA}
                      onChange={(selected) =>
                        handleSelectChange("teamA", selected)
                      }
                      placeholder='Select Team A'
                      isSearchable
                      className='react-select-container'
                      classNamePrefix='react-select'
                    />
                    {formErrors.teamA && (
                      <div className='error'>{formErrors.teamA}</div>
                    )}
                  </div>
                </div>
                {/* Team A Short Name */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label className='block font-semibold mb-1'>
                      Short Name (Team A) {formData.teamA && <span style={{ color: "red" }}> *</span>}
                    </label>
                    <input
                      type='text'
                      name='teamAName'
                      value={formData.teamAName}
                      onChange={handleChange}
                      className='border p-2 w-full'
                    />
                    {formErrors.teamAName && (
                      <div className='error'>{formErrors.teamAName}</div>
                    )}
                  </div>
                </div>
                {id && (
                  <div className={form.profileformcol}>
                    <div className='formgrp'>
                      <label className='block font-semibold mb-1'>
                        Score (Team A) <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type='number'
                        name='teamAScore'
                        value={formData.teamAScore}
                        onChange={handleChange}
                        className='border p-2 w-full'
                      />
                      {formErrors.teamAScore && (
                        <div className='error'>{formErrors.teamAScore}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Team B */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label className='block font-semibold mb-1'>
                     Select Team B
                    </label>
                    <Select
                      options={teams}
                      value={formData.teamB}
                      onChange={(selected) =>
                        handleSelectChange("teamB", selected)
                      }
                      placeholder='Select Team B'
                      isSearchable
                      className='react-select-container'
                      classNamePrefix='react-select'
                    />
                    {formErrors.teamB && (
                      <div className='error'>{formErrors.teamB}</div>
                    )}
                  </div>
                </div>
                {/* Team B Short Name */}
                <div className={form.profileformcol}>
                  <div className='formgrp'>
                    <label className='block font-semibold mb-1'>
                       Short Name (Team B) {formData.teamB && <span style={{ color: "red" }}> *</span>}
                    </label>
                    <input
                      type='text'
                      name='teamBName'
                      value={formData.teamBName}
                      onChange={handleChange}
                      className='border p-2 w-full'
                    />
                    {formErrors.teamBName && (
                      <div className='error'>{formErrors.teamBName}</div>
                    )}
                  </div>
                </div>
                {/* Team B Score */}
                {id && (
                  <div className={form.profileformcol}>
                    <div className='formgrp'>
                      <label className='block font-semibold mb-1'>
                         Score (Team B) <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type='number'
                        name='teamBScore'
                        value={formData.teamBScore}
                        onChange={handleChange}
                        className='border p-2 w-full'
                      />
                      {formErrors.teamBScore && (
                        <div className='error'>{formErrors.teamBScore}</div>
                      )}
                    </div>
                  </div>
                )}
                <div className={form.profileformcol}>
                <div className='formgrp'>
                  <label className='block font-semibold mb-1'>
                    Match Number
                    {(formData.teamA && formData.teamB && formData.teamAName && formData.teamBName) && (
                      <span style={{ color: "red" }}> *</span>
                    )}
                  </label>
                  <input
                    type='text'
                    name='matchNumber'
                    value={formData.matchNumber}
                    onChange={handleChange}
                    className='border p-2 w-full'
                  />
                  {formErrors.matchNumber && (
                    <div className='error'>{formErrors.matchNumber}</div>
                  )}
                </div>
              </div>

              <div className={form.profileformcol}>
                <div className='formgrp'>
                  <label className='block font-semibold mb-1'>
                    Match Date <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type='date'
                    name='matchDate'
                    value={formData.matchDate}
                    onChange={handleChange}
                    className='border p-2 w-full'
                  />
                  {formErrors.matchDate && (
                    <div className='error'>{formErrors.matchDate}</div>
                  )}
                </div>
              </div>

              </div>

              {/* Submit button */}
                <div className={`${form.profileformcol} submit-btn-wrap`}>
                  <button type='submit' className="custom-button submit-btn">
                    {id ? "Update Match" : "Add Match"}
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MatchUpdate;
