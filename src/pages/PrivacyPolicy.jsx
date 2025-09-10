import "../pages/css/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <>
      <section className="banner-section">
        <div className="container">
          <h1>Privacy Policy</h1>
        </div>
      </section>
      <section className="privacy-content-section">
        <div className="container">
          <div className="content-main-box">
            <h2>Last Updated: 12/02/2025</h2>
            <h5>
              At SOVA, we are committed to protecting the privacy and security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website and use our 3D design services. By accessing or using SOVA, you agree to this Privacy Policy.
            </h5>

            <div className="content-box">
              <h3>1. INFORMATION WE COLLECT</h3>
              <h6>We may collect personal information when you interact with our platform, including:</h6>
              <ul>
                <li>Creating an account on SOVA to access 3D design tools.</li>
                <li>Using features like designing wall or shop interiors in 3D.</li>
                <li>Participating in design competitions, support chats, or submitting inquiries.</li>
              </ul>
              <h6>Types of information collected include:</h6>
              <ul>
                <li><b>Personal Information:</b> Name, email address, phone number, account credentials, etc.</li>
                <li><b>Design Data:</b> Your saved 3D designs, projects, or preferences.</li>
                <li><b>Device and Technical Information:</b> IP address, browser type, operating system, and session activity.</li>
              </ul>
            </div>

            <div className="content-box">
              <h3>2. HOW WE USE YOUR INFORMATION</h3>
              <h6>Your data is used for the following purposes:</h6>
              <ul>
                <li><b>Service Provision:</b> To allow you to create, save, and manage 3D designs using SOVA tools.</li>
                <li><b>Personalization:</b> Enhancing your design experience by remembering your preferences and layouts.</li>
                <li><b>Platform Improvement:</b> Analyzing trends and feedback to improve SOVA's features and performance.</li>
                <li><b>Communication:</b> Sending updates about design features, tutorials, or product announcements.</li>
                <li><b>Security:</b> Preventing unauthorized access and ensuring safe usage of the platform.</li>
              </ul>
            </div>

            <div className="content-box">
              <h3>3. SHARING YOUR INFORMATION</h3>
              <h6>We may share your information in these limited circumstances:</h6>
              <ul>
                <li><b>Third-Party Tools:</b> Partners that assist in rendering 3D models or managing hosting infrastructure.</li>
                <li><b>Legal Requirements:</b> If required to comply with applicable law, court orders, or governmental requests.</li>
                <li><b>Business Transfers:</b> In case of company restructuring, merger, or acquisition, user data may be transferred responsibly.</li>
              </ul>
              <h6>We do not sell or rent your personal data to third parties for advertising.</h6>
            </div>

            <div className="content-box">
              <h3>4. COOKIES AND TRACKING TECHNOLOGIES</h3>
              <p>
                We use cookies to provide a seamless experience with our design tools, save project data, and track usage to improve performance.
                Cookies help identify returning users and maintain design session continuity.
              </p>
              <p>
                You can disable cookies in your browser settings; however, doing so may affect your ability to access certain features of the platform.
              </p>
            </div>

            <div className="content-box">
              <h3>5. SECURITY MEASURES</h3>
              <p>
                SOVA employs standard security practices, such as encryption and firewalls, to protect your data. However, no system is completely secure.
                Users are responsible for maintaining the confidentiality of their login credentials.
              </p>
              <p>
                In case of any unauthorized activity, please notify us immediately at <a href="mailto:contact@sova3d.com">contact@sova3d.com</a>.
              </p>
            </div>

            <div className="content-box">
              <h3>6. YOUR RIGHTS</h3>
              <h6>You have the right to:</h6>
              <ul>
                <li><b>Access & Update:</b> View or modify your personal and design information.</li>
                <li><b>Data Deletion:</b> Request deletion of your account and saved designs.</li>
                <li><b>Portability:</b> Export your 3D projects or account data in supported formats.</li>
                <li><b>Withdraw Consent:</b> Opt out of non-essential communications by contacting us at <a href="mailto:contact@sova3d.com">contact@sova3d.com</a>.</li>
              </ul>
            </div>

            <div className="content-box">
              <h3>7. RETENTION OF YOUR DATA</h3>
              <p>
                We retain your personal and design data only as long as required to provide services or fulfill legal obligations. 
                Once no longer needed, we securely delete or anonymize the data.
              </p>
            </div>

            <div className="content-box">
              <h3>8. CHILDREN'S PRIVACY</h3>
              <p>
                SOVA is intended for users aged 18 and above. We do not knowingly collect personal information from minors.
                If we discover such information has been collected inadvertently, we will remove it promptly.
              </p>
            </div>

            <div className="content-box">
              <h3>9. CHANGES TO THIS PRIVACY POLICY</h3>
              <p>
                We may update this policy to reflect changes in technology, law, or our services.
                Changes will be posted on this page, and material changes may be communicated via email.
              </p>
            </div>

            <div className="content-box">
              <h3>10. CONTACT US</h3>
              <p>If you have any questions or wish to exercise your rights, contact us at:</p>
              <span>
                <b>Email:</b> <a href="mailto:contact@sova3d.com">contact@sova3d.com</a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
