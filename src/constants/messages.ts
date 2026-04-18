/**
 * Constants for error messages, success messages, and validation messages
 * Centralized messages for easier maintenance and consistency
 */

export const ERROR_MESSAGES = {
  // Authentication errors
  AUTH_REQUIRED: "Authentication required. Please log in.",
  UNAUTHORIZED: "Unauthorized. You do not have permission to perform this action.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",

  // Validation errors
  REQUIRED_FIELD: "This field is required",
  INVALID_NUMBER: "Please enter a valid number",
  POSITIVE_NUMBER: "Value must be a positive number",
  MIN_LENGTH: (min: number) => `Minimum length is ${min} characters`,
  MAX_LENGTH: (max: number) => `Maximum length is ${max} characters`,

  // Gamification specific errors
  SPIN_CONFIG: {
    FAILED_LOAD: "Failed to load spin configuration",
    FAILED_SAVE: "Failed to update spin configuration",
    DAILY_LIMIT_REQUIRED: "Daily limit must be a positive number",
    NO_TIERS: "Add at least one reward tier",
    INVALID_COINS: "Coins must be a positive number",
    INVALID_WEIGHT: "Weight must be a positive number",
  },

  MISSION: {
    FAILED_LOAD: "Failed to load missions",
    FAILED_SAVE: "Failed to save mission",
    FAILED_DELETE: "Failed to delete mission",
    TITLE_REQUIRED: "Mission title is required",
    INVALID_COINS: "Reward coins must be a positive number",
    INVALID_TARGET: "Target count must be a positive number",
  },

  CHALLENGE: {
    FAILED_LOAD: "Failed to load challenges",
    FAILED_SAVE: "Failed to save challenge",
    FAILED_ASSIGN: "Failed to assign challenge",
    QUESTION_REQUIRED: "Challenge question is required",
    OPTIONS_REQUIRED: "All 4 answer options are required",
    VALID_CORRECT_OPTION: "Valid correct option index is required",
    INVALID_COINS: "Reward coins must be a positive number",
  },

  BADGE: {
    FAILED_LOAD: "Failed to load badges",
    FAILED_SAVE: "Failed to save badge",
    FAILED_DELETE: "Failed to delete badge",
    CODE_REQUIRED: "Badge code is required",
    NAME_REQUIRED: "Badge name is required",
  },

  TITLE: {
    FAILED_LOAD: "Failed to load titles",
    FAILED_SAVE: "Failed to save title",
    FAILED_DELETE: "Failed to delete title",
    CODE_REQUIRED: "Title code is required",
    NAME_REQUIRED: "Title name is required",
  },

  NOTIFICATION: {
    FAILED_SEND: "Failed to send notification",
    TITLE_REQUIRED: "Notification title is required",
    BODY_REQUIRED: "Notification body is required",
    USER_ID_REQUIRED: "User ID is required for single user notification",
  },

  // Generic API errors
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  API_ERROR: (status: number) => `API Error (${status}). Please try again.`,
} as const;

export const SUCCESS_MESSAGES = {
  SPIN_CONFIG_UPDATED: "Spin configuration updated successfully",
  TIER_ADDED: "Reward tier added",
  TIER_REMOVED: "Reward tier removed",

  MISSION_CREATED: "Mission created successfully",
  MISSION_UPDATED: "Mission updated successfully",
  MISSION_DELETED: "Mission deleted successfully",

  CHALLENGE_CREATED: "Challenge created successfully",
  CHALLENGE_UPDATED: "Challenge updated successfully",
  CHALLENGE_ASSIGNED: "Challenge assigned successfully",

  BADGE_CREATED: "Badge created successfully",
  BADGE_UPDATED: "Badge updated successfully",
  BADGE_DELETED: "Badge deleted successfully",

  TITLE_CREATED: "Title created successfully",
  TITLE_UPDATED: "Title updated successfully",
  TITLE_DELETED: "Title deleted successfully",

  NOTIFICATION_SENT: "Notification sent successfully",
  BROADCAST_NOTIFICATION_SENT: "Broadcast notification sent to all users",
  NOTIFICATION_SENT_TO_USER: (userId: string) => `Notification sent to user ${userId}`,
} as const;

export const LOADING_MESSAGES = {
  LOADING: "Loading...",
  SAVING: "Saving...",
  SENDING: "Sending...",
  REFRESHING: "Refreshing...",
} as const;

export const VALIDATION_RULES = {
  MIN_REWARD_COINS: 1,
  MAX_REWARD_COINS: 1000000,
  MIN_DAILY_LIMIT: 1,
  MAX_DAILY_LIMIT: 100,
  MIN_WEIGHT: 0.1,
  MAX_WEIGHT: 1000,
  MIN_TARGET_COUNT: 1,
  MAX_TARGET_COUNT: 10000,
} as const;
