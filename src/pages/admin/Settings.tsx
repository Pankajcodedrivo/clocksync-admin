import React, { useState, useEffect ,useRef} from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { DateTimePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Card from "../../components/UI/card/Card";
import classes from "../../components/edit/editCustomer/EditCustomer.module.scss";
import Avatar from "../../assets/images/avatar.jpg";
import { getsettings, savesettings,PauseAuction } from "../../service/apis/setting.api";
import toast from "react-hot-toast";
import { connectSocket, getSocket } from '../../service/socketService';

function Settings() {
  const [value, setValue] = useState("1");
  const [headerlogopreview, setHeaderlogopreview] = useState(Avatar);
  const [footerlogopreview, setFooterlogopreview] = useState(Avatar);
  const [id, setId] = useState("");
  const [copyright, setCopyright] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [auctionDateTime, setAuctionDateTime] = useState<string>("");

  const [pauseDuration, setPauseDuration] = useState<string | null>(null); 
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const resumeDateTimeRef = useRef<Date | null>(null); 
  const [refUpdated, setRefUpdated] = useState(false); 

  React.useEffect(() => {
    connectSocket();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getDetails = async () => {
    try {
      const response = await getsettings();
      if (response) {
        setHeaderlogopreview(response?.settings.sitelogo);
        setFooterlogopreview(response?.settings.footerlogo);
        setId(response?.settings._id);
        setCopyright(response?.settings.copyright || "");
        setAdminEmail(response?.settings.adminEmail || "");
        const previousDateTime = response?.settings.auctionDate || "";
        const formattedDateTime = formatDateTime(previousDateTime);
        setAuctionDateTime(formattedDateTime);
      }
    } catch (error) {
      console.log("An error occurred while updating the profile.");
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleHeaderFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeaderlogopreview(URL.createObjectURL(file));
      handleHeaderLogoUpload(file);
    }
  };

  const handleHeaderLogoUpload = async (file: File) => {
    if (!file) {
      alert("Please select an image file first.");
      return;
    }
    const formData = new FormData();
    formData.append("sitelogo", file);
    try {
      const response = await savesettings(formData, id);
      toast.success("Header logo updated successfully");
    } catch (error) {
      console.log("An error occurred while updating the header logo.");
    }
  };

  const handleFooterFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFooterlogopreview(URL.createObjectURL(file));
      handleFooterLogoUpload(file);
    }
  };

  const handleFooterLogoUpload = async (file: File) => {
    if (!file) {
      alert("Please select an image file first.");
      return;
    }
    const formData = new FormData();
    formData.append("footerlogo", file);
    try {
      const response = await savesettings(formData, id);
      toast.success("Footer logo updated successfully");
    } catch (error) {
      console.log("An error occurred while updating the footer logo.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyright.trim()) {
      toast.error("Copyright text cannot be empty.");
      return;
    }
    if (!adminEmail.trim() || !/^\S+@\S+\.\S+$/.test(adminEmail)) {
      toast.error("Please provide a valid email address.");
      return;
    }
    try {
      const bodyData = {
        copyright: copyright,
        adminEmail: adminEmail,
      };
      const response = await savesettings(bodyData, id);
      toast.success("Settings saved successfully.");
    } catch (error) {
      console.log("An error occurred while saving the settings.");
    }
  };
  const formatDateTime = (datetime: string) => {
    if (!datetime) return "";

    const dateObj = new Date(datetime);
    if (isNaN(dateObj.getTime())) return "";
    // Convert UTC to PST (UTC-8)
    const pstOffset = 7 * 60 * 60 * 1000; // UTC-8 in milliseconds
    const pstDate = new Date(dateObj.getTime() - pstOffset);
    return pstDate.toISOString().slice(0, 16); // Format for datetime-local input
  };
  const handleAuction = async (event: any) => {
    event.preventDefault();
    let auctionDateTime = event.target.elements.auctionDateTime.value;
   // console.log(auctionDateTime);
    if (!auctionDateTime) {
      toast.error("Please select a valid date and time.");
      return;
    }
    // Manually construct the date as PST
    const [datePart, timePart] = auctionDateTime.split("T");
    const pstDate = new Date(`${datePart}T${timePart}:00-07:00`); // PST (UTC-8)
    const utcDate = new Date(pstDate.getTime());
    try {
      const bodyData = {
        auctionDate: utcDate.toISOString(),
      };
      const response = await savesettings(bodyData, id);
      toast.success("Auction saved successfully.");
    } catch (error) {
      console.log("An error occurred while saving the auction.");
    }
  };

  useEffect(() => {
    const storedResumeDateTime = localStorage.getItem('resumeDateTime');
    if (storedResumeDateTime) {
      resumeDateTimeRef.current = new Date(storedResumeDateTime);
      const currentDateTime = new Date();
      if (currentDateTime >= resumeDateTimeRef.current) {
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(true);
      }
    }
  }, []);
  const handlePause =async () => {
    if (pauseDuration === null) {
      toast.error('Please select a pause duration');
      return;
    }
    setIsButtonDisabled(true);
    const socket = getSocket();
    socket.emit('pause_auction', { duration: parseInt(pauseDuration) });

        toast.success(`Auction paused for ${pauseDuration} minutes.`);
        try {
          const bodyData = {
            pauseTime: pauseDuration,
          };
          const Response = await PauseAuction(bodyData,id);
          if (Response.status===200) {
            const resumeDateTime = new Date(Response.data.pauseTime);
            resumeDateTimeRef.current = resumeDateTime;
            localStorage.setItem('resumeDateTime', resumeDateTime.toISOString());
            setRefUpdated(prev => !prev);
           } else {
            toast.error('Failed to pause auction.');
            setIsButtonDisabled(false);
          }
        } catch (error) {
          console.log('Error occurred while pausing the auction.');
          setIsButtonDisabled(false); 
        }
  };
  useEffect(() => {
    if (!resumeDateTimeRef.current) return;
    const intervalId = setInterval(() => {
      if (resumeDateTimeRef.current) {
        const currentDateTime = new Date();
        if (currentDateTime >= resumeDateTimeRef.current) {
          setIsButtonDisabled(false); 
          localStorage.removeItem('resumeDateTime');
          clearInterval(intervalId);
        }
      }
    }, 10000); 
    return () => {
      clearInterval(intervalId);
    };
  }, [refUpdated]);

  return (
    <div className={classes.user_acc}>
      <div className={classes.edit__container}>
        <div className={classes.edit__left}>
          <div className="dashboard-card-global">
            <div className={classes.account}>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label='lab API tabs example'
                      className='settingTab'
                    >
                      <Tab label='Site Logo' value='1' />
                      <Tab label='Footer Content' value='2' />
                      <Tab label='Auction' value='3' />
                      <Tab label='Pause Auction' value='4' />
                    </TabList>
                  </Box>

                  <TabPanel value='1' className='settingTabContent'>
                    <div className='header-wrap'>
                      <form className='upload-setting-logo'>
                        <label>Header Logo</label>
                        <div className='upload-logo-file'>
                          <div className='uploadimage'>
                            <div className='upload-logo'>
                              <img
                                src={headerlogopreview || Avatar}
                                alt='Avatar'
                              />
                            </div>
                            <div className='upbtn'>
                              <input
                                className='choosefile'
                                type='file'
                                accept='image/*'
                                onChange={handleHeaderFileChange}
                              />
                              <button className="custom-button">
                                Upload Picture
                              </button>
                            </div>
                          </div>
                        </div>
                        <label>Footer Logo</label>
                        <div className='upload-logo-file'>
                          <div className='uploadimage'>
                            <div className='upload-logo'>
                              <img
                                src={footerlogopreview || Avatar}
                                alt='Avatar'
                              />
                            </div>
                            <div className='upbtn'>
                              <input
                                className='choosefile'
                                type='file'
                                accept='image/*'
                                onChange={handleFooterFileChange}
                              />
                              <button className="custom-button">
                                Upload Picture
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>

                  <TabPanel value='2' className='settingTabContent'>
                    <div className='footer-wrap'>
                      <form
                        onSubmit={handleSaveSettings}
                        className='upload-setting-logo'
                      >
                        <label>Bottom Copyright</label>
                        <div className='formgrp'>
                          <input
                            type='text'
                            placeholder='Copyright text'
                            value={copyright}
                            onChange={(e) => setCopyright(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <label>Admin Email</label>
                        <div className='formgrp'>
                          <input
                            type='text'
                            placeholder='Admin email'
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            style={{ marginRight: "10px" }}
                          />
                        </div>
                        <button type='submit' className="custom-button submit-btn">
                          Save
                        </button>
                      </form>
                    </div>
                  </TabPanel>

                  {/* Auction Tab */}
                  <TabPanel value='3' className='settingTabContent'>
                    <div className='auction-wrap'>
                      <form
                        onSubmit={handleAuction}
                        className='auction-settings upload-setting-logo'
                      >
                        <label>Auction Date and Time</label>

                        <div className='formgrp'>
                          <input
                            type='datetime-local'
                            id='auctionDateTime'
                            name='auctionDateTime'
                            onChange={(e) => setAuctionDateTime(e.target.value)}
                            value={auctionDateTime}
                            required
                          />
                        </div>
                        <button type='submit' className="custom-button submit-btn">
                          Save Auction Settings
                        </button>
                      </form>                    
                    </div>
                  </TabPanel>
                   {/* Auction Tab */}
                   <TabPanel value='4' className='settingTabContent'>
                    <div className='auction-wrap'>
                    <div className='pause-settings custom-input-field'>
                    <label>Pause Auction</label>
                      <div className='formgrp'>
                        <select
                          value={pauseDuration ?? ''} 
                          onChange={(e) => setPauseDuration(e.target.value)}
                          className="custom-input form-select w-50"
                        >
                          <option value=''>Select Pause Duration</option>
                          <option value="2">2 Minutes</option>
                          <option value="10">10 Minutes</option>
                          <option value="20">20 Minutes</option>
                          <option value="30">30 Minutes</option>
                        </select>
                      </div>
                       <div className={`submit-btn-wrap mt-20`}>
                      <button onClick={handlePause} className="custom-button submit-btn" disabled={isButtonDisabled}
                      style={{
                        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',  
                        opacity: isButtonDisabled ? 0.6 : 1,
                      }}>
                      Pause Auction
                      </button>
                      </div>
                    </div>                
                    </div>
                  </TabPanel>
                </TabContext>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
