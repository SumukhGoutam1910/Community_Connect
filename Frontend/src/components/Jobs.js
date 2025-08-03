import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Search, MapPin, Clock, Building, Bookmark, Filter } from 'lucide-react';

const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Internship'];
const EXPERIENCE_OPTIONS = ['Entry level', 'Mid level', 'Senior level'];
const COMPANY_SIZE_OPTIONS = ['Startup (1-50 employees)', 'Small (51-200 employees)', 'Large (1000+ employees)'];

const Jobs = () => {
  const [jobType, setJobType] = useState([]);
  const [experience, setExperience] = useState([]);
  const [companySize, setCompanySize] = useState([]);

  const jobs = [
    {
      id: 1,
      title: "Electronics Engineer",
      company: "Intel Corporation",
      location: "Bangalore, India",
      time: "Full-time",
      posted: "2 days ago",
      description: "We are looking for an experienced Electronics Engineer to join our semiconductor design team...",
      skills: ["VLSI Design", "Verilog", "PCB Design"],
      applicants: 23
    },
    {
      id: 2,
      title: "Communication Systems Engineer",
      company: "Qualcomm",
      location: "Hyderabad, India",
      time: "Full-time",
      posted: "1 week ago",
      description: "Join our 5G research team to develop next-generation communication protocols...",
      skills: ["RF Engineering", "Signal Processing", "MATLAB"],
      applicants: 45
    },
    {
      id: 3,
      title: "Embedded Systems Developer",
      company: "Texas Instruments",
      location: "Chennai, India",
      time: "Full-time",
      posted: "3 days ago",
      description: "Design and develop embedded systems for automotive applications...",
      skills: ["C/C++", "Microcontrollers", "Real-time Systems"],
      applicants: 31
    },
    {
      id: 4,
      title: "Research Intern - Machine Learning",
      company: "Microsoft Research",
      location: "Remote",
      time: "Internship",
      posted: "5 days ago",
      description: "Work on cutting-edge ML applications for signal processing and communications...",
      skills: ["Python", "TensorFlow", "Deep Learning"],
      applicants: 87
    }
  ];

  const savedJobs = [
    "Senior VLSI Engineer - NVIDIA",
    "RF Design Engineer - Ericsson",
    "Systems Engineer - SpaceX"
  ];

  // Search and location state
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    // Job Type
    if (jobType.length && !jobType.includes(job.time)) return false;
    // Experience Level (simulate with job.title or description for demo)
    if (experience.length) {
      const expMatch = experience.some(exp =>
        (job.title && job.title.toLowerCase().includes(exp.split(' ')[0].toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(exp.split(' ')[0].toLowerCase()))
      );
      if (!expMatch) return false;
    }
    // Company Size (simulate with company name for demo)
    if (companySize.length) {
      // No real company size in data, so always true for now
      return true;
    }
    // Search term
    if (searchTerm && !(
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    // Location term
    if (locationTerm && !job.location.toLowerCase().includes(locationTerm.toLowerCase())) return false;
    return true;
  });

  // Handlers
  const handleCheckbox = (value, arr, setArr) => {
    setArr(arr => arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  return (
    <Container>
      <Navbar />
      <MainContent>
        <Header>
          <Title>Jobs</Title>
          <SearchContainer>
            <SearchBox>
              <Search size={20} />
              <SearchInput
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            <LocationBox>
              <MapPin size={20} />
              <LocationInput
                placeholder="Location"
                value={locationTerm}
                onChange={e => setLocationTerm(e.target.value)}
              />
            </LocationBox>
            <SearchButton
              onClick={e => { e.preventDefault(); }}
              style={{ cursor: 'default', opacity: 0.7 }}
            >Search</SearchButton>
          </SearchContainer>
        </Header>

        <JobsGrid>
          <LeftColumn>
            <FiltersCard>
              <FilterHeader>
                <Filter size={20} />
                <FilterTitle>Filters</FilterTitle>
              </FilterHeader>
              
              <FilterSection>
                <FilterLabel>Job Type</FilterLabel>
                {JOB_TYPE_OPTIONS.map(opt => (
                  <FilterOption key={opt}>
                    <input
                      type="checkbox"
                      checked={jobType.includes(opt)}
                      onChange={() => handleCheckbox(opt, jobType, setJobType)}
                    />
                    {opt}
                  </FilterOption>
                ))}
              </FilterSection>

              <FilterSection>
                <FilterLabel>Experience Level</FilterLabel>
                {EXPERIENCE_OPTIONS.map(opt => (
                  <FilterOption key={opt}>
                    <input
                      type="checkbox"
                      checked={experience.includes(opt)}
                      onChange={() => handleCheckbox(opt, experience, setExperience)}
                    />
                    {opt}
                  </FilterOption>
                ))}
              </FilterSection>

              <FilterSection>
                <FilterLabel>Company Size</FilterLabel>
                {COMPANY_SIZE_OPTIONS.map(opt => (
                  <FilterOption key={opt}>
                    <input
                      type="checkbox"
                      checked={companySize.includes(opt)}
                      onChange={() => handleCheckbox(opt, companySize, setCompanySize)}
                    />
                    {opt}
                  </FilterOption>
                ))}
              </FilterSection>
            </FiltersCard>

            <SavedJobsCard>
              <SavedHeader>
                <Bookmark size={20} />
                <SavedTitle>Saved Jobs</SavedTitle>
              </SavedHeader>
              {savedJobs.map((job, index) => (
                <SavedJob key={index}>{job}</SavedJob>
              ))}
            </SavedJobsCard>
          </LeftColumn>

          <CenterColumn>
            <JobsHeader>
              <JobsCount>{filteredJobs.length} jobs found</JobsCount>
              <SortBy>
                <label>Sort by:</label>
                <select>
                  <option>Most recent</option>
                  <option>Most relevant</option>
                  <option>Company name</option>
                </select>
              </SortBy>
            </JobsHeader>

            {filteredJobs.map(job => (
              <JobCard key={job.id}>
                <JobHeader>
                  <CompanyLogo src="/ECE_logo/Logo.jpg" alt={job.company} />
                  <JobInfo>
                    <JobTitle>{job.title}</JobTitle>
                    <Company>{job.company}</Company>
                    <JobMeta>
                      <MetaItem>
                        <MapPin size={14} />
                        {job.location}
                      </MetaItem>
                      <MetaItem>
                        <Clock size={14} />
                        {job.time}
                      </MetaItem>
                      <MetaItem>
                        <Building size={14} />
                        {job.posted}
                      </MetaItem>
                    </JobMeta>
                  </JobInfo>
                  <SaveButton>
                    <Bookmark size={20} />
                  </SaveButton>
                </JobHeader>
                
                <JobDescription>{job.description}</JobDescription>
                
                <SkillsContainer>
                  {job.skills.map((skill, index) => (
                    <Skill key={index}>{skill}</Skill>
                  ))}
                </SkillsContainer>
                
                <JobFooter>
                  <Applicants>{job.applicants} applicants</Applicants>
                  <ApplyButton>Apply</ApplyButton>
                </JobFooter>
              </JobCard>
            ))}
          </CenterColumn>

          <RightColumn>
            <JobAlertCard>
              <AlertTitle>Job Alert</AlertTitle>
              <AlertDescription>
                Get notified when new ECE jobs are posted
              </AlertDescription>
              <CreateAlertButton>Create Alert</CreateAlertButton>
            </JobAlertCard>

            <RecommendedCard>
              <RecommendedTitle>Recommended for you</RecommendedTitle>
              <RecommendedJob>
                <RecommendedTitle small>VLSI Design Engineer</RecommendedTitle>
                <RecommendedCompany>AMD</RecommendedCompany>
              </RecommendedJob>
              <RecommendedJob>
                <RecommendedTitle small>Signal Processing Engineer</RecommendedTitle>
                <RecommendedCompany>Broadcom</RecommendedCompany>
              </RecommendedJob>
            </RecommendedCard>
          </RightColumn>
        </JobsGrid>
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
  margin: 0 0 16px 0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  flex: 1;
  max-width: 400px;
  gap: 8px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
`;

const LocationBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  width: 200px;
  gap: 8px;
`;

const LocationInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
`;

const SearchButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #004182;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  gap: 24px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 16px;
`;

const FilterLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
`;

const SavedJobsCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const SavedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const SavedTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const SavedJob = styled.div`
  font-size: 14px;
  color: #0a66c2;
  padding: 4px 0;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const JobsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const JobsCount = styled.div`
  font-size: 16px;
  color: #000;
  font-weight: 600;
`;

const SortBy = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  
  select {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 14px;
  }
`;

const JobCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  transition: box-shadow 0.15s ease;
  
  &:hover {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.2);
  }
`;

const JobHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const CompanyLogo = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #0a66c2;
  margin: 0 0 4px 0;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Company = styled.div`
  font-size: 16px;
  color: #000;
  margin-bottom: 8px;
`;

const JobMeta = styled.div`
  display: flex;
  gap: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
`;

const SaveButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #0a66c2;
  }
`;

const JobDescription = styled.p`
  font-size: 14px;
  color: #000;
  line-height: 1.5;
  margin: 12px 0;
`;

const SkillsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
`;

const Skill = styled.span`
  background: #f0f7ff;
  color: #0a66c2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const JobFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
`;

const Applicants = styled.div`
  font-size: 14px;
  color: #666;
`;

const ApplyButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #004182;
  }
`;

const JobAlertCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const AlertTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
`;

const AlertDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
`;

const CreateAlertButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background: #004182;
  }
`;

const RecommendedCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const RecommendedTitle = styled.h3`
  font-size: ${props => props.small ? '14px' : '16px'};
  font-weight: 600;
  color: #000;
  margin: ${props => props.small ? '0 0 2px 0' : '0 0 12px 0'};
`;

const RecommendedJob = styled.div`
  padding: 8px 0;
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

const RecommendedCompany = styled.div`
  font-size: 12px;
  color: #666;
`;

export default Jobs;
