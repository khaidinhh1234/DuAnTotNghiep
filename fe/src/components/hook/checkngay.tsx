const Check = (date: any) => {
  const today: Date = new Date();
  const soNgayCheck = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  const isValid = soNgayCheck <= 3;
  return isValid;
};
export default Check;
