// lib/fraudDetector.js
export class FraudDetector {
  
    static analyzeSubmission(submissionData) {
      const redFlags = [];
      let fraudScore = 0;
  
      if (this.hasSuspiciousViewPattern(submissionData)) {
        redFlags.push('Suspicious view growth pattern');
        fraudScore += 30;
      }
  
      if (this.hasWatchTimeDiscrepancy(submissionData)) {
        redFlags.push('High views with low watch time');
        fraudScore += 25;
      }
  
      if (this.hasFakeEngagement(submissionData)) {
        redFlags.push('Suspicious engagement patterns');
        fraudScore += 20;
      }
  
      if (this.hasSuspiciousChannelHistory(submissionData)) {
        redFlags.push('Suspicious channel history');
        fraudScore += 15;
      }
  
      return {
        fraudScore: Math.min(fraudScore, 100),
        redFlags,
        riskLevel: this.getRiskLevel(fraudScore),
        recommendedAction: this.getRecommendedAction(fraudScore)
      };
    }
  
    static hasSuspiciousViewPattern(data) {
      const views = data.viewCount || 0;
      const channelAge = data.channelAgeDays || 365;
      const viewsPerDay = views / channelAge;
      
      return viewsPerDay > 10000;
    }
  
    static hasWatchTimeDiscrepancy(data) {
      const views = data.viewCount || 0;
      const watchTime = data.watchTimePercentage || 0;
      
      if (views > 50000 && watchTime < 30) return true;
      if (views > 100000 && watchTime < 25) return true;
      return false;
    }
  
    static hasFakeEngagement(data) {
      const engagement = data.engagementRate || 0;
      return engagement > 20;
    }
  
    static hasSuspiciousChannelHistory(data) {
      const history = data.verificationHistory || [];
      const rejections = history.filter(h => h.status === 'rejected').length;
      return rejections >= 2;
    }
  
    static getRiskLevel(score) {
      if (score >= 70) return 'HIGH';
      if (score >= 40) return 'MEDIUM';
      if (score >= 20) return 'LOW';
      return 'MINIMAL';
    }
  
    static getRecommendedAction(score) {
      if (score >= 70) return 'AUTO_REJECT';
      if (score >= 40) return 'MANUAL_REVIEW';
      if (score >= 20) return 'COMMUNITY_VOTE';
      return 'AUTO_APPROVE';
    }
  }