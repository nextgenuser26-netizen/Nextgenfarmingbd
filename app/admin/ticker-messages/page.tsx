'use client';

import { useEffect, useState } from 'react';
import { Save, Globe, Plus, X } from 'lucide-react';

export default function TickerMessages() {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      console.log('Fetched settings for ticker messages:', data.settings);
      console.log('Ticker messages from API:', data.settings?.tickerMessages);
      setMessages(data.settings?.tickerMessages || [
        'প্রথম অর্ডারে ১০% ডিসকাউন্ট! কোড: NEXTGEN10',
        'সারা বাংলাদেশে ফ্রি ডেলিভারি (মিনিমাম ১৫০০/- অর্ডার)',
        '৫০% পর্যন্ত ছাড় সীমিত সময়ের জন্য',
        '১০০% খাঁটি পণ্যের নিশ্চয়তা বা টাকা ফেরত',
        'refer your friends and get rewards'
      ]);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving ticker messages:', messages);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickerMessages: messages }),
      });

      if (res.ok) {
        console.log('Ticker messages saved successfully');
        alert('Ticker messages saved successfully!');
      } else {
        console.error('Failed to save ticker messages, response:', await res.text());
        alert('Failed to save ticker messages');
      }
    } catch (error) {
      console.error('Error saving ticker messages:', error);
      alert('Failed to save ticker messages');
    } finally {
      setSaving(false);
    }
  };

  const addMessage = () => {
    setMessages([...messages, '']);
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const updateMessage = (index: number, value: string) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Ticker Messages
        </h1>
        <p className="text-gray-300 mt-1">
          Manage the scrolling offer messages displayed at the top of the home page.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => updateMessage(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter ticker message..."
              />
              <button
                onClick={() => removeMessage(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove message"
              >
                <X size={20} />
              </button>
            </div>
          ))}

          <button
            onClick={addMessage}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
          >
            <Plus size={20} />
            Add Message
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {messages.length} message(s) added
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#6BCB8F' }}
            onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#5AB87E')}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6BCB8F'}
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Messages'}
          </button>
        </div>
      </div>
    </div>
  );
}
