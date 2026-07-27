import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Plugin,
  FileRepository,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Link,
  List,
  TodoList,
  Indent,
  IndentBlock,
  BlockQuote,
  CodeBlock,
  Alignment,
  Font,
  Highlight,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Image,
  ImageUpload,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  LinkImage,
  PasteFromOffice,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersEssentials,
  FindAndReplace,
  WordCount,
  HorizontalLine,
  PageBreak,
  SourceEditing,
  Autoformat,
  GeneralHtmlSupport
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import { api } from "../services/api";

const getUploadUrl = () => {
  const baseUrl = api.defaults.baseURL || "http://localhost:5000/api";
  return `${baseUrl.replace(/\/$/, "")}/upload`;
};

class CloudinaryUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.xhr = null;
  }

  upload() {
    return this.loader.file.then((file) => {
      if (!file) {
        return Promise.reject(new Error("No file selected."));
      }

      return new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      });
    });
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open("POST", getUploadUrl(), true);
    xhr.responseType = "json";

    const token = localStorage.getItem("himtrail_token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericError = `Could not upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericError));
    xhr.addEventListener("abort", () => reject());

    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || xhr.status < 200 || xhr.status >= 300 || !response.url) {
        reject(response?.message || response?.error?.message || genericError);
        return;
      }

      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append("image", file);
    this.xhr.send(data);
  }
}

class CloudinaryUploadAdapterPlugin extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  init() {
    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
      return new CloudinaryUploadAdapter(loader);
    };
  }
}

const RichTextEditor = ({ value, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: "GPL",

        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Subscript,
          Superscript,
          Link,
          List,
          TodoList,
          Indent,
          IndentBlock,
          BlockQuote,
          CodeBlock,
          Alignment,
          Font,
          Highlight,
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          Image,
          ImageUpload,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          LinkImage,
          PasteFromOffice,
          RemoveFormat,
          SpecialCharacters,
          SpecialCharactersEssentials,
          FindAndReplace,
          WordCount,
          HorizontalLine,
          PageBreak,
          SourceEditing,
          Autoformat,
          GeneralHtmlSupport,
          CloudinaryUploadAdapterPlugin
        ],

        toolbar: [
          "undo", "redo", "|",
          "findAndReplace", "|",
          "heading", "|",
          "fontFamily", "fontSize", "fontColor", "fontBackgroundColor", "|",
          "bold", "italic", "underline", "strikethrough", "subscript", "superscript", "removeFormat", "|",
          "alignment", "|",
          "bulletedList", "numberedList", "todoList", "|",
          "outdent", "indent", "|",
          "link", "insertTable", "uploadImage", "blockQuote", "codeBlock", "horizontalLine", "pageBreak", "|",
          "highlight", "specialCharacters", "|",
          "sourceEditing"
        ],

        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties"
          ]
        },

        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
            "linkImage"
          ],
          resizeUnit: "px"
        },

        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 24, 28, 32]
        },

        htmlSupport: {
          allow: [
            {
              name: /.*/,
              attributes: true,
              classes: true,
              styles: true
            }
          ]
        }
      }}
      data={value}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
};

export default RichTextEditor;
