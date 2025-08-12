export type SavedDate = {
  id: string;
  title: string;
  date: {
    year?: number;
    month: number;
    day: number;
  };
  description?: string;
  reminderDays: number; // Days before to remind
  reminderEnabled: boolean;
  createdAt: string;
  category: 'birthday' | 'anniversary' | 'meeting' | 'holiday' | 'other';
};

export type ReminderSettings = {
  email: boolean;
  sms: boolean;
  days: number;
}