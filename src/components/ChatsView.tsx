import React, { useState } from 'react';
import { Conversation, UserStatusStory, User, UserSettings } from '../types';
import {
  Search,
  Plus,
  Users,
  ShieldCheck,
  Lock,
  Pin,
  Check,
  CheckCheck,
  Sparkles,
  MessageSquarePlus,
  Clock,
  UserPlus,
} from 'lucide-react';
import { sound } from '../lib/sound';

interface ChatsViewProps {
  conversations: Conversation[];
  statusStories: UserStatusStory[];
  currentUser: User;
  settings: UserSettings;
  onSelectConversation: (conv: Conversation) => void;
  onOpenNewGroup: () => void;
  onOpenSyncContacts: () => void;
  onOpenReelsView: () => void;
}

export const ChatsView: React.FC<ChatsViewProps> = ({
  conversations,
  statusStories,
  currentUser,
  settings,
  onSelectConversation,
  onOpenNewGroup,
  onOpenSyncContacts,
  onOpenReelsView,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups'>('all');

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage?.text.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'unread') return c.unreadCount > 0;
    if (filterType === 'groups') return c.type === 'group';
    return true;
  });

  return (
    <div
      className="flex flex-col h-[calc(100vh-68px)] md:h-[calc(100vh-80px)] w-full max-w-4xl mx-auto bg-[#07070b] border-x border-[#1c1b24] shadow-2xl relative select-none"
      id="sovo-chats-dashboard"
    >
      {/* Top Search & Actions Bar */}
      <div className="p-4 bg-[#0c0c12]/95 backdrop-blur-md border-b border-[#22212d] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-display font-extrabold text-gold-glossy tracking-tight">
              Encrypted Chats
            </h2>
            <div className="px-2 py-0.5 rounded-full bg-[#1c190f] border border-[#d4af37]/30 text-[10px] text-[#ffd700] font-mono">
              E2EE 4096
            </div>
          </div>

          {/* Quick Actions (New Group / Sync Address Book) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onOpenNewGroup();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14141d] hover:bg-[#1f1e29] border border-[#272635] text-xs font-semibold text-[#ffd700] hover:border-[#d4af37]/50 transition cursor-pointer"
              title="Create 500-Member Group Chat"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Group (500)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onOpenSyncContacts();
              }}
              className="p-2 rounded-xl gold-glossy-button text-black flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              title="Sync Contacts / Find @Username"
            >
              <UserPlus className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations, @usernames, or encrypted files..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#12121a] border border-[#272634] focus:border-[#ffd700] rounded-2xl text-xs text-white placeholder-gray-500 outline-none transition"
          />
        </div>

        {/* Status Story Stories Quick-Access Reel Row */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> TikTok-Style Statuses (24h & 3-Day)
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                onOpenReelsView();
              }}
              className="text-[11px] text-[#ffd700] hover:underline font-medium"
            >
              Open Fullscreen Reels
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {statusStories.map((story) => {
              const has3Day = story.items.some((i) => i.durationDays === 3);

              return (
                <button
                  key={story.userId}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    onOpenReelsView();
                  }}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                >
                  <div
                    className={`relative w-12 h-12 rounded-full p-0.5 transition-all group-hover:scale-105 ${
                      has3Day
                        ? 'border-2 border-[#ffd700] ring-1 ring-[#d4af37]/40'
                        : 'border-2 border-zinc-600'
                    }`}
                  >
                    <img
                      src={story.avatarUrl}
                      alt={story.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {has3Day && (
                      <span className="absolute -bottom-1 -right-1 px-1 bg-[#d4af37] text-[8px] font-extrabold text-black rounded-full shadow">
                        3D
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 max-w-[56px] truncate text-gray-300 group-hover:text-[#ffd700]">
                    {story.isCurrentUser ? 'Your Status' : story.displayName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1">
          {[
            { key: 'all', label: 'All Chats' },
            { key: 'unread', label: 'Unread' },
            { key: 'groups', label: 'Groups (Up to 500)' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                sound.playTap();
                setFilterType(tab.key as 'all' | 'unread' | 'groups');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                filterType === tab.key
                  ? 'bg-[#221c0e] border-[#d4af37] text-[#ffd700]'
                  : 'bg-[#121218] border-[#22212d] text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#181720] scrollbar-thin">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <Lock className="w-10 h-10 text-[#d4af37]/40 mb-3" />
            <p className="text-sm font-semibold text-gray-300">No conversations found</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Sync your device contacts or search any member worldwide by their @username to start
              private messaging.
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isMe = conv.lastMessage?.senderId === currentUser.id;

            return (
              <div
                key={conv.id}
                onClick={() => {
                  sound.playTap();
                  onSelectConversation(conv);
                }}
                className="p-3.5 hover:bg-[#111118] transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#d4af37]/40 group-hover:border-[#ffd700] transition"
                    />
                    {conv.type === 'direct' && conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
                    )}
                    {conv.type === 'group' && (
                      <div className="absolute -bottom-1 -right-1 px-1 bg-[#1a170e] border border-[#d4af37]/60 text-[9px] font-bold text-[#ffd700] rounded-full">
                        {conv.memberCount}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {conv.isPinned && <Pin className="w-3 h-3 text-[#d4af37] rotate-45" />}
                      <span className="text-sm font-display font-bold text-white group-hover:text-[#ffd700] truncate transition">
                        {conv.name}
                      </span>
                      {conv.username && (
                        <span className="text-[11px] font-mono text-gray-400">
                          @{conv.username}
                        </span>
                      )}
                    </div>

                    {/* Last message preview */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 truncate">
                      {isMe && conv.lastMessage && (
                        <span className="flex items-center">
                          {conv.lastMessage.status === 'read' ? (
                            <CheckCheck
                              className={`w-3.5 h-3.5 ${
                                settings.readReceipts ? 'text-[#ffd700]' : 'text-gray-400'
                              }`}
                            />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </span>
                      )}
                      <span className="truncate">
                        {conv.lastMessage?.text ||
                          (conv.lastMessage?.fileName
                            ? `📎 ${conv.lastMessage.fileName} (${conv.lastMessage.fileSize})`
                            : 'Encrypted channel established')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Timestamp & Unread Badge */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {conv.lastMessage
                      ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'New'}
                  </span>

                  {conv.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full gold-gradient-bg text-black font-extrabold text-[10px] shadow-sm">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Material 3 Android Floating Action Button (FAB) */}
      <div className="absolute right-5 bottom-6 z-20 flex flex-col items-end gap-2.5">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onOpenNewGroup();
          }}
          className="w-10 h-10 rounded-2xl bg-[#1a1710] border border-[#d4af37]/40 text-[#ffd700] hover:bg-[#282215] flex items-center justify-center shadow-lg transition transform active:scale-95 cursor-pointer"
          title="Create 500-Member Group Chat"
        >
          <Users className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onOpenSyncContacts();
          }}
          className="w-14 h-14 rounded-2xl gold-gradient-bg text-black flex items-center justify-center shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition transform active:scale-90 hover:scale-105 cursor-pointer"
          title="New Encrypted Chat / Discover @Username"
        >
          <MessageSquarePlus className="w-6 h-6 stroke-[2.2] text-black" />
        </button>
      </div>
    </div>
  );
};
