import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Plus, UserPlus, Users } from 'lucide-react';

const Network = () => {
  const [sentRequests, setSentRequests] = React.useState([]);
  const connections = [
    { id: 1, name: "Dr. Sarah Johnson", title: "Professor of Electronics", mutual: 12, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 2, name: "Prof. Mark Wilson", title: "Communication Systems Expert", mutual: 8, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 3, name: "Dr. Emily Chen", title: "Signal Processing Researcher", mutual: 15, avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 4, name: "Alex Rodriguez", title: "Final Year ECE Student", mutual: 23, avatar: "https://randomuser.me/api/portraits/men/76.jpg" },
    { id: 5, name: "Priya Sharma", title: "Electronics Engineer", mutual: 7, avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
    { id: 6, name: "Dr. Robert Kim", title: "VLSI Design Specialist", mutual: 11, avatar: "https://randomuser.me/api/portraits/men/41.jpg" }
  ];

  const [invitations, setInvitations] = React.useState([
    { id: 1, name: "Dr. Lisa Wang", title: "Assistant Professor", avatar: "https://randomuser.me/api/portraits/women/21.jpg" },
    { id: 2, name: "John Thompson", title: "Research Scholar", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: 3, name: "Maria Garcia", title: "Electronics Student", avatar: "https://randomuser.me/api/portraits/women/23.jpg" }
  ]);

  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <Title>My Network</Title>
          <Subtitle>Grow your network by connecting with ECE professionals</Subtitle>
        </Header>

        <NetworkGrid>
          <LeftColumn>
            <Section>
              <SectionHeader>
                <SectionTitle>Invitations</SectionTitle>
                <SectionCount>{invitations.length}</SectionCount>
              </SectionHeader>
              
              {invitations.map(person => (
                <InvitationCard key={person.id}>
                  <CardLeft>
                    <Avatar src={person.avatar} alt={person.name} />
                    <PersonInfo>
                      <PersonName>{person.name}</PersonName>
                      <PersonTitle>{person.title}</PersonTitle>
                    </PersonInfo>
                  </CardLeft>
                  <CardActions>
                    <AcceptButton onClick={() => setInvitations(inv => inv.filter(p => p.id !== person.id))}>Accept</AcceptButton>
                    <IgnoreButton onClick={() => setInvitations(inv => inv.filter(p => p.id !== person.id))}>Ignore</IgnoreButton>
                  </CardActions>
                </InvitationCard>
              ))}
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>People you may know</SectionTitle>
              </SectionHeader>
              
              <ConnectionGrid>
                {connections.map(person => (
                  <ConnectionCard key={person.id}>
                    <Avatar src={person.avatar} alt={person.name} large />
                    <PersonName>{person.name}</PersonName>
                    <PersonTitle>{person.title}</PersonTitle>
                    <MutualConnections>{person.mutual} mutual connections</MutualConnections>
                    {sentRequests.includes(person.id) ? (
                      <ConnectButton style={{ background: '#f3f2ef', color: '#666', borderColor: '#ccc', cursor: 'not-allowed' }} disabled>
                        Pending
                      </ConnectButton>
                    ) : (
                      <ConnectButton onClick={() => setSentRequests(reqs => [...reqs, person.id])}>
                        <UserPlus size={16} />
                        Connect
                      </ConnectButton>
                    )}
                  </ConnectionCard>
                ))}
              </ConnectionGrid>
            </Section>
          </LeftColumn>

          <RightColumn>
            <Section>
              <SectionTitle>Manage my network</SectionTitle>
              <NetworkOption>
                <Users size={20} />
                <OptionText>
                  <OptionTitle>Connections</OptionTitle>
                  <OptionCount>1,247</OptionCount>
                </OptionText>
              </NetworkOption>
              <NetworkOption>
                <Users size={20} />
                <OptionText>
                  <OptionTitle>Following & followers</OptionTitle>
                  <OptionCount>89</OptionCount>
                </OptionText>
              </NetworkOption>
              <NetworkOption>
                <Users size={20} />
                <OptionText>
                  <OptionTitle>Groups</OptionTitle>
                  <OptionCount>12</OptionCount>
                </OptionText>
              </NetworkOption>
              <NetworkOption>
                <Users size={20} />
                <OptionText>
                  <OptionTitle>Events</OptionTitle>
                  <OptionCount>5</OptionCount>
                </OptionText>
              </NetworkOption>
            </Section>
          </RightColumn>
        </NetworkGrid>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #f3f2ef;
`;

const MainContent = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding-top: 72px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 400;
  color: #000;
  margin: 0 0 4px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const NetworkGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div``;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const SectionCount = styled.span`
  font-size: 14px;
  color: #666;
`;

const InvitationCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: ${props => props.large ? '120px' : '56px'};
  height: ${props => props.large ? '120px' : '56px'};
  border-radius: 50%;
  object-fit: cover;
`;

const PersonInfo = styled.div``;

const PersonName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
`;

const PersonTitle = styled.div`
  font-size: 14px;
  color: #666;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const AcceptButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #004182;
  }
`;

const IgnoreButton = styled.button`
  background: white;
  color: #666;
  border: 1px solid #666;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #f3f2ef;
  }
`;

const ConnectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ConnectionCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: box-shadow 0.15s ease;
  
  &:hover {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.2);
  }
`;

const MutualConnections = styled.div`
  font-size: 12px;
  color: #666;
  margin: 8px 0;
`;

const ConnectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  color: #0a66c2;
  border: 1px solid #0a66c2;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 12px;
  
  &:hover {
    background: #f0f7ff;
  }
`;

const NetworkOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f3f2ef;
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const OptionText = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-size: 14px;
  color: #000;
  font-weight: 600;
`;

const OptionCount = styled.div`
  font-size: 12px;
  color: #666;
`;

export default Network;
