export default class AntiSpamFilter {
  constructor(config = {}) {
    this.config = {
      maxRepeatedChars: config.maxRepeatedChars || 3,
      maxRepeatedWords: config.maxRepeatedWords || 3,
      maxEmojiSequence: config.maxEmojiSequence || 5,
      maxMessageLength: config.maxMessageLength || 500,
      minTimeBetweenMessages: config.minTimeBetweenMessages || 1000,
      maxSimilarMessages: config.maxSimilarMessages || 3,
      ...config,
    };
    this.userMessageTimestamps = new Map();
    this.recentMessages = new Map(); // Track recent messages per user
  }

  // Check if text contains excessive repeated characters
  hasExcessiveRepeatedChars(text) {
    const pattern = new RegExp(
      `(.)\\1{${this.config.maxRepeatedChars},}`,
      "gi"
    );
    return pattern.test(text);
  }

  // Check if text contains excessive repeated words
  hasExcessiveRepeatedWords(text) {
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = {};

    for (const word of words) {
      if (word.length > 2) {
        wordCount[word] = (wordCount[word] || 0) + 1;
        if (wordCount[word] > this.config.maxRepeatedWords) {
          return true;
        }
      }
    }
    return false;
  }

  // Check if text contains excessive emoji sequences
  hasExcessiveEmojis(text) {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojis = text.match(emojiRegex) || [];

    let consecutiveCount = 0;
    let maxConsecutive = 0;

    for (let i = 0; i < text.length; i++) {
      if (emojiRegex.test(text[i])) {
        consecutiveCount++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      } else {
        consecutiveCount = 0;
      }
    }

    return (
      maxConsecutive > this.config.maxEmojiSequence ||
      emojis.length > text.length * 0.3
    );
  }

  // Check for rate limiting
  isRateLimited(userId) {
    const now = Date.now();
    const lastMessage = this.userMessageTimestamps.get(userId);

    if (lastMessage && now - lastMessage < this.config.minTimeBetweenMessages) {
      return true;
    }

    this.userMessageTimestamps.set(userId, now);
    return false;
  }

  // Check for similar messages (copy-paste spam)
  isSimilarMessageSpam(text, userId) {
    const normalizedText = text.toLowerCase().replace(/\s+/g, " ").trim();

    if (!this.recentMessages.has(userId)) {
      this.recentMessages.set(userId, []);
    }

    const userMessages = this.recentMessages.get(userId);
    const similarCount = userMessages.filter(
      (msg) => this.calculateSimilarity(msg, normalizedText) > 0.8
    ).length;

    // Add current message to recent messages
    userMessages.push(normalizedText);
    if (userMessages.length > 10) {
      userMessages.shift(); // Keep only last 10 messages
    }

    return similarCount >= this.config.maxSimilarMessages;
  }

  // Calculate text similarity (simple approach)
  calculateSimilarity(text1, text2) {
    if (text1 === text2) return 1;

    const shorter = text1.length < text2.length ? text1 : text2;
    const longer = text1.length < text2.length ? text2 : text1;

    if (longer.length === 0) return 1;

    const editDistance = this.levenshteinDistance(shorter, longer);
    return (longer.length - editDistance) / longer.length;
  }

  // Levenshtein distance for similarity calculation
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Check for common spam patterns
  hasSpamPatterns(text) {
    const spamPatterns = [
      /(.)\1{10,}/gi, // Same character repeated 10+ times
      /(.)(\s*\1\s*){10,}/gi, // Same character with spaces repeated
      /^[^\w\s]*$/gi, // Only special characters
      /(.{1,10})\1{5,}/gi, // Short patterns repeated 5+ times
    ];

    return spamPatterns.some((pattern) => pattern.test(text));
  }

  // Normalize and clean text
  normalizeText(text) {
    return text
      .replace(/\s+/g, " ")
      .replace(/([!?.]){4,}/g, "$1$1$1")
      .replace(/(.)(\1{3,})/g, "$1$1$1")
      .trim();
  }

  // Main filter function
  filterMessage(text, userId = "anonymous") {
    const result = {
      isSpam: false,
      originalText: text,
      filteredText: text,
      reasons: [],
    };

    // Empty or whitespace only
    if (!text.trim()) {
      result.isSpam = true;
      result.reasons.push("Empty message");
      return result;
    }

    // Rate limiting check
    if (this.isRateLimited(userId)) {
      result.isSpam = true;
      result.reasons.push("Gửi tin nhắn quá nhanh");
      return result;
    }

    // Message too long
    if (text.length > this.config.maxMessageLength) {
      result.isSpam = true;
      result.reasons.push("Tin nhắn quá dài");
      return result;
    }

    // Check various spam patterns
    if (this.hasExcessiveRepeatedChars(text)) {
      result.isSpam = true;
      result.reasons.push("Lặp lại ký tự quá nhiều");
    }

    if (this.hasExcessiveRepeatedWords(text)) {
      result.isSpam = true;
      result.reasons.push("Lặp lại từ quá nhiều");
    }

    if (this.hasExcessiveEmojis(text)) {
      result.isSpam = true;
      result.reasons.push("Sử dụng quá nhiều emoji");
    }

    if (this.hasSpamPatterns(text)) {
      result.isSpam = true;
      result.reasons.push("Phát hiện spam pattern");
    }

    if (this.isSimilarMessageSpam(text, userId)) {
      result.isSpam = true;
      result.reasons.push("Gửi tin nhắn trùng lặp");
    }

    // If not spam, normalize the text
    if (!result.isSpam) {
      result.filteredText = this.normalizeText(text);
    }

    return result;
  }

  // Filter incoming messages for display
  filterIncomingMessages(messages) {
    return messages.filter((message) => {
      const result = this.filterMessage(message.message, message.userId);
      return !result.isSpam;
    });
  }
}
