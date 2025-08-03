import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { MapPin, Building, Calendar, Edit, Plus, Award, Book } from 'lucide-react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';

// --- Modal Styles ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 32px 28px 24px 28px;
  min-width: 340px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
`;

const Profile = () => {
  // Edit state for avatar and cover
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingCover, setEditingCover] = useState(false);
  // State for profile info
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Remove sample data:
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  // --- User Posts/Events from Feed ---
  const [editingPost, setEditingPost] = useState(null); // post object or null
  const [editPostDraft, setEditPostDraft] = useState({ content: '', eventInfo: null });
  React.useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/api/user', { withCredentials: true })
      .then(res => {
        const user = res.data.user;
        setProfile({
          _id: user._id, // Add user ID for post filtering
          name: user.name || '',
          title: user.title || '',
          location: user.location || '',
          about: user.bio || '',
          connections: user.connections || 0,
          avatar: user.avatarUrl || '/ECE_logo/Logo.jpg',
          coverColor: '#0a66c2',
        });
        setExperiences(user.profile?.experience || []);
        setEducation(user.profile?.education || []);
        setSkills(user.profile?.skills || []);
        setLoading(false);
      })
      .catch(() => {
        setProfile(null);
        setExperiences([]);
        setEducation([]);
        setSkills([]);
        setLoading(false);
      });
  }, []);

  // Fetch user's posts when user data is available
  React.useEffect(() => {
    if (profile) {
      axios.get('http://localhost:3001/api/posts', { withCredentials: true })
        .then(res => {
          // Filter posts by current user
          const currentUserPosts = res.data.filter(post => post.author?._id === profile._id);
          setUserPosts(currentUserPosts);
        })
        .catch(() => setUserPosts([]));
    }
  }, [profile]);

  // Helper to update post/event in localStorage and state
  const updatePostEverywhere = (updatedPost) => {
    const allPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    const newAllPosts = allPosts.map(p => p.id === updatedPost.id ? { ...p, ...updatedPost } : p);
    localStorage.setItem('user_posts', JSON.stringify(newAllPosts));
    setUserPosts(newAllPosts.filter(p => p.author === 'You').sort((a, b) => b.id - a.id));
  };
  const [editingExpId, setEditingExpId] = useState(null);
  const [expDraft, setExpDraft] = useState({ id: null, title: '', company: '', start: '', end: '', description: '' });
  const [addingExp, setAddingExp] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [eduDraft, setEduDraft] = useState({ degree: '', school: '', duration: '', grade: '' });
  const [addingEdu, setAddingEdu] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Education handlers
  const startEditEdu = idx => {
    setEduDraft(education[idx]);
    setEditingEdu(idx);
  };
  const saveEdu = async () => {
    const updatedEducation = education.map((e, i) => i === editingEdu ? eduDraft : e);
    setEducation(updatedEducation);
    setEditingEdu(null);
    try {
      // Send without id field to backend  
      const backendExperiences = experiences.map(e => ({
        company: e.company,
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description
      }));
      await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          experience: backendExperiences,
          education: updatedEducation.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to save education:', e);
    }
  };
  const cancelEdu = () => setEditingEdu(null);
  const startAddEdu = () => {
    setEduDraft({ degree: '', school: '', duration: '', grade: '' });
    setAddingEdu(true);
  };
  const addEdu = async () => {
    const updatedEducation = [...education, eduDraft];
    setEducation(updatedEducation);
    setAddingEdu(false);
    try {
      // Send without id field to backend
      const backendExperiences = experiences.map(e => ({
        company: e.company,
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description
      }));
      await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          experience: backendExperiences,
          education: updatedEducation.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to add education:', e);
    }
  };
  const cancelAddEdu = () => setAddingEdu(false);
  const deleteEdu = async (idx) => {
    const updatedEducation = education.filter((_, i) => i !== idx);
    setEducation(updatedEducation);
    try {
      // Send without id field to backend
      const backendExperiences = experiences.map(e => ({
        company: e.company,
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description
      }));
      await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          experience: backendExperiences,
          education: updatedEducation.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to delete education:', e);
    }
  };

  // Skills handlers
  const addSkill = async () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");
      setAddingSkill(false);
      try {
        console.log('Adding skill. Current skills:', skills);
        console.log('Updated skills:', updatedSkills);
        
        const response = await axios.post('http://localhost:3001/api/user/update', {
          profile: {
            skills: updatedSkills
          }
        }, { withCredentials: true });
        console.log('Skill add response:', response.data);
      } catch (e) {
        console.error('Failed to add skill:', e);
      }
    }
  };
  const deleteSkill = async (idx) => {
    const updatedSkills = skills.filter((_, i) => i !== idx);
    setSkills(updatedSkills);
    try {
      console.log('Deleting skill at index:', idx);
      console.log('Updated skills:', updatedSkills);
      
      const response = await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          skills: updatedSkills
        }
      }, { withCredentials: true });
      console.log('Skill delete response:', response.data);
    } catch (e) {
      console.error('Failed to delete skill:', e);
    }
  };

  // Profile info handlers
  const startEditProfile = () => {
    setProfileDraft(profile);
    setEditingProfile(true);
  };
  const saveProfile = async () => {
    setProfile(profileDraft);
    setEditingProfile(false);
    try {
      // Send without id field to backend
      const backendExperiences = experiences.map(e => ({
        company: e.company,
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description
      }));
      await axios.post('http://localhost:3001/api/user/update', {
        ...profileDraft,
        about: profileDraft.about, // ensure about is sent as top-level
        profile: {
          experience: backendExperiences,
          education: education.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };
  const cancelProfile = () => setEditingProfile(false);

  // About edit modal state
  const [showAboutEdit, setShowAboutEdit] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(profile?.about);
  const openAboutEdit = () => {
    setAboutDraft(profile?.about);
    setShowAboutEdit(true);
  };
  const saveAboutEdit = async () => {
    setProfile(p => ({ ...p, about: aboutDraft }));
    setShowAboutEdit(false);
    try {
      console.log('Saving about section:', aboutDraft);
      const response = await axios.post('http://localhost:3001/api/user/update', {
        about: aboutDraft
      }, { withCredentials: true });
      console.log('About save response:', response.data);
    } catch (e) {
      console.error('Failed to save about section:', e);
    }
  };
  const cancelAboutEdit = () => setShowAboutEdit(false);

  // Open to Work state
  const [openToWork, setOpenToWork] = useState(false);
  const toggleOpenToWork = () => setOpenToWork(v => !v);

  // Experience handlers
  const startEditExp = id => {
    const exp = experiences.find(e => e.id === id);
    setExpDraft(exp);
    setEditingExpId(id);
  };
  const saveExp = async () => {
    const updatedExperiences = experiences.map(e => e.id === editingExpId ? { 
      company: expDraft.company,
      title: expDraft.title,
      start: expDraft.start,
      end: expDraft.end,
      description: expDraft.description
    } : {
      company: e.company,
      title: e.title,
      start: e.start,
      end: e.end,
      description: e.description
    });
    setExperiences(experiences.map(e => e.id === editingExpId ? { ...expDraft, id: editingExpId } : e));
    setEditingExpId(null);
    try {
      await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          experience: updatedExperiences,
          education: education.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to save experience:', e);
    }
  };
  const cancelExp = () => setEditingExpId(null);
  const startAddExp = () => {
    setExpDraft({ id: null, title: '', company: '', start: '', end: '', description: '' });
    setAddingExp(true);
  };
  const addExp = async () => {
    const newExperience = { ...expDraft, id: Date.now() };
    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    setAddingExp(false);
    try {
      // Send without id field to backend
      const backendExperiences = updatedExperiences.map(e => ({
        company: e.company,
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description
      }));
      await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          experience: backendExperiences,
          education: education.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to add experience:', e);
    }
  };
  const cancelAddExp = () => setAddingExp(false);
  const deleteExp = async (id) => {
    const updatedExperiences = experiences.filter(e => e.id !== id);
    setExperiences(updatedExperiences);
    try {
      // Send without id field to backend
      const backendExperiences = updatedExperiences.map(e => ({
        company: e.company,
        title: e.title,
        start: e.start,
        end: e.end,
        description: e.description
      }));
      await axios.post('http://localhost:3001/api/user/update', {
        profile: {
          experience: backendExperiences,
          education: education.map(e => ({ school: e.school, degree: e.degree, duration: e.duration, grade: e.grade })),
          skills: skills
        }
      }, { withCredentials: true });
    } catch (e) {
      console.error('Failed to delete experience:', e);
    }
  };

  // Helper to format month-year
  function formatMonthYear(ym) {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    const date = new Date(y, m - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }

  // Sort experiences by end date (or start if no end)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const aEnd = a.end || '9999-12';
    const bEnd = b.end || '9999-12';
    return bEnd.localeCompare(aEnd) || b.start.localeCompare(a.start);
  });

  if (loading) {
    return <div>Loading profile...</div>;
  }
  if (!profile) {
    return <div>User not found or not logged in.</div>;
  }

  return (
    <Container>
      <Navbar />
      <MainContent>
        <ProfileGrid>
          <LeftColumn>
            <ProfileCard>
              <CoverImage style={{ background: profile.coverColor }}>
                <EditCoverButton onClick={() => setEditingCover(true)}><Edit size={16} /></EditCoverButton>
                {editingCover && (
                  <CoverEditRow>
                    <input
                      type="color"
                      value={profile.coverColor}
                      onChange={e => setProfile(p => ({ ...p, coverColor: e.target.value }))}
                      style={{ width: 40, height: 32, border: 'none', background: 'none', marginRight: 8 }}
                    />
                    <SecondaryButton onClick={() => setEditingCover(false)}>Done</SecondaryButton>
                  </CoverEditRow>
                )}
              </CoverImage>
              <ProfileHeader>
                <Avatar
                  src={profile.avatar}
                  alt="Profile"
                  style={{ cursor: 'pointer', opacity: editingAvatar ? 0.7 : 1, border: editingAvatar ? '4px solid #0a66c2' : '4px solid white' }}
                  onClick={() => setEditingAvatar(true)}
                />
                {editingProfile ? null : (
                  <EditButton onClick={startEditProfile}>
                    <Edit size={16} />
                  </EditButton>
                )}
                {editingAvatar && (
                  <AvatarEditRow>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            // Show loading state
                            setProfile(p => ({ ...p, avatar: 'loading...' }));
                            
                            // Create FormData and upload to Cloudinary via backend
                            const formData = new FormData();
                            formData.append('avatar', file);
                            
                            const response = await axios.post('http://localhost:3001/api/user/upload-avatar', formData, {
                              withCredentials: true,
                              headers: {
                                'Content-Type': 'multipart/form-data',
                              },
                            });
                            
                            // Update profile with Cloudinary URL
                            setProfile(p => ({ ...p, avatar: response.data.avatarUrl }));
                            console.log('Avatar uploaded successfully:', response.data.avatarUrl);
                          } catch (error) {
                            console.error('Avatar upload failed:', error);
                            // Reset to previous avatar on error
                            setProfile(p => ({ ...p, avatar: p.avatar }));
                            alert('Failed to upload avatar. Please try again.');
                          }
                        }
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <SecondaryButton onClick={() => setEditingAvatar(false)}>Done</SecondaryButton>
                  </AvatarEditRow>
                )}
              </ProfileHeader>
              <ProfileInfo>
                {editingProfile ? (
                  <EditForm>
                    <StyledInput value={profileDraft.name} onChange={e => setProfileDraft(d => ({ ...d, name: e.target.value }))} placeholder="Name" />
                    <StyledInput value={profileDraft.title} onChange={e => setProfileDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" />
                    <StyledInput value={profileDraft.location} onChange={e => setProfileDraft(d => ({ ...d, location: e.target.value }))} placeholder="Location" />
                    <ButtonRow>
                      <PrimaryButton onClick={saveProfile}>Save</PrimaryButton>
                      <SecondaryButton onClick={cancelProfile}>Cancel</SecondaryButton>
                    </ButtonRow>
                  </EditForm>
                ) : (
                  <>
                    <Name>{profile?.name}</Name>
                    <Title>{profile?.title}</Title>
                    <Location>
                      <MapPin size={16} />
                      {profile?.location}
                    </Location>
                    <ConnectionCount>{profile?.connections} connections</ConnectionCount>
                  </>
                )}
              </ProfileInfo>
              <ProfileActions>
                <OpenToWorkButton $active={openToWork} onClick={toggleOpenToWork}>
                  {openToWork ? 'Open to work (Active)' : 'Open to work'}
                </OpenToWorkButton>
              </ProfileActions>
            </ProfileCard>

            <AboutCard>
              <SectionHeader>
                <SectionTitle>About</SectionTitle>
                {showAboutEdit ? null : (
                  <EditButtonSmall onClick={() => setShowAboutEdit(true)}><Edit size={16} /></EditButtonSmall>
                )}
              </SectionHeader>
              {showAboutEdit ? (
                <div>
                  <AutoResizeTextarea
                    value={aboutDraft}
                    onChange={e => setAboutDraft(e.target.value)}
                    minRows={3}
                    maxRows={10}
                    placeholder="About you..."
                  />
                  <ButtonRow style={{ marginTop: 12 }}>
                    <PrimaryButton onClick={saveAboutEdit}>Save</PrimaryButton>
                    <SecondaryButton onClick={cancelAboutEdit}>Cancel</SecondaryButton>
                  </ButtonRow>
                </div>
              ) : (
                <AboutText>
                  {profile?.about}
                </AboutText>
              )}
            </AboutCard>

            <ExperienceCard>
              <SectionHeader>
                <SectionTitle>Experience</SectionTitle>
                <Plus size={16} onClick={startAddExp} style={{ cursor: 'pointer' }} />
              </SectionHeader>
              {sortedExperiences.map((exp) => (
                editingExpId === exp.id ? (
                  <ExperienceItem key={exp.id}>
                    <EditForm>
                      <StyledInput value={expDraft.title} onChange={e => setExpDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" />
                      <StyledInput value={expDraft.company} onChange={e => setExpDraft(d => ({ ...d, company: e.target.value }))} placeholder="Company" />
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 13, color: '#666' }}>Start</label>
                          <StyledInput type="month" value={expDraft.start} onChange={e => setExpDraft(d => ({ ...d, start: e.target.value }))} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 13, color: '#666' }}>End</label>
                          <StyledInput type="month" value={expDraft.end} onChange={e => setExpDraft(d => ({ ...d, end: e.target.value }))} />
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                            Leave blank if current
                          </div>
                        </div>
                      </div>
                      <StyledTextarea value={expDraft.description} onChange={e => setExpDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description" rows={2} />
                      <ButtonRow>
                        <PrimaryButton onClick={saveExp}>Save</PrimaryButton>
                        <SecondaryButton onClick={cancelExp}>Cancel</SecondaryButton>
                      </ButtonRow>
                    </EditForm>
                  </ExperienceItem>
                ) : (
                  <ExperienceItem key={exp.id}>
                    <CompanyLogo src="/ECE_logo/Logo.jpg" alt={exp.company} />
                    <ExperienceInfo>
                      <JobTitle>{exp.title}</JobTitle>
                      <CompanyName>{exp.company}</CompanyName>
                      <Duration>
                        {formatMonthYear(exp.start)} - {exp.end ? formatMonthYear(exp.end) : 'Present'}
                      </Duration>
                      <JobDescription>{exp.description}</JobDescription>
                      <PrimaryButton onClick={() => startEditExp(exp.id)} style={{ marginRight: 8 }}>Edit</PrimaryButton>
                      <DangerButton onClick={() => deleteExp(exp.id)}>Delete</DangerButton>
                    </ExperienceInfo>
                  </ExperienceItem>
                )
              ))}
              {addingExp && (
                <ExperienceItem>
                  <EditForm>
                    <StyledInput value={expDraft.title} onChange={e => setExpDraft(d => ({ ...d, title: e.target.value }))} placeholder="Title" />
                    <StyledInput value={expDraft.company} onChange={e => setExpDraft(d => ({ ...d, company: e.target.value }))} placeholder="Company" />
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 13, color: '#666' }}>Start</label>
                        <StyledInput type="month" value={expDraft.start} onChange={e => setExpDraft(d => ({ ...d, start: e.target.value }))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 13, color: '#666' }}>End</label>
                        <StyledInput type="month" value={expDraft.end} onChange={e => setExpDraft(d => ({ ...d, end: e.target.value }))} />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                          Leave blank if current
                        </div>
                      </div>
                    </div>
                    <StyledTextarea value={expDraft.description} onChange={e => setExpDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description" rows={2} />
                    <ButtonRow>
                      <PrimaryButton onClick={addExp}>Add</PrimaryButton>
                      <SecondaryButton onClick={cancelAddExp}>Cancel</SecondaryButton>
                    </ButtonRow>
                  </EditForm>
                </ExperienceItem>
              )}
            </ExperienceCard>

            <EducationCard>
              <SectionHeader>
                <SectionTitle>Education</SectionTitle>
                <Plus size={16} onClick={startAddEdu} style={{ cursor: 'pointer' }} />
              </SectionHeader>
              {education.map((edu, idx) => (
                editingEdu === idx ? (
                  <EducationItem key={idx}>
                    <EditForm>
                      <StyledInput value={eduDraft.degree} onChange={e => setEduDraft(d => ({ ...d, degree: e.target.value }))} placeholder="Degree" />
                      <StyledInput value={eduDraft.school} onChange={e => setEduDraft(d => ({ ...d, school: e.target.value }))} placeholder="School" />
                      <StyledInput value={eduDraft.duration} onChange={e => setEduDraft(d => ({ ...d, duration: e.target.value }))} placeholder="Duration" />
                      <StyledInput value={eduDraft.grade} onChange={e => setEduDraft(d => ({ ...d, grade: e.target.value }))} placeholder="Grade" />
                      <ButtonRow>
                        <PrimaryButton onClick={saveEdu}>Save</PrimaryButton>
                        <SecondaryButton onClick={cancelEdu}>Cancel</SecondaryButton>
                      </ButtonRow>
                    </EditForm>
                  </EducationItem>
                ) : (
                  <EducationItem key={idx}>
                    <SchoolLogo src="/ECE_logo/Logo.jpg" alt={edu.school} />
                    <EducationInfo>
                      <Degree>{edu.degree}</Degree>
                      <School>{edu.school}</School>
                      <Duration>{edu.duration}</Duration>
                      <Grade>{edu.grade}</Grade>
                      <PrimaryButton onClick={() => startEditEdu(idx)} style={{ marginRight: 8 }}>Edit</PrimaryButton>
                      <DangerButton onClick={() => deleteEdu(idx)}>Delete</DangerButton>
                    </EducationInfo>
                  </EducationItem>
                )
              ))}
              {addingEdu && (
                <EducationItem>
                  <EditForm>
                    <StyledInput value={eduDraft.degree} onChange={e => setEduDraft(d => ({ ...d, degree: e.target.value }))} placeholder="Degree" />
                    <StyledInput value={eduDraft.school} onChange={e => setEduDraft(d => ({ ...d, school: e.target.value }))} placeholder="School" />
                    <StyledInput value={eduDraft.duration} onChange={e => setEduDraft(d => ({ ...d, duration: e.target.value }))} placeholder="Duration" />
                    <StyledInput value={eduDraft.grade} onChange={e => setEduDraft(d => ({ ...d, grade: e.target.value }))} placeholder="Grade" />
                    <ButtonRow>
                      <PrimaryButton onClick={addEdu}>Add</PrimaryButton>
                      <SecondaryButton onClick={cancelAddEdu}>Cancel</SecondaryButton>
                    </ButtonRow>
                  </EditForm>
                </EducationItem>
              )}
            </EducationCard>

            <SkillsCard>
              <SectionHeader>
                <SectionTitle>Skills</SectionTitle>
                <Plus size={16} onClick={() => setAddingSkill(true)} style={{ cursor: 'pointer' }} />
              </SectionHeader>
              <SkillsGrid>
                {skills.map((skill, idx) => (
                  <SkillTag key={idx}>
                    {skill}
                    <DangerButton onClick={() => deleteSkill(idx)} style={{ marginLeft: 8, padding: '2px 10px', fontSize: 13 }}>Delete</DangerButton>
                  </SkillTag>
                ))}
              </SkillsGrid>
              {addingSkill && (
                <EditForm style={{ marginTop: 8 }}>
                  <StyledInput value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Skill" />
                  <ButtonRow>
                    <PrimaryButton onClick={addSkill}>Add</PrimaryButton>
                    <SecondaryButton onClick={() => setAddingSkill(false)}>Cancel</SecondaryButton>
                  </ButtonRow>
                </EditForm>
              )}
            </SkillsCard>
            {/* --- User's Posts & Events Section --- */}
            {userPosts.length > 0 && (
              <UserPostsCard>
                <SectionHeader>
                  <SectionTitle>My Posts & Events</SectionTitle>
                </SectionHeader>
                {userPosts.map(post => (
                  <UserPostItem key={post.id}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <img
                        src={post.avatar || profile.avatar || '/ECE_logo/Logo.jpg'}
                        alt="avatar"
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3f0ff', marginTop: 2 }}
                      />
                      <div style={{ flex: 1 }}>
                        <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>
                              {post.title === 'Event' ? '📅 ' : ''}{post.content}
                            </span>
                            <span style={{ fontSize: 12, color: '#888', fontWeight: 500, marginLeft: 6 }}>
                              {post.time || (post.eventInfo && post.eventInfo.date) || ''}
                            </span>
                          </div>
                          {post.eventInfo && (
                            <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 14 }}>
                              {post.eventInfo.date} {post.eventInfo.time} {post.eventInfo.ampm} {post.eventInfo.location && `| ${post.eventInfo.location}`}
                            </div>
                          )}
                          {post.images && post.images.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, margin: '6px 0' }}>
                              {post.images.map((img, idx) => (
                                <img key={idx} src={img} alt="img" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e0e0e0' }} />
                              ))}
                            </div>
                          )}
                          {post.videos && post.videos.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, margin: '6px 0' }}>
                              {post.videos.map((vid, idx) => (
                                <video key={idx} src={vid} style={{ width: 60, height: 60, borderRadius: 6, background: '#000' }} controls />
                              ))}
                            </div>
                          )}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1976d2', fontWeight: 600, fontSize: 15 }}>
                            <ThumbsUp size={18} style={{ marginRight: 2 }} />
                            {post.likes || 0}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1976d2', fontWeight: 600, fontSize: 15 }}>
                            <MessageSquare size={18} style={{ marginRight: 2 }} />
                            {post.comments || 0}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1976d2', fontWeight: 600, fontSize: 15, cursor: 'pointer' }} onClick={() => { /* share logic here */ }}>
                            <Share2 size={18} style={{ marginRight: 2 }} />
                            Share
                          </div>
                          <div style={{ marginLeft: 'auto' }}>
                            <button
                              style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                              onClick={() => {
                                setEditingPost(post);
                                setEditPostDraft({
                                  content: post.content,
                                  eventInfo: post.eventInfo ? { ...post.eventInfo } : null
                                });
                              }}
                            >
                              <Edit size={16} /> Edit
                            </button>
                          </div>
  {/* Edit Post/Event Modal */}
  {editingPost && (
    <ModalOverlay>
      <ModalContent>
        <h3>Edit {editingPost.title === 'Event' ? 'Event' : 'Post'}</h3>
        <div style={{ margin: '16px 0' }}>
          <label style={{ fontWeight: 600 }}>Content:</label>
          <ReactTextareaAutosize
            minRows={2}
            style={{ width: '100%', fontSize: 16, marginTop: 6, borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
            value={editPostDraft.content}
            onChange={e => setEditPostDraft(d => ({ ...d, content: e.target.value }))}
          />
        </div>
        {editingPost.eventInfo && (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontWeight: 600 }}>Event Title:</label>
              <input
                type="text"
                value={editPostDraft.eventInfo.title || ''}
                onChange={e => setEditPostDraft(d => ({ ...d, eventInfo: { ...d.eventInfo, title: e.target.value } }))}
                style={{ width: '100%', marginTop: 4, borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Date:</label>
                <input
                  type="date"
                  value={editPostDraft.eventInfo.date || ''}
                  onChange={e => setEditPostDraft(d => ({ ...d, eventInfo: { ...d.eventInfo, date: e.target.value } }))}
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Time:</label>
                <input
                  type="time"
                  value={editPostDraft.eventInfo.time || ''}
                  onChange={e => setEditPostDraft(d => ({ ...d, eventInfo: { ...d.eventInfo, time: e.target.value } }))}
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>AM/PM:</label>
                <select
                  value={editPostDraft.eventInfo.ampm || 'AM'}
                  onChange={e => setEditPostDraft(d => ({ ...d, eventInfo: { ...d.eventInfo, ampm: e.target.value } }))}
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Location:</label>
              <input
                type="text"
                value={editPostDraft.eventInfo.location || ''}
                onChange={e => setEditPostDraft(d => ({ ...d, eventInfo: { ...d.eventInfo, location: e.target.value } }))}
                style={{ width: '100%', borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Description:</label>
              <ReactTextareaAutosize
                minRows={2}
                style={{ width: '100%', fontSize: 15, borderRadius: 6, border: '1px solid #e0e0e0', padding: 8 }}
                value={editPostDraft.eventInfo.description || ''}
                onChange={e => setEditPostDraft(d => ({ ...d, eventInfo: { ...d.eventInfo, description: e.target.value } }))}
              />
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
          <button
            style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            onClick={() => {
              const updated = { ...editingPost, content: editPostDraft.content };
              if (editingPost.eventInfo) {
                updated.eventInfo = { ...editPostDraft.eventInfo };
              }
              updatePostEverywhere(updated);
              setEditingPost(null);
            }}
          >Save</button>
          <button
            style={{ background: '#f3f6f9', color: '#333', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            onClick={() => setEditingPost(null)}
          >Cancel</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  )}
                        </div>
                      </div>
                    </div>
                  </UserPostItem>
                ))}
              </UserPostsCard>
            )}
          </LeftColumn>
          <RightColumn>

            <ProfileStrengthCard>
              <StrengthHeader>Profile strength: All-star</StrengthHeader>
              <StrengthBar>
                <StrengthFill />
              </StrengthBar>
              <StrengthText>Great job! Your profile is complete and professional.</StrengthText>
            </ProfileStrengthCard>

            <ResourcesCard>
              <ResourceHeader>Resources</ResourceHeader>
              <ResourceItem>
                <Building size={20} />
                <ResourceText>
                  <ResourceTitle>Creator mode</ResourceTitle>
                  <ResourceDescription>Get discovered and showcase content</ResourceDescription>
                </ResourceText>
              </ResourceItem>
              <ResourceItem>
                <Award size={20} />
                <ResourceText>
                  <ResourceTitle>My network</ResourceTitle>
                  <ResourceDescription>Manage your connections and interests</ResourceDescription>
                </ResourceText>
              </ResourceItem>
            </ResourcesCard>

            <ActivityCard>
              <ActivityHeader>Activity</ActivityHeader>
              <ActivityItem>
                <ActivityText>Alex shared a post about VLSI design trends</ActivityText>
                <ActivityTime>2 hours ago</ActivityTime>
              </ActivityItem>
              <ActivityItem>
                <ActivityText>Alex liked a post by Dr. Sarah Johnson</ActivityText>
                <ActivityTime>1 day ago</ActivityTime>
              </ActivityItem>
            </ActivityCard>
          </RightColumn>
        </ProfileGrid>
      </MainContent>
    </Container>
  );
};



// --- UI IMPROVEMENTS ---

// --- User Posts/Events Styles ---
const UserPostsCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e3eaf5;
  margin-top: 32px;
  padding: 24px 28px 18px 28px;
`;

