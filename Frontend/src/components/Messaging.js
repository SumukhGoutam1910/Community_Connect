import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Search, Send, MoreVertical, Users } from 'lucide-react';
import Navbar from './Navbar';

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const MessagingContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
`;

const ConversationList = styled.div`
  width: 350px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ConversationHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
`;

const MessagingTitle = styled.h2`
  margin: 0 0 15px 0;
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const NewChatButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: #2563eb;
  }
`;

const ConversationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
  background: ${props => props.selected ? '#f1f5f9' : 'white'};
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ConversationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
`;

const DefaultAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid #e2e8f0;
`;

const ConversationDetails = styled.div`
  flex: 1;
`;

const ConversationName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const LastMessage = styled.div`
  color: #64748b;
  font-size: 14px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationTime = styled.div`
  color: #94a3b8;
  font-size: 12px;
  white-space: nowrap;
`;

const ChatArea = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChatHeaderName = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const ChatHeaderStatus = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  align-self: ${props => props.own ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.own ? '#3b82f6' : '#f1f5f9'};
  color: ${props => props.own ? 'white' : '#1e293b'};
  margin-bottom: 4px;
  word-wrap: break-word;
`;

const MessageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  justify-content: ${props => props.own ? 'flex-end' : 'flex-start'};
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SendButton = styled.button`
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
`;

const ConnectionsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.h3`
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
`;

const ConnectionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #f8fafc;
  }
`;

const ConnectionInfo = styled.div`
  flex: 1;
`;

const ConnectionName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
`;

const LoadingText = styled.div`
  color: #64748b;
  text-align: center;
  padding: 20px;
`;

function Messaging() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
    fetchConnections();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        withCredentials: true
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conversations', {
        withCredentials: true
      });
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/network/connections', {
        withCredentials: true
      });
      setConnections(response.data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/conversations/${conversationId}/messages`, {
        withCredentials: true
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/conversations/${selectedConversation._id}/messages`,
        { content: newMessage },
        { withCredentials: true }
      );

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Update conversation list
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startConversation = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/conversations/start/${userId}`,
        {},
        { withCredentials: true }
      );

      const newConversation = response.data;
      setConversations(prev => {
        const exists = prev.find(conv => conv._id === newConversation._id);
        if (exists) return prev;
        return [newConversation, ...prev];
      });

      setSelectedConversation(newConversation);
      setMessages([]);
      setShowConnectionsModal(false);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!currentUser || !conversation.participants) return null;
    return conversation.participants.find(p => p._id !== currentUser._id);
  };

  const getUserInitials = (user) => {
    if (!user) return '?';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.username?.charAt(0).toUpperCase() || '?';
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || 'Unknown User';
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    if (!otherUser) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      otherUser.username?.toLowerCase().includes(searchLower) ||
      otherUser.firstName?.toLowerCase().includes(searchLower) ||
      otherUser.lastName?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Container>
        <Navbar />
        <LoadingText>Loading conversations...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <MessagingContainer>
        <ConversationList>
          <ConversationHeader>
            <MessagingTitle>Messaging</MessagingTitle>
            <SearchContainer>
              <Search size={16} />
              <SearchInput
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            <NewChatButton onClick={() => setShowConnectionsModal(true)}>
              <Users size={16} />
              New Chat
            </NewChatButton>
          </ConversationHeader>
          
          {filteredConversations.length === 0 ? (
            <LoadingText>
              {conversations.length === 0 ? 'No conversations yet' : 'No matching conversations'}
            </LoadingText>
          ) : (
            filteredConversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              if (!otherUser) return null;
              
              return (
                <ConversationItem
                  key={conversation._id}
                  selected={selectedConversation?._id === conversation._id}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <ConversationInfo>
                    {otherUser.avatar ? (
                      <Avatar src={otherUser.avatar} alt={getUserDisplayName(otherUser)} />
                    ) : (
                      <DefaultAvatar>
                        {getUserInitials(otherUser)}
                      </DefaultAvatar>
                    )}
                    <ConversationDetails>
                      <ConversationName>{getUserDisplayName(otherUser)}</ConversationName>
                      <LastMessage>
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </LastMessage>
                    </ConversationDetails>
                    <ConversationTime>
                      {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ''}
                    </ConversationTime>
                  </ConversationInfo>
                </ConversationItem>
              );
            })
          )}
        </ConversationList>

        <ChatArea>
          {selectedConversation ? (
            <>
              <ChatHeader>
                <ChatHeaderInfo>
                  {(() => {
                    const otherUser = getOtherParticipant(selectedConversation);
                    return (
                      <>
                        {otherUser?.avatar ? (
                          <Avatar src={otherUser.avatar} alt={getUserDisplayName(otherUser)} />
                        ) : (
                          <DefaultAvatar>
                            {getUserInitials(otherUser)}
                          </DefaultAvatar>
                        )}
                        <div>
                          <ChatHeaderName>{getUserDisplayName(otherUser)}</ChatHeaderName>
                          <ChatHeaderStatus>Click to view profile</ChatHeaderStatus>
                        </div>
                      </>
                    );
                  })()}
                </ChatHeaderInfo>
                <MoreVertical size={20} style={{ cursor: 'pointer', color: '#64748b' }} />
              </ChatHeader>

              <MessagesContainer>
                {messages.map((message) => (
                  <MessageBubble key={message._id} own={message.sender._id === currentUser?._id}>
                    <MessageContent own={message.sender._id === currentUser?._id}>
                      {message.content}
                    </MessageContent>
                    <MessageInfo own={message.sender._id === currentUser?._id}>
                      <span>{formatTime(message.createdAt)}</span>
                    </MessageInfo>
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </MessagesContainer>

              <MessageInput>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <SendButton 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim()}
                >
                  <Send size={16} />
                </SendButton>
              </MessageInput>
            </>
          ) : (
            <EmptyState>
              <Users size={48} style={{ marginBottom: '16px' }} />
              <h3>Welcome to Messaging</h3>
              <p>Select a conversation or start a new chat with your connections</p>
            </EmptyState>
          )}
        </ChatArea>
      </MessagingContainer>

      {showConnectionsModal && (
        <ConnectionsModal onClick={() => setShowConnectionsModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowConnectionsModal(false)}>×</CloseButton>
            <ModalHeader>Start New Conversation</ModalHeader>
            {connections.length === 0 ? (
              <LoadingText>No connections found. Connect with users in the Network section first.</LoadingText>
            ) : (
              connections.map((connection) => (
                <ConnectionItem
                  key={connection._id}
                  onClick={() => startConversation(connection._id)}
                >
                  {connection.avatar ? (
                    <Avatar src={connection.avatar} alt={getUserDisplayName(connection)} />
                  ) : (
                    <DefaultAvatar>
                      {getUserInitials(connection)}
                    </DefaultAvatar>
                  )}
                  <ConnectionInfo>
                    <ConnectionName>{getUserDisplayName(connection)}</ConnectionName>
                  </ConnectionInfo>
                </ConnectionItem>
              ))
            )}
          </ModalContent>
        </ConnectionsModal>
      )}
    </Container>
  );
}

export default Messaging;
