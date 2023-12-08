import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";

export const Editor = ({ formData, handleChange }) => {
  return (
    <div>
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        defaultValue={formData?.content}
        onChange={(value) =>
          handleChange({ target: { name: "content", value } })
        }
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
        style={{
          height: "25rem",
        }}
      />
    </div>
  );
};

export default Editor;
