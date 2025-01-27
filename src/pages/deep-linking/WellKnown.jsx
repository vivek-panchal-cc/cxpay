import { useEffect } from "react";
import { useParams } from "react-router-dom";

const jsonFiles = {
  "apple-app-site-association": {
    applinks: {
      apps: [],
      details: [
        {
          appID: "47VC8Q6D6D.com.cxpay.app",
          paths: ["*"],
        },
      ],
    },
    webcredentials: {
      apps: ["47VC8Q6D6D.com.cxpay.app"],
    },
  },
  assetlinks: [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.cxpay.app",
        sha256_cert_fingerprints: [
          "E2:6E:FB:A1:94:C0:D3:0E:21:88:27:B7:E4:C5:02:D2:F3:C9:2E:A2:87:81:EB:21:EC:CA:4E:06:8E:59:3D:79",
        ],
      },
    },
  ],
};

function WellKnown() {
  const { fileName } = useParams();

  // Find the requested JSON content
  const jsonContent = jsonFiles[fileName];

  if (!jsonContent) {
    // If the file doesn't exist, return a 404 message
    return <h1>404 - File Not Found</h1>;
  }

  // Render JSON content as a plain object
  return (
    <div>
      <pre className="dark_black">{JSON.stringify(jsonContent, null, 2)}</pre>
    </div>
  );
}

export default WellKnown;