const UserPostItem = styled.div`
  border-bottom: 1px solid #e3eaf5;
  padding: 12px 0 10px 0;
  &:last-child {
    border-bottom: none;
  }
`;



const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f7fafd;
  border-radius: 8px;
  padding: 16px 18px;
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1px solid #0a66c2;
    background: #f0f7ff;
  }
`;


const StyledTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  resize: vertical;
  transition: border 0.2s;
  min-height: 38px;
  &:focus {
    border: 1px solid #0a66c2;
    background: #f0f7ff;
  }
`;

// Auto-resizing textarea for About section

const AutoResizeTextarea = styled(ReactTextareaAutosize)`
  padding: 10px 12px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 15px;
  outline: none;
  resize: none;
  width: 100%;
  box-sizing: border-box;
  transition: border 0.2s;
  &:focus {
    border: 1px solid #0a66c2;
    background: #f0f7ff;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  background: #0a66c2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #004182;
  }
`;

const SecondaryButton = styled.button`
  background: #eaf3fc;
  color: #0a66c2;
  border: 1px solid #b3d3f7;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #d2e7fa;
  }
`;

const DangerButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #c0392b;
  }
`;


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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const CoverImage = styled.div`
  height: 192px;
  position: relative;
  background: ${({ style }) => style && style.background ? style.background : 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)'};
