// lib/firebase/influencerService.js
import { db } from '@/lib/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';

export const InfluencerService = {
  
  /**
   * Submit a new influencer reward application
   */
  async submitInfluencerApplication(applicationData) {
    try {
      const submissionsRef = collection(db, 'influencer_submissions');
      
      const submissionData = {
        // User Information
        influencerId: applicationData.userId,
        influencerName: applicationData.userName,
        influencerEmail: applicationData.userEmail,
        walletAddress: applicationData.walletAddress,
        
        // Video Information
        videoUrl: applicationData.videoUrl,
        videoTitle: applicationData.videoTitle || '',
        videoType: applicationData.videoType,
        videoDuration: parseInt(applicationData.videoDuration),
        platform: applicationData.platform,
        
        // Analytics Data (provided by influencer)
        viewCount: parseInt(applicationData.viewCount),
        watchTimePercentage: parseInt(applicationData.watchTimePercentage),
        engagementRate: parseFloat(applicationData.engagementRate) || 0,
        signUpsDriven: parseInt(applicationData.signUpsDriven) || 0,
        referralCode: applicationData.referralCode || 'PGCINFLUENCER',
        
        // Calculated Rewards
        baseReward: applicationData.calculation?.baseReward || 0,
        watchTimeBonus: applicationData.calculation?.watchTimeBonus || 0,
        engagementBonus: applicationData.calculation?.engagementBonus || 0,
        conversionBonus: applicationData.calculation?.conversionBonus || 0,
        qualityBonus: applicationData.calculation?.qualityBonus || 0,
        viralBonus: applicationData.calculation?.viralBonus || 0,
        totalReward: applicationData.calculation?.totalReward || 0,
        
        // Fraud Detection
        fraudScore: applicationData.fraudAnalysis?.fraudScore || 0,
        riskLevel: applicationData.fraudAnalysis?.riskLevel || 'MINIMAL',
        redFlags: applicationData.fraudAnalysis?.redFlags || [],
        recommendedAction: applicationData.fraudAnalysis?.recommendedAction || 'AUTO_APPROVE',
        
        // Status & Timeline
        status: 'pending',
        submittedAt: serverTimestamp(),
        verifiedAt: null,
        paidAt: null,
        
        // Admin Fields (to be filled later)
        qualityScore: 'B', // Default, can be updated by admin
        adminNotes: '',
        rejectionReason: '',
        
        // System Fields
        submissionId: this.generateSubmissionId(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const result = await addDoc(submissionsRef, submissionData);
      
      return {
        success: true,
        submissionId: result.id,
        message: 'Submission received successfully! We will review your application within 7 days.'
      };
      
    } catch (error) {
      console.error('Error submitting influencer application:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get influencer submissions for a specific user
   */
  async getUserSubmissions(userId) {
    try {
      const submissionsRef = collection(db, 'influencer_submissions');
      const q = query(
        submissionsRef, 
        where('influencerId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const submissions = [];
      
      snapshot.forEach(doc => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return submissions;
      
    } catch (error) {
      console.error('Error getting user submissions:', error);
      return [];
    }
  },

  /**
   * Get all submissions for admin review
   */
  async getAllSubmissions(limitCount = 50) {
    try {
      const submissionsRef = collection(db, 'influencer_submissions');
      const q = query(
        submissionsRef, 
        orderBy('submittedAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const submissions = [];
      
      snapshot.forEach(doc => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return submissions;
      
    } catch (error) {
      console.error('Error getting all submissions:', error);
      return [];
    }
  },

  /**
   * Update submission status (for admins)
   */
  async updateSubmissionStatus(submissionId, updates) {
    try {
      const submissionRef = doc(db, 'influencer_submissions', submissionId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(submissionRef, updateData);
      
      return {
        success: true,
        message: 'Submission updated successfully'
      };
      
    } catch (error) {
      console.error('Error updating submission:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Record payment for an approved submission
   */
  async recordPayment(paymentData) {
    try {
      const paymentsRef = collection(db, 'influencer_payments');
      
      const paymentRecord = {
        submissionId: paymentData.submissionId,
        influencerId: paymentData.influencerId,
        influencerName: paymentData.influencerName,
        walletAddress: paymentData.walletAddress,
        amount: paymentData.amount,
        currency: 'PGC',
        status: 'completed',
        paidAt: serverTimestamp(),
        transactionHash: paymentData.transactionHash || '',
        adminNotes: paymentData.adminNotes || '',
        createdAt: serverTimestamp()
      };

      const result = await addDoc(paymentsRef, paymentRecord);
      
      // Update the submission to mark as paid
      await this.updateSubmissionStatus(paymentData.submissionId, {
        status: 'paid',
        paidAt: serverTimestamp()
      });
      
      return {
        success: true,
        paymentId: result.id
      };
      
    } catch (error) {
      console.error('Error recording payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get payment history for a user
   */
  async getUserPayments(userId) {
    try {
      const paymentsRef = collection(db, 'influencer_payments');
      const q = query(
        paymentsRef, 
        where('influencerId', '==', userId),
        orderBy('paidAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const payments = [];
      
      snapshot.forEach(doc => {
        payments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return payments;
      
    } catch (error) {
      console.error('Error getting user payments:', error);
      return [];
    }
  },

  /**
   * Generate unique submission ID
   */
  generateSubmissionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SUB_${timestamp}_${random}`.toUpperCase();
  },

  /**
   * Get submission statistics for dashboard
   */
  async getSubmissionStats() {
    try {
      const submissions = await this.getAllSubmissions(1000); // Get all for stats
      
      const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length,
        paid: submissions.filter(s => s.status === 'paid').length,
        totalRewards: submissions.reduce((sum, s) => sum + (s.totalReward || 0), 0)
      };
      
      return stats;
      
    } catch (error) {
      console.error('Error getting submission stats:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        paid: 0,
        totalRewards: 0
      };
    }
  }
};