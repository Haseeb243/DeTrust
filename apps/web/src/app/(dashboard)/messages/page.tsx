'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MessageCircle, Send, Search, ArrowLeft } from 'lucide-react';

import { Badge, Button, Card, CardContent, Input } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkConversationRead,
  useMessageUnreadCount,
} from '@/hooks/queries/use-messages';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? '';

  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversationsData, isLoading: loadingConversations } = useConversations();
  const { data: messagesData, isLoading: loadingMessages } = useMessages(selectedPartner);
  const { data: unreadData } = useMessageUnreadCount();
  const sendMutation = useSendMessage();
  const markReadMutation = useMarkConversationRead();

  const conversations = conversationsData?.items ?? [];
  const messages = messagesData?.items ?? [];

  // Filter conversations by search
  const filteredConversations = searchTerm
    ? conversations.filter((c: any) =>
        c.participant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (selectedPartner) {
      markReadMutation.mutate(selectedPartner);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPartner]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedPartner) return;

    const res = await sendMutation.mutateAsync({
      receiverId: selectedPartner,
      content: messageText.trim(),
    });

    if (res.success) {
      setMessageText('');
    } else {
      toast.error(res.error?.message ?? 'Failed to send message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConversation = conversations.find(
    (c: any) => c.participantId === selectedPartner
  ) as any;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-dt-text">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          Messages
          {unreadData && unreadData.count > 0 && (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {unreadData.count} unread
            </Badge>
          )}
        </h1>
        <p className="mt-1 text-dt-text-muted">
          Chat with clients and freelancers. All messages are archived for dispute evidence.
        </p>
      </div>

      {/* Chat Layout */}
      <Card className="border-dt-border bg-dt-surface">
        <div className="flex h-[calc(100vh-280px)] min-h-[500px]">
          {/* Conversation List */}
          <div
            className={cn(
              'w-full border-r border-dt-border sm:w-80 sm:flex-shrink-0',
              selectedPartner && 'hidden sm:block'
            )}
          >
            {/* Search */}
            <div className="border-b border-dt-border p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dt-text-muted" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search conversations..."
                  className="border-dt-border pl-9"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto">
              {loadingConversations ? (
                <div className="flex items-center justify-center p-8">
                  <Spinner size="md" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-sm text-dt-text-muted">
                  <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conv: any) => (
                  <button
                    key={conv.participantId}
                    onClick={() => setSelectedPartner(conv.participantId)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-dt-border p-3 text-left transition hover:bg-dt-surface-alt',
                      selectedPartner === conv.participantId && 'bg-dt-surface-alt'
                    )}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {conv.participant?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-dt-text">
                          {conv.participant?.name ?? 'Unknown User'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="ml-2 bg-blue-500 text-xs text-white">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="mt-0.5 truncate text-xs text-dt-text-muted">
                          {conv.lastMessage.senderId === userId ? 'You: ' : ''}
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className={cn('flex flex-1 flex-col', !selectedPartner && 'hidden sm:flex')}>
            {!selectedPartner ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-dt-text-muted">
                <MessageCircle className="mb-4 h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="mt-1 text-sm">Choose a conversation from the left to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-dt-border p-3">
                  <button
                    onClick={() => setSelectedPartner('')}
                    className="sm:hidden"
                  >
                    <ArrowLeft className="h-5 w-5 text-dt-text-muted" />
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {selectedConversation?.participant?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dt-text">
                      {selectedConversation?.participant?.name ?? 'Unknown User'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center p-8">
                      <Spinner size="md" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-dt-text-muted">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg: any) => {
                        const isOwn = msg.senderId === userId;
                        return (
                          <div
                            key={msg.id}
                            className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                          >
                            <div
                              className={cn(
                                'max-w-[75%] rounded-2xl px-4 py-2',
                                isOwn
                                  ? 'rounded-br-md bg-blue-600 text-white'
                                  : 'rounded-bl-md bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100'
                              )}
                            >
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <p
                                className={cn(
                                  'mt-1 text-[10px]',
                                  isOwn ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                                )}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-dt-border p-3">
                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 border-dt-border"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMutation.isPending}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {sendMutation.isPending ? (
                        <Spinner size="sm" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
