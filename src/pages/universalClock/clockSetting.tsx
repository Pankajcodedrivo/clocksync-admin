import { useEffect, useState } from "react";
import classes from "../../components/edit/editCustomer/EditCustomer.module.scss";
import "../../scss/universalClock.scss";
import images from "../../constants/images";
import useSocket from "../../utils/sockect";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const UniversalClock = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const userId = user?.id;

  // Clock states
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [quarter, setQuarter] = useState<number>(0);

  // Temporary manual input
  const [tempMinutes, setTempMinutes] = useState<number>(0);
  const [tempSeconds, setTempSeconds] = useState<number>(0);

  // ✅ Socket handlers (match server events)
  const { isConnected, emit } = useSocket(userId, {
    // Fired when clock is updated or ticked
    universalClockUpdated: (clock: any) => {
      setMinutes(clock.minutes);
      setSeconds(clock.seconds);
      setRunning(clock.running);
      setQuarter(clock.quarter);
      setQuarter(clock.quarter || 0);
    },
    // Fired when user joins → server sends initial clock
    universalClockState: (clock: any) => {
      setMinutes(clock.minutes);
      setSeconds(clock.seconds);
      setRunning(clock.running);
      setQuarter(clock.quarter);
      setQuarter(clock.quarter || 0);
    },
  });

  // 🕒 Start or pause clock
  const handlePlayPause = () => {
    const newState = !running;
    setRunning(newState);

    if (newState) {
      emit("startUniversalClock", { userId }); // ✅ matches server
    } else {
      emit("pauseUniversalClock", { userId }); // ✅ matches server
    }
  };

  // 🕒 Set clock manually (update DB + sync all games)
  const handleSetClock = () => {
    emit("setUniversalClock", {
      userId,
      minutes: tempMinutes,
      seconds: tempSeconds,
      quarter,
    });

    // update local UI immediately
    setMinutes(tempMinutes);
    setSeconds(tempSeconds);
    setTempMinutes(0);
    setTempSeconds(0);
  };

  // 🔁 Quarter control
  const handleQuarterChange = (type: "inc" | "dec") => {
    const newQuarter = type === "inc" ? quarter + 1 : Math.max(1, quarter - 1);
    if(newQuarter<0){
      return ;
    }
    setQuarter(newQuarter);

    emit("setUniversalClock", {
      userId,
      minutes,
      seconds,
      quarter: newQuarter,
    });
  };

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className={classes.user_acc}>
      <div className={classes.edit__container}>
        <div className={classes.edit__left}>
          <div className="dashboard-card-global settings">
            <div className={`${classes.account} center`}>
              <div className="score-card-innr p-0">
                <div className="score-card">
                  <div className="score-icon">
                    <img src={images.iconclock} alt="clock icon" />
                  </div>

                  <h3>Quarter</h3>

                  <div className="score-content pb-0">
                    <div className="quantity">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuarterChange("dec")}
                      >
                        <img src={images.minus} alt="-" />
                      </button>
                      <input type="number" value={quarter} readOnly />
                      <button
                        className="qty-btn"
                        onClick={() => handleQuarterChange("inc")}
                      >
                        <img src={images.plus} alt="+" />
                      </button>
                    </div>

                    <div className="timer">
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  <div className="set-clock">
                    <div className="time-select">
                      <select
                        className="form-control"
                        value={tempMinutes}
                        onChange={(e) => setTempMinutes(Number(e.target.value))}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} Min
                          </option>
                        ))}
                      </select>

                      <select
                        className="form-control"
                        value={tempSeconds}
                        onChange={(e) => setTempSeconds(Number(e.target.value))}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} Sec
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      className="clock"
                      style={{ cursor: "pointer" }}
                      onClick={handleSetClock}
                    >
                      Set Clock{" "}
                      <span>
                        <img src={images.setclock} alt="set clock" />
                      </span>
                    </div>

                    <button className="play-btn" onClick={handlePlayPause}>
                      <img
                        src={running ? images.pausebtn : images.playbtn}
                        alt={running ? "pause" : "play"}
                      />
                    </button>
                  </div>

                  {!isConnected && (
                    <div className="text-red-500 text-sm mt-2">
                      ⚠️ Disconnected from server
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalClock;
