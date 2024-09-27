import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer'

const RatingPage = () => {
    
    return (
        <div>
          <Header />
          <div className='container'>
            <h2> Welcome to the Peer Evaluation Page </h2>
            <p>
            This evaluation enables students to assess the contributions and performance of 
            their teammates across four essential dimensions: cooperation, conceptual contribution, 
            practical contribution, and work ethic. By focusing on these key areas, students 
            can provide constructive feedback that fosters teamwork and enhances overall group performance.
            </p>

            <div className='instruction'>
                <h4>  Anonymous Evaluation Process</h4>
                <p>
                This evaluation is conducted anonymously to encourage honest and constructive feedback. 
                Participants will rate their teammates on a 7-point scale, allowing for a nuanced assessment of contributions and performance.                
                </p>
            </div>

            <div className='student'> 
                <p>
                    The student that you are evaluating:
                </p>
                <p> Jeffrey Smith</p> {/* need to get the name of the student that I will rate*/ }
            </div>

            <div className='evalution'>
                <h4> Cooperation </h4>
                <p>
                Evaluate your peer's ability to work cooperatively within the group.
                </p>
                    
            </div>

            <div className='evaluation'>
                <h4> Conceptual ContributionContribution </h4>
                <p>
                Evaluate your peer's contribution to the group’s overall ideas and problem-solving.
                </p>
                    
            </div>

            <div className='evaluation'>
                <h4> Practical Contribution </h4>
                <p>
                Evaluate your peer's ability to work cooperatively within the group.
                </p>
                    
            </div>

            <div className='evaluation'>
                <h4> Work Ethic </h4>
                <p>
                Evaluate your peer's ability to work cooperatively within the group.
                </p>
                    
            </div>
            <div className='comments'>
                <h4> General Comments </h4>
                <p>
                Use this section to provide any overall impressions or suggestions for improvement.
                </p>
                    
            </div>
          </div>
          <Footer />
        </div>
      );
    };      
    

export default RatingPage;