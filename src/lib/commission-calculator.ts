import { doc, updateDoc, getDoc, collection, addDoc, getDocs, query, where, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/config';

export interface Commission {
  id?: string;
  userId: string;
  fromUserId: string;
  fromUserName: string;
  purchaseAmount: number;
  currency: string;
  level: number;
  commissionAmount: number;
  commissionRate: number;
  timestamp: any;
  status: 'pending' | 'completed';
}

export class CommissionCalculator {
  private static readonly LEVEL_1_5_RATE = 0.002; // 0.2%
  private static readonly LEVEL_6_15_RATE = 0.001; // 0.1%
  private static readonly MAX_LEVELS = 15;

  /**
   * Calculate and distribute commissions when someone makes a purchase (IN USDT)
   */
  static async calculateAndDistributeCommissions(
    purchaserId: string,
    purchaseAmount: number,
    currency: string = 'USDT'
  ): Promise<void> {
    try {
      const purchaserDoc = await getDoc(doc(db, 'users', purchaserId));
      if (!purchaserDoc.exists()) {
        throw new Error('Purchaser not found');
      }

      const purchaserData = purchaserDoc.data();
      let currentUplineId = purchaserData.referredByUserId;
      let level = 1;

      const batch = writeBatch(db);
      const commissions: Commission[] = [];

      // Distribute commissions up to 15 levels
      while (currentUplineId && level <= this.MAX_LEVELS) {
        const uplineDoc = await getDoc(doc(db, 'users', currentUplineId));
        if (!uplineDoc.exists()) {
          break;
        }

        const uplineData = uplineDoc.data();
        
        // Calculate commission based on level - 0.2% for levels 1-5, 0.1% for levels 6-15
        const commissionRate = level <= 5 ? this.LEVEL_1_5_RATE : this.LEVEL_6_15_RATE;
        const commissionAmount = purchaseAmount * commissionRate;

        if (commissionAmount > 0) {
          // Create commission record
          const commissionData: Commission = {
            userId: currentUplineId,
            fromUserId: purchaserId,
            fromUserName: purchaserData.name || 'Unknown User',
            purchaseAmount,
            currency,
            level,
            commissionAmount,
            commissionRate: commissionRate * 100, // Store as percentage
            timestamp: new Date(),
            status: 'completed'
          };

          commissions.push(commissionData);

          // Update upline user's balance - COMMISSIONS IN USDT
          const userRef = doc(db, 'users', currentUplineId);
          batch.update(userRef, {
            totalCommission: increment(commissionAmount), // USDT commissions
            usdBalance: increment(commissionAmount), // USDT balance
            lastCommissionDate: new Date()
          });

          // Add commission record to commissions collection
          const commissionRef = doc(collection(db, 'commissions'));
          batch.set(commissionRef, commissionData);
        }

        // Move to next upline
        currentUplineId = uplineData.referredByUserId;
        level++;
      }

      await batch.commit();
      console.log('✅ COMMISSIONS DISTRIBUTED:', commissions);

    } catch (error) {
      console.error('Error calculating commissions:', error);
      throw error;
    }
  }

  /**
   * Calculate registration commissions for paid accounts ($100 registration fee)
   */
  static async calculateRegistrationCommissions(
    newUserId: string,
    newUserName: string,
    referrerUserId: string | null
  ): Promise<void> {
    if (!referrerUserId) return;

    console.log('💰 CALCULATING REGISTRATION COMMISSIONS FOR PAID ACCOUNT...');
    
    // $100 registration treated as purchase for commission calculation
    const registrationAmount = 100; // USDT
    
    await this.calculateAndDistributeCommissions(
      newUserId,
      registrationAmount,
      'USDT'
    );
  }

  /**
   * Get user's commission summary from actual transactions (IN USDT)
   */
  static async getUserCommissionSummary(userId: string) {
    try {
      // Get all commissions where this user earned something
      const commissionsQuery = query(
        collection(db, 'commissions'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(commissionsQuery);
      const commissions: Commission[] = [];
      let totalCommission = 0;

      snapshot.forEach(doc => {
        const data = doc.data() as Commission;
        commissions.push({
          ...data,
          id: doc.id
        });
        totalCommission += data.commissionAmount;
      });

      // Group by level to show earnings per level
      const levelSummary = commissions.reduce((acc, commission) => {
        const level = commission.level;
        if (!acc[level]) {
          acc[level] = { 
            total: 0, 
            count: 0, 
            members: new Set<string>(),
            rate: commission.commissionRate
          };
        }
        acc[level].total += commission.commissionAmount;
        acc[level].count += 1;
        acc[level].members.add(commission.fromUserId);
        return acc;
      }, {} as Record<number, { total: number; count: number; members: Set<string>; rate: number }>);

      // Convert Set to count
      Object.keys(levelSummary).forEach(level => {
        const levelNum = parseInt(level);
        (levelSummary as any)[levelNum].membersCount = levelSummary[levelNum].members.size;
      });

      return {
        totalCommission,
        levelSummary,
        recentCommissions: commissions
          .sort((a, b) => new Date(b.timestamp?.toDate()).getTime() - new Date(a.timestamp?.toDate()).getTime())
          .slice(0, 10),
        allCommissions: commissions
      };
    } catch (error) {
      console.error('Error getting commission summary:', error);
      return { 
        totalCommission: 0, 
        levelSummary: {}, 
        recentCommissions: [],
        allCommissions: []
      };
    }
  }

  /**
   * Get team structure with member counts at each level
   */
  static async getUserTeamStructure(userId: string) {
    try {
      const teamByLevel: Record<number, any[]> = {};
      
      // Level 1 - Direct referrals
      const level1Query = query(
        collection(db, 'users'),
        where('referredByUserId', '==', userId)
      );
      const level1Snapshot = await getDocs(level1Query);
      teamByLevel[1] = level1Snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        level: 1
      }));

      // Get deeper levels
      for (let level = 2; level <= 15; level++) {
        teamByLevel[level] = [];
        const previousLevel = level - 1;
        
        for (const member of teamByLevel[previousLevel] || []) {
          const memberTeamQuery = query(
            collection(db, 'users'),
            where('referredByUserId', '==', member.id)
          );
          const memberTeamSnapshot = await getDocs(memberTeamQuery);
          teamByLevel[level].push(...memberTeamSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            level: level
          })));
        }
      }

      // Calculate stats
      const allTeamMembers = Object.values(teamByLevel).flat();
      const stats = {
        totalMembers: allTeamMembers.length,
        paidMembers: allTeamMembers.filter(m => m.accountType !== 'free').length,
        freeMembers: allTeamMembers.filter(m => m.accountType === 'free').length,
        levelCounts: Object.keys(teamByLevel).reduce((acc, level) => {
          acc[parseInt(level)] = teamByLevel[parseInt(level)].length;
          return acc;
        }, {} as Record<number, number>)
      };

      return {
        teamByLevel,
        allTeamMembers,
        stats
      };
    } catch (error) {
      console.error('Error getting team structure:', error);
      return { 
        teamByLevel: {}, 
        allTeamMembers: [], 
        stats: { 
          totalMembers: 0, 
          paidMembers: 0, 
          freeMembers: 0,
          levelCounts: {}
        } 
      };
    }
  }

  /**
   * Simulate a purchase to test commission distribution
   */
  static async simulatePurchase(userId: string, amount: number = 100) {
    try {
      await this.calculateAndDistributeCommissions(userId, amount, 'USDT');
      return { success: true, message: `Purchase simulation completed for ${amount} USDT` };
    } catch (error) {
      console.error('Simulation error:', error);
      return { success: false, message: 'Simulation failed' };
    }
  }
}