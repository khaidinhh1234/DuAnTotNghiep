export const Check = (date: any) => {
  const today: Date = new Date();
  const soNgayCheck = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  const isValid = soNgayCheck <= 3;
  return isValid;
};

export const Checkhoan = (date: any) => {
  const today: Date = new Date();
  const inputDate: Date = new Date(date);
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date format");
  }
  const soNgayCheck = Math.floor(
    (today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  // console.log(soNgayCheck);
  const isValid = soNgayCheck <= 3;
  // console.log(isValid);
  return isValid;
};
