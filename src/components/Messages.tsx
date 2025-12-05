import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Send, Paperclip, Search, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

export function Messages() {
  const { currentUser } = useAuth();
  const [selectedThread, setSelectedThread] = useState<number>(0);
  const [messageInput, setMessageInput] = useState('');

  const threads = [
    {
      id: 1,
      title: 'Help with Two-Pointer Approach',
      student: 'Emma Wilson',
      faculty: 'Dr. Sarah Johnson',
      status: 'answered' as const,
      lastMessage: 'Thanks! That clarifies it perfectly.',
      lastMessageTime: '2 hours ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'Emma Wilson', content: 'I\'m having trouble understanding when to use the two-pointer approach vs hash map for array problems. Can you help?', timestamp: '10:30 AM', isMe: currentUser?.role === 'student' },
        { id: 2, sender: 'Dr. Sarah Johnson', content: 'Great question! Two-pointer is typically more efficient when you can sort the array or when you\'re looking for pairs. Hash maps are better when you need O(1) lookups and order doesn\'t matter.', timestamp: '10:45 AM', isMe: currentUser?.role === 'faculty' },
        { id: 3, sender: 'Emma Wilson', content: 'Thanks! That clarifies it perfectly.', timestamp: '11:00 AM', isMe: currentUser?.role === 'student' },
      ],
    },
    {
      id: 2,
      title: 'Clarification on Merge Sort Time Complexity',
      student: 'Liam Martinez',
      faculty: null,
      status: 'open' as const,
      lastMessage: 'Can someone explain why merge sort is O(n log n)?',
      lastMessageTime: '30 min ago',
      unread: 1,
      messages: [
        { id: 1, sender: 'Liam Martinez', content: 'Can someone explain why merge sort is O(n log n)? I understand the merging is O(n), but where does the log n come from?', timestamp: '11:45 AM', isMe: currentUser?.role === 'student' && currentUser?.name === 'Liam Martinez' },
      ],
    },
    {
      id: 3,
      title: 'Binary Search Tree Implementation Question',
      student: 'Olivia Taylor',
      faculty: 'Prof. Michael Roberts',
      status: 'answered' as const,
      lastMessage: 'Perfect, I\'ll try that approach.',
      lastMessageTime: '1 day ago',
      unread: 0,
      messages: [
        { id: 1, sender: 'Olivia Taylor', content: 'Should I use recursion or iteration for BST insertion?', timestamp: 'Yesterday 3:20 PM', isMe: currentUser?.role === 'student' && currentUser?.name === 'Olivia Taylor' },
        { id: 2, sender: 'Prof. Michael Roberts', content: 'Both approaches work! Recursion is cleaner and easier to understand, but iteration uses less memory. For learning, start with recursion.', timestamp: 'Yesterday 3:35 PM', isMe: currentUser?.role === 'faculty' },
        { id: 3, sender: 'Olivia Taylor', content: 'Perfect, I\'ll try that approach.', timestamp: 'Yesterday 3:40 PM', isMe: currentUser?.role === 'student' && currentUser?.name === 'Olivia Taylor' },
      ],
    },
  ];

  const currentThread = threads[selectedThread];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}><Clock className="w-3 h-3 mr-1" />Open</Badge>;
      case 'answered':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />Answered</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle send message
      setMessageInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Q&A Messages</h2>
          <p className="text-neutral-600 mt-1">
            Ask questions and get help from instructors
          </p>
        </div>
        <Button style={{ backgroundColor: 'var(--color-primary)' }}>
          <Plus className="w-4 h-4 mr-2" />
          New Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Thread List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-80px)]">
            <CardContent className="space-y-2 pb-4">
              {threads.map((thread, index) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(index)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedThread === index
                      ? 'bg-purple-50 border-purple-200'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm line-clamp-1">{thread.title}</h4>
                    {thread.unread > 0 && (
                      <Badge className="ml-2" style={{ backgroundColor: 'var(--color-danger)' }}>
                        {thread.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                    {thread.lastMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{thread.lastMessageTime}</span>
                    {getStatusBadge(thread.status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Conversation */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{currentThread.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '10px' }}>
                        {currentThread.student.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>Student: {currentThread.student}</span>
                  </div>
                  {currentThread.faculty && (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback style={{ backgroundColor: 'var(--color-secondary)', color: 'white', fontSize: '10px' }}>
                          {currentThread.faculty.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>Instructor: {currentThread.faculty}</span>
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(currentThread.status)}
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {currentThread.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isMe ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback style={{ 
                      backgroundColor: message.isMe ? 'var(--color-primary)' : 'var(--color-neutral-300)',
                      color: message.isMe ? 'white' : 'var(--color-neutral-700)'
                    }}>
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${message.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm">{message.sender}</span>
                      <span className="text-xs text-neutral-500">{message.timestamp}</span>
                    </div>
                    <div
                      className={`p-3 rounded-lg max-w-[80%] ${
                        message.isMe
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <CardContent className="border-t pt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} style={{ backgroundColor: 'var(--color-primary)' }}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
