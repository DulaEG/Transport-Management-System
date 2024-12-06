import React from "react";
import styled from "styled-components";
import Header from "../Atoms/Header";
import NavBar from "../Atoms/Navbar";
import Footer from "../Atoms/Footer";
import { Route, Routes } from "react-router-dom";
import BookingPage from "../../modules/Bookings/BookingPage";
import Login from "../../modules/Auth/Login";
import Register from "../../modules/Auth/Register";
import Profile from "../../modules/Profile/Profile";
import Feedbacks from "../../modules/Inquiry/Feedbacks";
import MyFeedbacks from "../../modules/Inquiry/MyFeedbacks";
import MyBookings from "../../modules/Bookings/MyBookings";
import VehicleProfileList from "../../modules/Vehicel/VehicleProfileList";
import UserInventories from "../../modules/Inventory/UserInventories";
import UserPayments from "../../modules/IncomeExpenseManagemt/UserPayments";
import HomeModule from "../../modules/Home/HomeModule";
import MaintenanceHome from "../../modules/Driver/MaintenanceHome";
import DriverServices from "../../modules/Driver/DriverServices";
import UserBusRoutes from "../../modules/BusRoutes/UserBusRoutes";

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    width: 100%;
    flex: 1;
    background-image: url("bgimg.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(240, 240, 240, 0.8);
`;

const Home = () => {
    return (
        <Wrapper>
            <Header/>
            <NavBar/>
            <Container>
                <Routes>
                    <Route element={<HomeModule/>} path="/"/>
                    <Route element={<BookingPage/>} path="/make-booking"/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Register/>}/>
                    <Route path="/profile" element={<Profile/>}/>{" "}
                    <Route path="make-inquiry" element={<Feedbacks/>}/>
                    <Route path="my-feedbacks" element={<MyFeedbacks/>}/>
                    <Route path="my-bookings" element={<MyBookings/>}/>
                    <Route path="vehicle-list" element={<VehicleProfileList/>}/>
                    <Route path="user-inventory-" element={<UserInventories/>}/>
                    <Route path="user-payments" element={<UserPayments/>}/>
                    <Route path="maintance" element={<MaintenanceHome/>}/>
                    <Route path="ServiceDr" element={<DriverServices/>}/>
                    <Route path="/bus-timetables" element={<UserBusRoutes/>}/>
                </Routes>
            </Container>
            <Footer/>
        </Wrapper>
    );
};

export default Home;
