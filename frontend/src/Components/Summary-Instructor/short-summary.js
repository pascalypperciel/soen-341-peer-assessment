import React, { useState, useEffect } from "react";
import Header from "../header/header";
import Footer from "../footer/footer";
import axios from "axios";

const shortSummary = () => {
    return(
        <div>
        <Header />
        <div className = "container-table">
            <table>
                <tr> 
                    <th>
                        Student ID
                    </th>
                    <th>
                        Last Name
                    </th>
                    <th>
                        First Name
                    </th>
                    <th>
                        Cooperation 
                    </th>
                    <th>
                        Conceptual Contribution
                    </th>
                    <th>
                        Pratical Contribution
                    </th>
                    <th>
                        Work Ethic
                    </th>
                    <th>
                        Average
                    </th>
                    <th>
                        Peers who respond
                    </th>
                </tr>
            </table>
        </div>
        </div>
    );



}

export default shortSummary;