import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Switch from "@mui/material/Switch";
import { images } from "../../constants";
import toast from "react-hot-toast";
import { getsettings, savesettings } from "../../service/apis/setting.api";
import Input from "../../components/UI/input/Input"; // custom Input component
import classes from "../../components/edit/editCustomer/EditCustomer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function Settings() {
  const [value, setValue] = useState("1");
  const [headerlogopreview, setHeaderlogopreview] = useState("");
  const [googleAdClient, setGoogleAdClient] = useState("");
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  

  const [id, setId] = useState("");
  const [copyright, setCopyright] = useState("");
  const [copyright2, setCopyright2] = useState("");
  

  // Desktop & Mobile ads with Google AdSense structured fields
  const [desktop, setDesktop] = useState<any>({
    top: { image: "", link: "", useGoogleAd: false, googleAdSense: { slot: "", width: "", height: "" } },
    right: { image: "", link: "", useGoogleAd: false, googleAdSense: { slot: "", width: "", height: "" } },
    left: { image: "", link: "", useGoogleAd: false, googleAdSense: { slot: "", width: "", height: "" } },
  });

  const [mobile, setMobile] = useState<any>({
    top: { image: "", link: "", useGoogleAd: false, googleAdSense: { slot: "", width: "", height: "" } },
    middle: { image: "", link: "", useGoogleAd: false, googleAdSense: { slot: "", width: "", height: "" } },
    bottom: { image: "", link: "", useGoogleAd: false, googleAdSense: { slot: "", width: "", height: "" } },
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
        setCopyright2(response?.settings.copyright2 || "");
        setGoogleAdClient(response?.settings.googleAdClient || "");
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
    field: "image" | "link" | "useGoogleAd" | "googleAdSense",
    value: any
  ) => {
    const setter = device === "desktop" ? setDesktop : setMobile;
    setter((prev: any) => ({
      ...prev,
      [position]: { ...prev[position], [field]: value },
    }));
  };

  const handleGoogleAdChange = (
    device: "desktop" | "mobile",
    position: string,
    field: "slot" | "width" | "height",
    value: string
  ) => {
    const setter = device === "desktop" ? setDesktop : setMobile;
    setter((prev: any) => ({
      ...prev,
      [position]: {
        ...prev[position],
        googleAdSense: { ...prev[position].googleAdSense, [field]: value },
      },
    }));
  };

  const handleHeaderFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setHeaderlogopreview(URL.createObjectURL(file));
      setHeaderLogoFile(file);
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

      // Site Logo
      if (value === "1") {
        if (!headerLogoFile) {
          toast.error("Please select a header logo before saving.");
          return;
        }
        formData.append("sitelogo", headerLogoFile);
      }

      // Footer
      if (value === "2") {
        if (!copyright.trim()) {
          toast.error("Bottom Copyright text cannot be empty.");
          return;
        }
        if (!copyright2.trim()) {
          toast.error("Bottom Copyright2 text cannot be empty.");
          return;
        }
        
        formData.append("copyright2", copyright2);
        if (googleAdClient.trim()) {
           formData.append("googleAdClient", googleAdClient);
        }
      }

      // Desktop Ads
      if (value === "3") {
        let hasData = false;
        Object.keys(desktop).forEach((pos) => {
          const placement = desktop[pos];
          if (placement.useGoogleAd || placement.link || desktopFiles[pos]) hasData = true;

          formData.append(`desktop[${pos}][useGoogleAd]`, placement.useGoogleAd ? "true" : "false");
          formData.append(`desktop[${pos}][link]`, placement.link || "");

          if (placement.useGoogleAd) {
            formData.append(`desktop[${pos}][googleAdSense][slot]`, placement.googleAdSense.slot || "");
            formData.append(`desktop[${pos}][googleAdSense][width]`, placement.googleAdSense.width || "");
            formData.append(`desktop[${pos}][googleAdSense][height]`, placement.googleAdSense.height || "");
          }

          if (desktopFiles[pos]) {
            formData.append(`desktop[${pos}][image]`, desktopFiles[pos]);
          }else{
            formData.append(`desktop[${pos}][image]`,  placement.image || "");
          }
        });
        if (!hasData) {
          toast.error("Please configure at least one desktop ad.");
          return;
        }
      }

      // Mobile Ads
      if (value === "4") {
        let hasData = false;
        Object.keys(mobile).forEach((pos) => {
          const placement = mobile[pos];
          if (placement.useGoogleAd || placement.link || mobileFiles[pos]) hasData = true;

          formData.append(`mobile[${pos}][useGoogleAd]`, placement.useGoogleAd ? "true" : "false");
          formData.append(`mobile[${pos}][link]`, placement.link || "");

          if (placement.useGoogleAd) {
            formData.append(`mobile[${pos}][googleAdSense][slot]`, placement.googleAdSense.slot || "");
            formData.append(`mobile[${pos}][googleAdSense][width]`, placement.googleAdSense.width || "");
            formData.append(`mobile[${pos}][googleAdSense][height]`, placement.googleAdSense.height || "");
          }

          if (mobileFiles[pos]) {
            formData.append(`mobile[${pos}][image]`, mobileFiles[pos]);
          }else{
            formData.append(`mobile[${pos}][image]`,  placement.image || "");
          }
        });
        if (!hasData) {
          toast.error("Please configure at least one mobile ad.");
          return;
        }
      }

      await savesettings(formData, id);
      toast.success("Settings saved successfully.");
      getDetails(); // refresh after save
    } catch (err) {
      toast.error("Error saving settings");
    }
  };

  // Render ad placement input with toggle
  const renderPlacement = (
    device: "desktop" | "mobile",
    placements: any,
    previews: any
  ) => {
    return Object.keys(placements).map((pos) => {
      const placement = placements[pos];
      return (
        <div key={pos} className="ad-placement">
          <h4 style={{ color: "#fff" }}>{pos.toUpperCase()} Ad</h4>

          <Switch
            checked={placement.useGoogleAd || false}
            onChange={(e) => handlePlacementChange(device, pos, "useGoogleAd", e.target.checked)}
          />
          <span style={{ marginLeft: 8 }}>
            {placement.useGoogleAd ? "Google AdSense" : "Custom Ad"}
          </span>

          {placement.useGoogleAd ? (
            <>
              <Input
                type="text"
                title="Ad Slot"
                id="Ad_Slot"
                placeholder="Enter Ad Slot ID"
                value={placement?.googleAdSense?.slot || ""}
                onChange={(e: any) => handleGoogleAdChange(device, pos, "slot", e.target.value)}
              />
              <Input
                type="number"
                title="Width"
                id="Width"
                placeholder="Enter width (px)"
                value={placement?.googleAdSense?.width || ""}
                onChange={(e: any) => handleGoogleAdChange(device, pos, "width", e.target.value)}
              />
              <Input
                type="number"
                title="Height"
                id="Height"
                placeholder="Enter height (px)"
                value={placement?.googleAdSense?.height || ""}
                onChange={(e: any) => handleGoogleAdChange(device, pos, "height", e.target.value)}
              />
            </>
          ) : (
            <>
              <div className="upload-logo-file">
                <div className="uploadimage">
                  <div className="upload-logo">
                    <img
                      src={previews[pos] || placement.image || images.noImageData}
                      alt={`${pos} preview`}
                       className={previews[pos] || placement.image ? "" : "no-image"}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePlacementFileChange(device, pos, file);
                      }}
                    />
                    <div className="overlay">
                      <span className="icon">
                        <FontAwesomeIcon icon={faUpload} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Input
                type="text"
                title="Ad Link"
                id="Ad_Link"
                placeholder="Enter link"
                value={placement.link || ""}
                onChange={(e: any) => handlePlacementChange(device, pos, "link", e.target.value)}
              />
            </>
          )}
        </div>
      );
    });
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
                        variant="scrollable"      // ✅ Enables horizontal scroll
      scrollButtons="auto"      // ✅ Shows scroll buttons when needed
      allowScrollButtonsMobile // ✅ Shows scroll buttons on mobile
                    >
                      <Tab label="Site Logo" value="1" />
                      <Tab label="Footer Content" value="2" />
                      {/* <Tab label="Desktop Ads" value="3" />
                      <Tab label="Mobile Ads" value="4" />
                      */ }
                    </TabList>
                  </Box>

                  {/* Site Logo */}
                  <TabPanel value="1" className="settingTabContent">
                    <form className="upload-setting-logo" onSubmit={handleSaveSettings}>
                      <label>Header Logo</label>
                      <div className="upload-logo-file">
                        <div className="uploadimage">
                          <div className="upload-logo">
                            <img src={headerlogopreview || images.noImageData} alt="Header" className={headerlogopreview ? "" : "no-image"} 
