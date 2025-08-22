import { Link } from "react-router-dom";
import Button from "../components/UI/button/Button";
import { useTranslation } from "react-i18next";
import img404 from "../assets/images/Oops_404_Error_with_a_broken_robot_cuate.svg";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function NotFound() {
  const { lang } = useSelector((state: RootState) => state.langSlice);
  const { t } = useTranslation();
  return (
    <div
      className={`${
        lang === "en" ? "notFound__container" : "notFound__container_rtl"
      }`}
    >
      <h2
        className={` notFound__title ${
          lang === "fa" ? "notFound__title_rtl" : "notFound__title_ltr"
        }`}
      >
        {t("notFoundMsg")}
      </h2>
      <Link to='/'>
        <Button>{t("backToHome")}</Button>
      </Link>
      <div className='notFound__img'>
        <img src={img404} alt='404 page' />
      </div>
    </div>
  );
}

export default NotFound;