`;

const EditCoverButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  z-index: 2;
  &:hover {
    background: #f3f2ef;
  }
`;

const CoverEditRow = styled.div`
  position: absolute;
  top: 56px;
  right: 16px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 8px 12px;
  z-index: 3;
`;

const EditAvatarButton = styled.button`
  position: absolute;
  left: 120px;
  top: 110px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  z-index: 2;
  &:hover {
    background: #f3f2ef;
  }
`;

const AvatarEditRow = styled.div`
  position: absolute;
  left: 200px;
  top: 110px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 8px 12px;
  z-index: 3;
`;

const ProfileHeader = styled.div`
  position: relative;
  padding: 0 24px;
`;

const Avatar = styled.img`
  width: 152px;
  height: 152px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  margin-top: -76px;
`;

const EditButton = styled.button`
  position: absolute;
  top: 16px;
  right: 24px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  
  &:hover {
    background: #f3f2ef;
  }
`;

const ProfileInfo = styled.div`
  padding: 16px 24px;
`;

const Name = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
`;

const Title = styled.div`
  font-size: 20px;
  color: #000;
  margin-bottom: 8px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const ConnectionCount = styled.div`
  color: #0a66c2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProfileActions = styled.div`
  padding: 16px 24px;
  display: flex;
  gap: 8px;
