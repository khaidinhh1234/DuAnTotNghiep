import { useLocalStorage } from "@/components/hook/useStoratge";
import ContactPage from "./_components/Contact";
import Method from "../_component/Method";

const Contact = () => {
  const [user] = useLocalStorage("user" as any, {});
  // console.log(user);

  return (
    <>
      <ContactPage user={user} />
      <Method />
    </>
  );
};

export default Contact;
