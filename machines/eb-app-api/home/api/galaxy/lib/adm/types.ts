export interface Timers {
  housekeeping: ReturnType<typeof setTimeout> | undefined;
  cronjobRemindMeetingSession: ReturnType<typeof setTimeout> | undefined;
}