`;

const OpenToWorkButton = styled.button`
  background: ${({ $active }) => $active ? '#10c55f' : '#eaf3fc'};
  color: ${({ $active }) => $active ? 'white' : '#0a66c2'};
  border: ${({ $active }) => $active ? 'none' : '1px solid #b3d3f7'};
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ $active }) => $active ? '#0e8e3f' : '#d2e7fa'};
  }
`;

const EditButtonSmall = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  margin-left: 8px;
  &:hover {
    background: #f3f2ef;
  }
`;

const AboutCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const AboutText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #000;
  margin: 0;
`;

const ExperienceCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
`;

const ExperienceItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CompanyLogo = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
`;

const ExperienceInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
`;

const CompanyName = styled.div`
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
`;

const Duration = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const JobDescription = styled.div`
  font-size: 14px;
  color: #000;
  line-height: 1.4;
`;

const EducationCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
`;

const EducationItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SchoolLogo = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
`;

const EducationInfo = styled.div`
  flex: 1;
`;

const Degree = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
`;

const School = styled.div`
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
`;

const Grade = styled.div`
  font-size: 14px;
  color: #666;
`;

const SkillsCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 24px;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.div`
  background: #f0f7ff;
  color: #0a66c2;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
`;

const ProfileStrengthCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const StrengthHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
`;

const StrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-bottom: 8px;
`;

const StrengthFill = styled.div`
  width: 100%;
  height: 100%;
  background: #10c55f;
  border-radius: 2px;
`;

const StrengthText = styled.div`
  font-size: 12px;
  color: #666;
`;

const ResourcesCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const ResourceHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 12px;
`;

const ResourceItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0;
`;

const ResourceText = styled.div`
  flex: 1;
`;

const ResourceTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const ResourceDescription = styled.div`
  font-size: 12px;
  color: #666;
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const ActivityHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 12px;
`;

const ActivityItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityText = styled.div`
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  color: #666;
`;

export default Profile;
