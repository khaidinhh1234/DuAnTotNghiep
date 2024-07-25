
import EnterOtpForm from './_components/EnterOTPForm'
import ImageSection from './_components/ImageSection'

const EnterOtp = () => {
  return (
    <>
    <div className="h-screen overflow-hidden bg-gray-100 md:bg-white">
    <div className="flex flex-col md:flex-row min-h-screen">
    <ImageSection/>
    <EnterOtpForm/>
    </div>
    </div>
    </>
  )
}

export default EnterOtp