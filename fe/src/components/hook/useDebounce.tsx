import React from "react";

const useDebounce = ({ value, time }: any) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, time);

    return () => {
      clearTimeout(handler);
    };
  }, [value, time]);
  return debouncedValue;
};

export default useDebounce;
