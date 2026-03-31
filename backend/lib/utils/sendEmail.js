export const sendEmailNotification = async (toEmail, toName, bloodType, emergencyLevel, hospitalName, hospitalAddress, requiredUnits) => {
    try {
        const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service_id: "service_foj3pag",
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    to_email: toEmail,
                    to_name: toName,
                    blood_type: bloodType,
                    emergency_level: emergencyLevel,
                    hospital_name: hospitalName,
                    hospital_address: hospitalAddress,
                    required_units: requiredUnits,
                }
            })
        });

        if (res.ok) {
            console.log(`Email sent to ${toEmail}`);
        } else {
            const text = await res.text();
            console.log(`Email failed for ${toEmail}: ${text}`);
        }
    } catch (error) {
        console.log(`Email error for ${toEmail}: ${error.message}`);
    }
};
