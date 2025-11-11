// lib/voting-access.ts
export class VotingAccess {
    /**
     * Check if user can vote in a specific poll based on geographical hierarchy
     */
    static canVoteInPoll(user: any, poll: any): boolean {
      // Normalize both user and poll data for comparison
      const userLocation = this.normalizeLocation(user);
      const pollLocation = this.normalizeLocation(poll);
  
      // Check hierarchy from highest to lowest level
      if (userLocation.country !== pollLocation.country) return false;
      if (pollLocation.level === 'international') return true;
  
      if (userLocation.state !== pollLocation.state) return false;
      if (pollLocation.level === 'national') return true;
  
      if (userLocation.district !== pollLocation.district) return false;
      if (pollLocation.level === 'state') return true;
  
      if (userLocation.taluka !== pollLocation.taluka) return false;
      if (pollLocation.level === 'district') return true;
  
      if (userLocation.village !== pollLocation.village) return false;
      if (pollLocation.level === 'taluka') return true;
  
      if (userLocation.street !== pollLocation.street) return false;
      if (pollLocation.level === 'village') return true;
  
      // Street level - all must match exactly
      return pollLocation.level === 'street';
    }
  
    /**
     * Normalize location data for consistent comparison
     */
    static normalizeLocation(data: any) {
      return {
        country: (data.country || '').toString().toLowerCase().trim(),
        state: (data.state || '').toString().toLowerCase().trim(),
        district: (data.district || '').toString().toLowerCase().trim(),
        taluka: (data.taluka || '').toString().toLowerCase().trim(),
        village: (data.village || '').toString().toLowerCase().trim(),
        street: (data.street || '').toString().toLowerCase().trim(),
        level: data.level || 'street'
      };
    }
  
    /**
     * Get user's voting eligibility for all poll levels
     */
    static getUserVotingEligibility(user: any) {
      const location = this.normalizeLocation(user);
      
      return {
        international: true, // All users can vote internationally
        national: !!location.country,
        state: !!location.country && !!location.state,
        district: !!location.country && !!location.state && !!location.district,
        taluka: !!location.country && !!location.state && !!location.district && !!location.taluka,
        village: !!location.country && !!location.state && !!location.district && !!location.taluka && !!location.village,
        street: !!location.country && !!location.state && !!location.district && !!location.taluka && !!location.village && !!location.street,
      };
    }
  
    /**
     * Get available voting levels for user
     */
    static getAvailableVotingLevels(user: any): string[] {
      const eligibility = this.getUserVotingEligibility(user);
      return Object.entries(eligibility)
        .filter(([_, canVote]) => canVote)
        .map(([level]) => level);
    }
  }