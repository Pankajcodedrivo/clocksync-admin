import classes from "./LoadingSpinner.module.scss";

const LoadingSpinner = () => {
  return (
    <div className="spinner-wrap-cus">
    <div className={classes.spinner__wrapper}>
      <div className={classes.spinner}></div>
    </div>
    </div>
  );
};

export default LoadingSpinner;
