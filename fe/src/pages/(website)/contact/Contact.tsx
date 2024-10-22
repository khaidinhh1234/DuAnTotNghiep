import { useLocalStorage } from "@/components/hook/useStoratge";
import ContactPage from "./_components/Contact";

const Contact = () => {
  const [user] = useLocalStorage("user" as any, {});
  console.log(user);

  return (
    <>
      <ContactPage user={user} />
    </>
  );
};

export default Contact;
