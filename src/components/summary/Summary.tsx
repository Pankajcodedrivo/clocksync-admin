import React from "react";
import SummaryBox from "./SummaryBox";
import classes from "./Summary.module.scss";
import { IsummData } from "../../interfaces/IsummData";

function Summary(props: any) {
  const { data } = props; // destructure your incoming data

  // Build dynamic summaryData from props
  const summaryData: IsummData[] = [
    {
      icon: "ph:users-bold",
      text: "Total User",
      amount: data?.totalUsers?.toString() || "0",
      currency: "",
    },
    {
      icon: "ph:users-bold",
      text: "Total Admin",
      amount: data?.totalAdmin?.toString() || "0",
      currency: "",
    },
    {
      icon: "ph:users-bold",
      text: "Total ScoreKeeper",
      amount: data?.totalScorekeeper?.toString() || "0",
      currency: "",
    },
    {
      icon: "ph:users-bold",
      text: "Total Subscriber",
      amount: data?.totalSubscribeUser?.toString() || "0",
      currency: "",
    },
    {
      icon: "mdi:stadium",
      text: "Total Fields",
      amount: data?.totalFields?.toString() || "0",
      currency: "",
    },
    {
      icon: "mdi:gamepad",
      text: "Total Games",
      amount: data?.totalGames?.toString() || "0",
      currency: "",
    },
    
  ];

  return (
    <section className={classes.summary}>
      <div className={classes.summary__box}>
        {summaryData.map((item) => (
          <SummaryBox key={item.text} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Summary;
