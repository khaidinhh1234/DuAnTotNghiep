import { useState } from "react";

import { Button } from "antd"; // Importing Ant Design's Button
import "antd/dist/reset.css"; // Make sure to import Ant Design's CSS

const Test = () => {
  const [value, setValue] = useState("");
  console.log("Value:", value);

  return (
    <div>
   
      <Button type="primary" style={{ marginTop: "16px" }}>
        Submit
      </Button>
      <h1>{value}</h1>
    </div>
  );
};

export default Test;
