import ForgotPasswordForm from './_components/ForgotPasswordForm'
import ImageSection from './_components/ImageSection'


const Page = () => {
  return (
    <>
    <div className="h-screen overflow-hidden bg-gray-100 md:bg-white">
    <div className="flex flex-col md:flex-row min-h-screen">
    <ImageSection/>
    <ForgotPasswordForm/>
    </div>
    </div>
    </>
  )
}
export default Page