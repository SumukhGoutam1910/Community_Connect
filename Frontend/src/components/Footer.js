
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  return (
    <FooterContainer style={isAuth ? { marginTop: 0 } : {}}>
      <FooterInner>
      <BrandCol>
        <Logo src="/ECE_logo/Logo.jpg" alt="Logo" />
        <BrandName>CommunityConnect</BrandName>
        <Tagline>Connecting talent with opportunity.</Tagline>
        <Socials>
            <SocialLink href="https://www.linkedin.com/company/communityconnect" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></SocialLink>
            <SocialLink href="https://twitter.com/communityconnect" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></SocialLink>
            <SocialLink href="https://facebook.com/communityconnect" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></SocialLink>
            <SocialLink href="https://instagram.com/communityconnect" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></SocialLink>
        </Socials>
      </BrandCol>
      <LinksCol>
        <ColTitle>About</ColTitle>
          <FooterLink href="https://www.communityconnect.com/about" target="_blank" rel="noopener noreferrer">Company</FooterLink>
          <FooterLink href="https://www.communityconnect.com/team" target="_blank" rel="noopener noreferrer">Team</FooterLink>
          <FooterLink href="https://www.communityconnect.com/careers" target="_blank" rel="noopener noreferrer">Careers</FooterLink>
          <FooterLink href="https://www.communityconnect.com/blog" target="_blank" rel="noopener noreferrer">Blog</FooterLink>
      </LinksCol>
      <LinksCol>
        <ColTitle>Resources</ColTitle>
          <FooterLink href="https://www.communityconnect.com/help" target="_blank" rel="noopener noreferrer">Help Center</FooterLink>
          <FooterLink href="https://www.communityconnect.com/guides" target="_blank" rel="noopener noreferrer">Guides</FooterLink>
          <FooterLink href="https://www.communityconnect.com/events" target="_blank" rel="noopener noreferrer">Events</FooterLink>
          <FooterLink href="https://www.communityconnect.com/contact" target="_blank" rel="noopener noreferrer">Contact</FooterLink>
      </LinksCol>
      <LinksCol>
        <ColTitle>Legal</ColTitle>
          <FooterLink href="https://www.communityconnect.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</FooterLink>
          <FooterLink href="https://www.communityconnect.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</FooterLink>
          <FooterLink href="https://www.communityconnect.com/cookies" target="_blank" rel="noopener noreferrer">Cookie Policy</FooterLink>
      </LinksCol>
      </FooterInner>
      <Copyright>
        © {new Date().getFullYear()} Sumukh Goutam. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  background: #18191a;
  color: #e4e6eb;
  font-size: 1rem;
  border-top: 1px solid #23272b;
  margin-top: 0;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 32px;
  padding: 48px 16px 8px 16px;
`;

const BrandCol = styled.div`
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  background: #e0e0e0;
`;

const BrandName = styled.div`
  font-weight: 700;
  font-size: 1.3rem;
  color: #0a66c2;
  letter-spacing: 1px;
`;

const Tagline = styled.div`
  font-size: 1rem;
  color: #b0b3b8;
`;

const Socials = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

const SocialLink = styled.a`
  color: #e4e6eb;
  transition: color 0.2s;
  &:hover {
    color: #0a66c2;
  }
`;

const LinksCol = styled.div`
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
`;

const FooterLink = styled.a`
  color: #e4e6eb;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover {
    color: #0a66c2;
    text-decoration: underline;
  }
`;

const Copyright = styled.div`
  color: #b0b3b8;
  font-size: 0.98rem;
  text-align: center;
  padding: 16px 0 8px 0;
`;

export default Footer;
