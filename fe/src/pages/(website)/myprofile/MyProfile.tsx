import { useLocalStorage } from "@/components/hook/useStoratge";
import ListMyProfile from "./_components/Listmyprofile";

const MyProfile = () => {
  const [user] = useLocalStorage("user" as any, {});
  const member = user?.user; // console.log(member);
  return (
    <>
      {/* <MyProfilePage member={member} /> */}
      <ListMyProfile />
    </>
  );
};

export default MyProfile;
