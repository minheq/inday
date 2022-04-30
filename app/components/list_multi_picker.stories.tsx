import React, { useState } from "react";

import { ListMultiPicker } from "./list_multi_picker";

export function Basic(): JSX.Element {
  const [value, setValue] = useState(["January"]);

  return (
    <ListMultiPicker
      value={value}
      options={[
        { label: "January", value: "January" },
        { label: "February", value: "February" },
        { label: "March", value: "March" },
        { label: "April", value: "April" },
        { label: "May", value: "May" },
        { label: "June", value: "June" },
        { label: "July", value: "July" },
        { label: "August", value: "August" },
        { label: "September", value: "September" },
        { label: "October", value: "October" },
        { label: "November", value: "November" },
        { label: "December", value: "December" },
      ]}
      onChange={setValue}
    />
  );
}
