import { useLocalStorage } from "@/components/hook/useStoratge";
import MyProfilePage from "./_components/MyProfile";

const MyProfile = () => {
  const [user] = useLocalStorage("user" as any, {});
  const member = user.user;
  console.log(member);
  return (
    <>
      <MyProfilePage member={member} />
    </>
  );
};

export default MyProfile;
