
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Ticket, TicketMessage } from '../types';
import { LifeBuoy, Plus, MessageSquare, Send, CheckCircle2, Clock, XCircle, User, Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Support: React.FC = () => {
  const { t, isRTL } = useApp();
  const { currentUser, isAdmin } = useAuth();
  
  // State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Create Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Tickets Real-time
  useEffect(() => {
    if (!currentUser) return;

    let q;
    if (isAdmin) {
      // Admin sees all tickets
      q = query(collection(db, 'tickets'), orderBy('lastUpdated', 'desc'));
    } else {
      // User sees own tickets
      q = query(
        collection(db, 'tickets'), 
        where('userId', '==', currentUser.uid),
        orderBy('lastUpdated', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, isAdmin]);

  // Fetch Messages for Selected Ticket
  useEffect(() => {
    if (!selectedTicket) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'tickets', selectedTicket.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TicketMessage[];
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [selectedTicket]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !subject || !description) return;
    
    setSubmitting(true);
    try {
      // 1. Create Ticket Doc
      const ticketRef = await addDoc(collection(db, 'tickets'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        subject,
        category,
        status: 'open',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });

      // 2. Add Initial Message
      await addDoc(collection(db, 'tickets', ticketRef.id, 'messages'), {
        text: description,
        senderId: currentUser.uid,
        isAdmin: false,
        createdAt: serverTimestamp()
      });

      // Reset
      setSubject('');
      setDescription('');
      setActiveTab('list');
      // Auto-select the new ticket (we need to construct a partial ticket object to select it immediately)
      // Or just let the list update catch it
    } catch (err) {
      console.error("Error creating ticket:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser || !selectedTicket || !newMessage.trim()) return;
    
    const text = newMessage;
    setNewMessage(''); // Optimistic clear

    try {
      // Add message
      await addDoc(collection(db, 'tickets', selectedTicket.id, 'messages'), {
        text,
        senderId: currentUser.uid,
        isAdmin: isAdmin,
        createdAt: serverTimestamp()
      });

      // Update ticket timestamp & status (if admin replies, maybe change to in_progress?)
      await updateDoc(doc(db, 'tickets', selectedTicket.id), {
        lastUpdated: serverTimestamp(),
        // Optional: Auto-change status logic could go here
      });

    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const updateStatus = async (status: 'open' | 'in_progress' | 'closed') => {
    if (!selectedTicket || !isAdmin) return;
    try {
      await updateDoc(doc(db, 'tickets', selectedTicket.id), { status });
      // Update local state to reflect immediately
      setSelectedTicket(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return <CheckCircle2 size={14} />;
      case 'in_progress': return <Clock size={14} />;
      case 'closed': return <XCircle size={14} />;
      default: return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        
      {/* Unified Banner - Cyan/Blue */}
      <div className="relative w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-2xl mb-6 shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col items-center md:items-start text-center md:text-start flex-1">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-white/20 text-white shadow-sm">
                     <LifeBuoy size={16} />
                     <span>Help Desk</span>
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight leading-tight">
                     {t('support_title')}
                 </h1>
                 <p className="text-cyan-100 text-lg font-medium max-w-xl opacity-90">
                     {t('support_desc')}
                 </p>
             </div>
             
             {/* Decorative Icon */}
             <div className="hidden md:flex w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl items-center justify-center text-white border border-white/20 shadow-inner">
                 <LifeBuoy size={40} />
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* LEFT: Ticket List */}
          <div className={`lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${selectedTicket && 'hidden lg:flex'}`}>
              
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h2 className="font-bold text-slate-700 dark:text-white">
                      {isAdmin ? t('support_all_tickets') : t('support_my_tickets')}
                  </h2>
                  <button 
                      onClick={() => { setActiveTab('create'); setSelectedTicket(null); }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors"
                      title={t('support_new_ticket')}
                  >
                      <Plus size={20} />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {tickets.length === 0 && !loading && (
                      <div className="text-center p-8 text-slate-400">
                          <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">{t('support_no_tickets')}</p>
                      </div>
                  )}

                  {tickets.map(ticket => (
                      <button
                          key={ticket.id}
                          onClick={() => { setSelectedTicket(ticket); setActiveTab('list'); }}
                          className={`w-full text-start p-4 rounded-2xl border transition-all ${
                              selectedTicket?.id === ticket.id 
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500' 
                              : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                                  {getStatusIcon(ticket.status)}
                                  {t(`support_status_${ticket.status}` as any)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                  {ticket.lastUpdated?.toDate().toLocaleDateString()}
                              </span>
                          </div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">{ticket.subject}</h3>
                          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                              <span>{t(`support_cat_${ticket.category === 'technical' ? 'tech' : ticket.category}` as any)}</span>
                              {isAdmin && <span>{ticket.userEmail.split('@')[0]}</span>}
                          </div>
                      </button>
                  ))}
              </div>
          </div>

          {/* RIGHT: Main Content */}
          <div className={`lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${!selectedTicket && activeTab === 'list' && 'hidden lg:flex'}`}>
              
              {/* CREATE FORM */}
              {activeTab === 'create' ? (
                  <div className="flex-1 p-8 overflow-y-auto">
                      <div className="max-w-2xl mx-auto space-y-6">
                          <div className="text-center mb-8">
                              <h2 className="text-2xl font-bold dark:text-white mb-2">{t('support_new_ticket')}</h2>
                              <p className="text-slate-500">{t('app_desc')}</p>
                          </div>

                          <form onSubmit={handleCreateTicket} className="space-y-6">
                              <div>
                                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">{t('support_subject')}</label>
                                  <input 
                                      type="text" 
                                      value={subject}
                                      onChange={(e) => setSubject(e.target.value)}
                                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                      required
                                  />
                              </div>
                              <div>
                                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">{t('support_category')}</label>
                                  <select 
                                      value={category}
                                      onChange={(e) => setCategory(e.target.value)}
                                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                      <option value="technical">{t('support_cat_tech')}</option>
                                      <option value="billing">{t('support_cat_billing')}</option>
                                      <option value="feature">{t('support_cat_feature')}</option>
                                      <option value="other">{t('support_cat_other')}</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">{t('support_message')}</label>
                                  <textarea 
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                                      className="w-full h-40 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                      required
                                  />
                              </div>
                              <div className="flex gap-4">
                                  <button 
                                      type="button" 
                                      onClick={() => setActiveTab('list')}
                                      className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  >
                                      Cancel
                                  </button>
                                  <button 
                                      type="submit"
                                      disabled={submitting}
                                      className="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg disabled:opacity-50"
                                  >
                                      {submitting ? 'Submitting...' : t('support_btn_submit')}
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              ) : selectedTicket ? (
                  /* CHAT INTERFACE */
                  <div className="flex flex-col h-full">
                      {/* Ticket Header */}
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                              <button onClick={() => setSelectedTicket(null)} className="lg:hidden p-2 -ml-2 text-slate-500">
                                  {isRTL ? <ChevronRight /> : <ChevronLeft />}
                              </button>
                              <div>
                                  <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{selectedTicket.subject}</h3>
                                  <p className="text-xs text-slate-500">#{selectedTicket.id.substr(0,8)}</p>
                              </div>
                          </div>
                          
                          {isAdmin ? (
                              <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                  <button onClick={() => updateStatus('open')} className={`px-3 py-1 text-xs rounded font-bold ${selectedTicket.status === 'open' ? 'bg-green-100 text-green-700' : 'text-slate-500'}`}>Open</button>
                                  <button onClick={() => updateStatus('closed')} className={`px-3 py-1 text-xs rounded font-bold ${selectedTicket.status === 'closed' ? 'bg-slate-200 text-slate-700' : 'text-slate-500'}`}>Close</button>
                              </div>
                          ) : (
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                  {t(`support_status_${selectedTicket.status}` as any)}
                              </span>
                          )}
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-black/20">
                          {messages.map((msg) => {
                              const isMe = msg.senderId === currentUser?.uid;
                              // Admin messages are distinct
                              const isSupport = msg.isAdmin; 
                              
                              return (
                                  <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSupport ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                          {isSupport ? <Shield size={14} /> : <User size={14} />}
                                      </div>
                                      <div className={`max-w-[80%] space-y-1`}>
                                          <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                              isMe 
                                              ? 'bg-blue-600 text-white rounded-tr-none' 
                                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                                          }`}>
                                              {msg.text}
                                          </div>
                                          <p className={`text-[10px] text-slate-400 ${isMe ? 'text-end' : ''}`}>
                                              {msg.createdAt?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                          </p>
                                      </div>
                                  </div>
                              )
                          })}
                          <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area */}
                      {selectedTicket.status !== 'closed' ? (
                          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                              <div className="relative">
                                  <input 
                                      type="text" 
                                      value={newMessage}
                                      onChange={(e) => setNewMessage(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                      placeholder={t('support_chat_placeholder')}
                                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button 
                                      onClick={handleSendMessage}
                                      disabled={!newMessage.trim()}
                                      className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                      <Send size={18} />
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
                              <p className="text-sm text-slate-500 font-medium">This ticket is closed. Reply to reopen.</p>
                          </div>
                      )}
                  </div>
              ) : (
                  /* EMPTY STATE (Desktop) */
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                          <LifeBuoy size={48} className="opacity-50" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Select a Ticket</h3>
                      <p className="max-w-xs">Choose a ticket from the list to view details or create a new one.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Support;
