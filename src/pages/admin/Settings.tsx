import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { images } from "../../constants";
import toast from "react-hot-toast";

import { getsettings, savesettings } from "../../service/apis/setting.api";

import Input from "../../components/UI/input/Input"; // your custom Input component
import classes from "../../components/edit/editCustomer/EditCustomer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function Settings() {
  const [value, setValue] = useState("1");
  const [headerlogopreview, setHeaderlogopreview] = useState("");
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);

  const [id, setId] = useState("");
  const [copyright, setCopyright] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  
  const [desktop, setDesktop] = useState<any>({
    top: { image: "", link: "" },
    right: { image: "", link: "" },
    left: { image: "", link: "" },
  });
  const [mobile, setMobile] = useState<any>({
    top: { image: "", link: "" },
    middle: { image: "", link: "" },
    bottom: { image: "", link: "" },
  });

  const [desktopPreviews, setDesktopPreviews] = useState<any>({});
  const [mobilePreviews, setMobilePreviews] = useState<any>({});
  const [desktopFiles, setDesktopFiles] = useState<any>({});
  const [mobileFiles, setMobileFiles] = useState<any>({});

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getDetails = async () => {
    try {
      const response = await getsettings();
      if (response) {
        setHeaderlogopreview(response?.settings.sitelogo || "");
        setId(response?.settings._id);
        setCopyright(response?.settings.copyright || "");
        setAdminEmail(response?.settings.adminEmail || "");
        if (response?.settings.desktop) setDesktop(response.settings.desktop);
        if (response?.settings.mobile) setMobile(response.settings.mobile);
      }
    } catch (error) {
      console.log("An error occurred while fetching settings.");
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handlePlacementChange = (
    device: "desktop" | "mobile",
    position: string,
    field: "image" | "link",
    value: string
  ) => {
    if (device === "desktop") {
      setDesktop((prev: any) => ({
        ...prev,
        [position]: { ...prev[position], [field]: value },
      }));
    } else {
      setMobile((prev: any) => ({
        ...prev,
        [position]: { ...prev[position], [field]: value },
      }));
    }
  };

  const handleHeaderFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeaderlogopreview(URL.createObjectURL(file));
      setHeaderLogoFile(file); // store file until save
    }
  };

  const handlePlacementFileChange = (
    device: "desktop" | "mobile",
    position: string,
    file: File
  ) => {
    const previewUrl = URL.createObjectURL(file);

    if (device === "desktop") {
      setDesktopPreviews((prev: any) => ({ ...prev, [position]: previewUrl }));
      setDesktopFiles((prev: any) => ({ ...prev, [position]: file }));
    } else {
      setMobilePreviews((prev: any) => ({ ...prev, [position]: previewUrl }));
      setMobileFiles((prev: any) => ({ ...prev, [position]: file }));
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const formData = new FormData();

      if (value === "1") {
        // === Site Logo tab ===
        if (!headerLogoFile) {
          toast.error("Please select a header logo before saving.");
          return;
        }
        formData.append("sitelogo", headerLogoFile);
      }

      if (value === "2") {
        // === Footer Content tab ===
        if (!copyright.trim()) {
          toast.error("Copyright text cannot be empty.");
          return;
        }
        if (!adminEmail.trim() || !/^\S+@\S+\.\S+$/.test(adminEmail)) {
          toast.error("Please provide a valid email address.");
          return;
        }
        formData.append("copyright", copyright);
        formData.append("adminEmail", adminEmail);
      }

      if (value === "3") {
        // === Desktop Ads tab ===
        let hasData = false;
        Object.keys(desktop).forEach((pos) => {
          if (desktop[pos].link || desktopFiles[pos]) hasData = true;
          formData.append(`desktop[${pos}][link]`, desktop[pos].link || "");
          if (desktopFiles[pos]) {
            formData.append(`desktop[${pos}][image]`, desktopFiles[pos]);
          }
        });
        if (!hasData) {
          toast.error("Please upload at least one desktop ad or link.");
          return;
        }
      }

      if (value === "4") {
        // === Mobile Ads tab ===
        let hasData = false;
        Object.keys(mobile).forEach((pos) => {
          if (mobile[pos].link || mobileFiles[pos]) hasData = true;
          formData.append(`mobile[${pos}][link]`, mobile[pos].link || "");
          if (mobileFiles[pos]) {
            formData.append(`mobile[${pos}][image]`, mobileFiles[pos]);
          }
        });
        if (!hasData) {
          toast.error("Please upload at least one mobile ad or link.");
          return;
        }
      }

      await savesettings(formData, id);
      toast.success("Settings saved successfully.");
      getDetails(); // refresh after save
    } catch {
      toast.error("Error saving settings");
    }
  };


  return (
    <div className={classes.user_acc}>
      <div className={classes.edit__container}>
        <div className={classes.edit__left}>
          <div className="dashboard-card-global settings">
            <div className={classes.account}>
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      aria-label="settings tabs"
                      className="settingTab"
                    >
                      <Tab label="Site Logo" value="1" />
                      <Tab label="Footer Content" value="2" />
                      <Tab label="Desktop Ads" value="3" />
                      <Tab label="Mobile Ads" value="4" />
                    </TabList>
                  </Box>

                  {/* Site Logo */}
                  <TabPanel value="1" className="settingTabContent">
                    <form className="upload-setting-logo" onSubmit={handleSaveSettings}>
                      <label>Header Logo</label>
                      <div className="upload-logo-file">
                        <div className="uploadimage">
                          <div className="upload-logo">
                            <img src={headerlogopreview || images.noImageData} alt="Header" />
                          </div>
                          <div className="upbtn">
                            <input
                              id="headerUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleHeaderFileChange}
                            />
                            <div className="overlay">
                              <span className="icon"> <FontAwesomeIcon icon={faUpload} /></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="custom-button submit-btn">
                        Save Logo
                      </button>
                    </form>
                  </TabPanel>

                  {/* Footer Content */}
                  <TabPanel value="2" className="settingTabContent">
                    <form onSubmit={handleSaveSettings}>
                      <Input
                        type="text"
                        title="Bottom Copyright"
                        id="copyright"
                        placeholder="Enter copyright"
                        name="copyright"
                        value={copyright}
                        onChange={(e: any) => setCopyright(e.target.value)}
                        required
                      />
                      <Input
                        type="text"
                        title="Admin Email"
                        id="adminEmail"
                        placeholder="Enter admin email"
                        name="adminEmail"
                        value={adminEmail}
                        onChange={(e: any) => setAdminEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="custom-button submit-btn">
                        Save
                      </button>
                    </form>
                  </TabPanel>

                  {/* Desktop Placements */}
                  <TabPanel value="3" className="settingTabContent">
                    <h3>Desktop Placements</h3>
                    {["top", "right", "left"].map((pos) => (
                      <div key={pos}>
                        <label>{pos.toUpperCase()} Image</label>
                        <div className="upload-logo-file">
                          <div className="uploadimage">
                            <div className="upload-logo">
                              <img
                                src={
                                  desktopPreviews[pos] ||
                                  desktop[pos]?.image ||
                                  images.noImageData
                                }
                                alt={`${pos} preview`}
                              />
                            </div>
                            <div className="upbtn">
                              <input
                                id={`desktop-${pos}-upload`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePlacementFileChange("desktop", pos, file);
                                }}
                              />
                              <div className="overlay">
                                <span className="icon"> <FontAwesomeIcon icon={faUpload} /></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Input
                          type="text"
                          title={`${pos.toUpperCase()} Link`}
                          id={`desktop-${pos}-link`}
                          placeholder="Enter link"
                          name={`desktop-${pos}-link`}
                          value={desktop[pos]?.link || ""}
                          onChange={(e: any) =>
                            handlePlacementChange("desktop", pos, "link", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <button onClick={handleSaveSettings} className="custom-button submit-btn">
                      Save Desktop
                    </button>
                  </TabPanel>

                  {/* Mobile Placements */}
                  <TabPanel value="4" className="settingTabContent">
                    <h3>Mobile Placements</h3>
                    {["top", "middle", "bottom"].map((pos) => (
                      <div key={pos}>
                        <label>{pos.toUpperCase()} Image</label>
                        <div className="upload-logo-file">
                          <div className="uploadimage">
                            <div className="upload-logo">
                              <img
                                src={
                                  mobilePreviews[pos] ||
                                  mobile[pos]?.image ||
                                  images.noImageData
                                }
                                alt={`${pos} preview`}
                              />
                            </div>
                            <div className="upbtn">
                              <input
                                id={`mobile-${pos}-upload`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePlacementFileChange("mobile", pos, file);
                                }}
                              />
                              <div className="overlay">
                              <span className="icon"> <FontAwesomeIcon icon={faUpload} /></span>
                            </div>
                            </div>
                          </div>
                        </div>
                        <Input
                          type="text"
                          title={`${pos.toUpperCase()} Link`}
                          id={`mobile-${pos}-link`}
                          placeholder="Enter link"
                          name={`mobile-${pos}-link`}
                          value={mobile[pos]?.link || ""}
                          onChange={(e: any) =>
                            handlePlacementChange("mobile", pos, "link", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <button onClick={handleSaveSettings} className="custom-button submit-btn">
                      Save Mobile
                    </button>
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