/>
                            <input
                              id="headerUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleHeaderFileChange}
                            />
                            <div className="overlay">
                              <span className="icon">
                                <FontAwesomeIcon icon={faUpload} />
                              </span>
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
                        title="Bottom Copyright2"
                        id="copyright"
                        placeholder="Enter copyright2"
                        name="copyright2"
                        value={copyright2}
                        onChange={(e: any) => setCopyright2(e.target.value)}
                        required
                      />
                      <Input
                        type="text"
                        title="Google Ads Client Id"
                        id="googleAdClient"
                        placeholder="Enter Google Ads Client Id"
                        name="googleAdClient"
                        value={googleAdClient}
                        onChange={(e: any) => setGoogleAdClient(e.target.value)}
                        
                      />
                      <button type="submit" className="custom-button submit-btn">
                        Save
                      </button>
                    </form>
                  </TabPanel>

                  {/* Desktop Ads */}
                  <TabPanel value="3" className="settingTabContent">
                    <h3>Desktop Placements</h3>
                    {renderPlacement("desktop", desktop, desktopPreviews)}
                    <button onClick={handleSaveSettings} className="custom-button submit-btn">
                      Save Desktop
                    </button>
                  </TabPanel>

                  {/* Mobile Ads */}
                  <TabPanel value="4" className="settingTabContent">
                    <h3>Mobile Placements</h3>
                    {renderPlacement("mobile", mobile, mobilePreviews)}
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
