import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../containers/LandingPage";

const AppRouter = props => {
    const [
        breadcrumbsItems,
        setBreadcrumbsItems
      ] = React.useState([
        {
            text: 'Gen AI Atlas',
            href: '/'
        }]);

    return (
        <Router>
            <div>
                <Routes>
                    <Route path='/' element={<LandingPage {...props} breadcrumbsItems={breadcrumbsItems} setBreadcrumbsItems={setBreadcrumbsItems} navigationOpen={props.navigationOpen} setNavigationOpen={props.setNavigationOpen}/>} />
                    <Route path="*" element={<Navigate to="/" replace {...props} breadcrumbsItems={breadcrumbsItems} setBreadcrumbsItems={setBreadcrumbsItems} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default AppRouter;