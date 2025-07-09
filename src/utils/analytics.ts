// Internal analytics logging - NOT displayed on site
interface AnalyticsEvent {
  type: 'user_login' | 'user_logout' | 'session_start' | 'session_end' | 'nation_created' | 'nation_deleted';
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  metadata?: any;
}

class AnalyticsLogger {
  private events: AnalyticsEvent[] = [];
  private sessionStartTime: Date | null = null;

  logEvent(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date()
    };
    
    this.events.push(fullEvent);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    
    // Log to console for internal monitoring
    console.log('[ANALYTICS]', fullEvent);
  }

  startSession(userId?: string) {
    this.sessionStartTime = new Date();
    this.logEvent({
      type: 'session_start',
      userId,
      metadata: { userAgent: navigator.userAgent }
    });
  }

  endSession(userId?: string) {
    if (this.sessionStartTime) {
      const sessionDuration = Date.now() - this.sessionStartTime.getTime();
      this.logEvent({
        type: 'session_end',
        userId,
        metadata: { 
          duration: sessionDuration,
          durationMinutes: Math.round(sessionDuration / 60000)
        }
      });
    }
    this.sessionStartTime = null;
  }

  logUserLogin(userId: string) {
    this.logEvent({
      type: 'user_login',
      userId
    });
  }

  logUserLogout(userId: string) {
    this.logEvent({
      type: 'user_logout',
      userId
    });
  }

  logNationCreated(userId?: string, nationData?: any) {
    this.logEvent({
      type: 'nation_created',
      userId,
      metadata: nationData
    });
  }

  logNationDeleted(userId?: string, nationId?: string) {
    this.logEvent({
      type: 'nation_deleted',
      userId,
      metadata: { nationId }
    });
  }

  // Internal reporting methods - NOT exposed to UI
  getLoginCount(): number {
    return this.events.filter(e => e.type === 'user_login').length;
  }

  getAverageSessionTime(): number {
    const sessionEnds = this.events.filter(e => e.type === 'session_end');
    if (sessionEnds.length === 0) return 0;
    
    const totalTime = sessionEnds.reduce((sum, event) => {
      return sum + (event.metadata?.duration || 0);
    }, 0);
    
    return Math.round(totalTime / sessionEnds.length / 60000); // Return in minutes
  }

  getTotalNationsCreated(): number {
    return this.events.filter(e => e.type === 'nation_created').length;
  }

  getUniqueUsers(): Set<string> {
    const users = new Set<string>();
    this.events.forEach(event => {
      if (event.userId) {
        users.add(event.userId);
      }
    });
    return users;
  }

  // Generate internal report
  generateReport() {
    const uniqueUsers = this.getUniqueUsers();
    const report = {
      totalLogins: this.getLoginCount(),
      uniqueUsers: uniqueUsers.size,
      averageSessionTimeMinutes: this.getAverageSessionTime(),
      totalNationsCreated: this.getTotalNationsCreated(),
      averageNationsPerUser: uniqueUsers.size > 0 ? (this.getTotalNationsCreated() / uniqueUsers.size).toFixed(2) : 0,
      reportGeneratedAt: new Date().toISOString()
    };
    
    console.log('[ANALYTICS REPORT]', report);
    return report;
  }
}

export const analytics = new AnalyticsLogger();

// Auto-generate report every 30 minutes for internal monitoring
setInterval(() => {
  analytics.generateReport();
}, 30 * 60 * 1000);