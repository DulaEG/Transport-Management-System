import React from "react";
import styled from "styled-components";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";

const FooterContainer = styled.div`
  background-color: #4a4a4a; /* The greyish color in the footer */
  color: white;
  padding: 20px 0;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: left;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Section = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h4`
  color: white;
  margin-bottom: 15px;
`;

const Link = styled.a`
  color: #c1c1c1;
  display: block;
  margin-bottom: 8px;
  text-decoration: none;

  &:hover {
    color: white;
  }
`;

const SocialIcon = styled.div`
  display: flex;
  gap: 10px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* Quick Links Section */}
        <Section>
          <SectionTitle>Quick Links</SectionTitle>
          <Link href="/">Home</Link>
          <Link href="/vehicle-profiles">Vehicle profiles</Link>
          <Link href="/bus-timetables">Bus Timetables</Link>
        </Section>

        {/* Extra Links Section */}
        <Section>
          <SectionTitle>Extra Links</SectionTitle>
          <Link href="/about-us">About us</Link>
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms-of-travel">Terms of Travel</Link>
        </Section>

        {/* Contact Information Section */}
        <Section>
          <SectionTitle>Contact Information</SectionTitle>
          <ContactInfo>
            <span>
              <PhoneOutlined /> 081-2223344
            </span>
            <span>
              <PhoneOutlined /> 071-5554443
            </span>
            <span>
              <MailOutlined /> indikamotors@gmail.com
            </span>
          </ContactInfo>
        </Section>

        {/* Follow Us Section */}
        <Section>
          <SectionTitle>Follow Us</SectionTitle>
          <SocialIcon>
            <a href="https://facebook.com">
              <FacebookOutlined
                style={{ fontSize: "20px", color: "#c1c1c1" }}
              />
            </a>
            <a href="https://instagram.com">
              <InstagramOutlined
                style={{ fontSize: "20px", color: "#c1c1c1" }}
              />
            </a>
            <a href="https://twitter.com">
              <TwitterOutlined style={{ fontSize: "20px", color: "#c1c1c1" }} />
            </a>
          </SocialIcon>
        </Section>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
