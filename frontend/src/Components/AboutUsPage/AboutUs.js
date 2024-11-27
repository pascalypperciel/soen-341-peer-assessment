import React from "react";
import "./AboutUs.css"; 
import Main from "../HeaderLanding/Main";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Pascal Ypperciel",
      role: "CEO & Founder",
      description: "Pascal is the visionary behind our team. He oversees all of our code, fixes all of our bugs and manages the repository as it were his own child.",
    },
    {
      name: "Massimo Caruso",
      role: "Frontend Engineer",
      description: "Massimo is a second year software engineering student with a knack for developing cutting edge frontend technology.",
    },
    {
      name: "Jessica Codreanu",
      role: "Frontend Engineer",
      description: "Jessica is a second year software engineering student who excels at connecting the backend routes to the frontend, as well as implementing a stunning user interface.",
    },
    {
      name: "Parsa Darbani",
      role: "Frontend Engineer",
      description: "Parsa is a second year software engineering student, who also acts as a statistician. Collecting data has never been made so easy.",
    },
    {
      name: "Anthony Guarraci",
      role: "Backend Engineer",
      description: "Anthony is a second year software engineering student who puts the hug in huge. An elite level powerlifter with a passion for the backend.",
    },
    {
      name: "Justin Lombardi",
      role: "Backend Engineer",
      description: "Justin is a second year software engineering student who can route just about anything he pleases. He will scrape data and have it as a snack; he is responsible for ensuring smooth transactions between the backend and the frontend.",
    },
  ];

  return (
    
    <div className="about-us">
      <div className="header">
        <Main />
      </div>
      <section className="company-description">
        <h1>About Us</h1>
        <p>
          Our company is dedicated to delivering innovative solutions that solve real-world problems.
          We are passionate about technology and driven by a commitment to excellence and customer satisfaction.
          The system that we created will give genuine feedback to the students and the instructor in charge of the course.
        </p>
      </section>

      <section className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <h3>{member.name}</h3>
              <p><strong>{member.role}</strong></p>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
