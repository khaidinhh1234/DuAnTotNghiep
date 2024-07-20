// OTPPage.js
import React from 'react';
import OTPForm from './_components/entotpForm';
import ImageSection from './_components/ImageSection';


const OTPPage = () => (
    <section className="min-h-screen bg-gray-100 md:bg-white">
        <div className="flex flex-col md:flex-row min-h-screen">
            < ImageSection/>
            <OTPForm />
        </div>
</section>
);

export default OTPPage;
