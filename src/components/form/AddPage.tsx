import Input from "../UI/input/Input";
import form from "./formcus.module.scss";
import { useAddPage } from "./useAddPage";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner"; // Import the spinner
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from "react-router-dom";
import { pageDetails } from "../../service/apis/page.api";
import { useEffect } from "react";
const AddPage = () => {
  const params = useParams();
  const { id } = params;
  const { addPageFormik, loading } = useAddPage(id);
  useEffect(() => {
    if (addPageFormik.submitCount === 0) {
      addPageFormik.setErrors({});
    }
  }, [addPageFormik]);
  return (
    <div id='updatePage' className={form.myprofilewrapper}>
      <div className='profile-card'>
        <div className={form.profile_flex}>
          <h2>{id ? "Update Page" : "Add Page"}</h2>
          <Link to='/admin/pages'>
            <button className={form.back_btn}>Back</button>
          </Link>
        </div>

        <form onSubmit={addPageFormik.handleSubmit} autoComplete='off'>
          <div className={form.profileform}>
            <div className={`${form.profileformcol} ${form.fullWidth} p-0`}>
              <div className='formgrp'>
                <Input
                  type={"text"}
                  title='Title'
                  id='title'
                  placeholder={"Enter Title"}
                  name='title'
                  required={true}
                  onChange={addPageFormik.handleChange}
                  value={addPageFormik.values.title}
                  errorMsg={addPageFormik.errors.title}
                />
              </div>
            </div>
            <div
              className={`${form.profileformcol} ${form.fullWidth} updatePagecontent`}
            >
              <div className='formgrp'>
                <label htmlFor='description'>Description</label>
                <Editor
                  id='description'
                  apiKey='7rfniqex5btxrikbi2pjfr6yrak5gwdh0ikqm8u93hbmcqye'
                  value={addPageFormik.values.description}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins:
                      "preview importcss searchreplace autolink directionality code visualblocks visualchars fullscreen link table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
                    toolbar:
                      "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | pagebreak anchor codesample | ltr rtl",
                    placeholder: "Enter job description here...",
                    block_formats:
                      "Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3",
                  }}
                  onEditorChange={(content) => {
                    addPageFormik.setFieldValue("description", content);
                    addPageFormik.setFieldTouched("description", true);
                  }}
                />
                {addPageFormik.errors.description &&
                  addPageFormik.touched.description && (
                    <span className={form.errorText} style={{ color: "red" }}>
                      {addPageFormik.errors.description}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <button className={form.upbtn}>{id ? "Update" : "Save"}</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddPage;
