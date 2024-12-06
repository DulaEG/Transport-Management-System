import React, { useEffect, useState } from "react";
import { Card, Button, Spin } from "antd";
import { PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import vProfileService from "../../services/vehicleProfileService"; // Import your service

// Styled component for horizontal scrolling
const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 20px;
  gap: 20px;
  height: 100%;
  width: 100%;
  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const ProfileCard = styled(Card)`
  min-width: 250px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 150px;
  max-width: 180px;
  object-fit: cover;
  border-bottom: 1px solid #f0f0f0;
`;

const VehicleProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch vehicle profiles on component mount
    const fetchProfiles = async () => {
      try {
        const data = await vProfileService.getAllVProfiles();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div style={{ padding: "20px", background: "rgba(211, 211, 211, 0.5);" }}>
      <h2 style={{ color: "white" }}>Vehicle Profiles</h2>
      {loading ? (
        <Spin />
      ) : (
        <ScrollContainer>
          {profiles.map((profile) => (
            <ProfileCard key={profile._id} hoverable>
              <ProfileImage src={profile.imageUrl} alt={profile.description} />
              <h3>{profile.description}</h3>
              <p>
                <strong>{profile.type}</strong>
              </p>
              <p>
                {profile.time && (
                  <>
                    <ClockCircleOutlined /> {profile.time}
                  </>
                )}
              </p>
              <Button icon={<PhoneOutlined />} type="primary">
                Contact us
              </Button>
            </ProfileCard>
          ))}
        </ScrollContainer>
      )}
    </div>
  );
};

export default VehicleProfileList;
