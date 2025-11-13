// lib/firebase/language-service.ts
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { LanguageCode } from '@/lib/i18n/config';

const LANGUAGE_PREFERENCES_COLLECTION = 'languagePreferences';

export class LanguageService {
  // Save user's language preference
  static async saveUserLanguagePreference(userId: string, language: LanguageCode) {
    try {
      await setDoc(doc(db, LANGUAGE_PREFERENCES_COLLECTION, userId), {
        language,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error saving language preference:', error);
      return false;
    }
  }

  // Get user's language preference
  static async getUserLanguagePreference(userId: string): Promise<LanguageCode | null> {
    try {
      const docRef = doc(db, LANGUAGE_PREFERENCES_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().language as LanguageCode;
      }
      return null;
    } catch (error) {
      console.error('Error getting language preference:', error);
      return null;
    }
  }

  // Real-time listener for language changes
  static subscribeToLanguageChanges(userId: string, callback: (language: LanguageCode) => void) {
    const docRef = doc(db, LANGUAGE_PREFERENCES_COLLECTION, userId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const language = docSnap.data().language as LanguageCode;
        callback(language);
      }
    });
  }
}