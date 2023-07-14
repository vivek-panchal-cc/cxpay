import React from "react";
import { IconDownload, IconPlusBorder, IconUpload } from "styles/svgs";

const UploadFile = (props) => {
  const {} = props || {};

  return (
    <div>
      <div class="row">
        <div class="col-12 p-0">
          <div class="form-field">
            <div class="fc-upload-receipt-wrap">
              <label for="upload_receipt" class="">
                <IconUpload stroke={"#0081C5"} />
                Upload receipt
              </label>
              {/* <input id="upload_receipt" type="file" /> */}
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 p-0">
          <div class="form-field">
            <ul class="fund-cash-download-wrap">
              <li>
                <div class="fc-download-file">
                  <a href="#" download>
                    <IconDownload stroke={"#000"} />
                  </a>
                </div>
                <a href="#" class="fc-del-pdf">
                  Delete
                </a>
              </li>
              <li>
                <div class="fc-download-file">
                  <a href="#" download>
                    <IconDownload stroke={"#000"} />
                  </a>
                </div>
                <a href="#" class="fc-del-pdf">
                  Delete
                </a>
              </li>
              <li>
                <div>
                  <a href="#">
                    <IconPlusBorder stroke={"#BDBDBD"} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
