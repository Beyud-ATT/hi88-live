import DOMPurify from "isomorphic-dompurify";

export default class UnifiedTextProcessor {
  constructor(config = {}) {
    this.config = {
      // Text normalization settings
      maxLineBreaks: config.maxLineBreaks || 3,
      maxSpaces: config.maxSpaces || 3,
      preserveEmojis: config.preserveEmojis !== false,
      preserveLinks: config.preserveLinks !== false,

      // Styling settings
      linkStyle:
        config.linkStyle || "text-blue-500 hover:text-blue-700 underline",
      emojiStyle: config.emojiStyle || "inline-block",
      textStyle: config.textStyle || "",

      // Security settings
      allowedTags: config.allowedTags || ["br", "a", "strong", "em", "span"],
      allowedAttributes: config.allowedAttributes || {
        a: ["href", "target", "rel", "class"],
        span: ["class", "style"],
        strong: ["class"],
        em: ["class"],
      },

      ...config,
    };

    // Initialize DOMPurify config
    this.domPurifyConfig = {
      ALLOWED_TAGS: this.config.allowedTags,
      ALLOWED_ATTR: Object.keys(this.config.allowedAttributes).reduce(
        (acc, tag) => {
          return [...acc, ...this.config.allowedAttributes[tag]];
        },
        []
      ),
      KEEP_CONTENT: true,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
    };
  }

  // Detect URLs in text
  detectUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }

  // Detect emojis in text
  detectEmojis(text) {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    return text.match(emojiRegex) || [];
  }

  // Normalize whitespace and line breaks
  normalizeWhitespace(text) {
    // Normalize multiple spaces
    text = text.replace(
      new RegExp(`\\s{${this.config.maxSpaces + 1},}`, "g"),
      " ".repeat(this.config.maxSpaces)
    );

    // Normalize multiple line breaks
    const lineBreakPattern = new RegExp(
      `(<br\\s*\\/?>\\s*){${this.config.maxLineBreaks + 1},}`,
      "gi"
    );
    text = text.replace(
      lineBreakPattern,
      "<br/>".repeat(this.config.maxLineBreaks)
    );

    return text.trim();
  }

  // Process URLs and make them clickable
  processUrls(text) {
    if (!this.config.preserveLinks) return text;

    const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
    return text.replace(urlRegex, (url) => {
      const cleanUrl = url.replace(/[.,;:!?'")\]}]*$/, ""); // Remove trailing punctuation
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="${this.config.linkStyle}">${cleanUrl}</a>`;
    });
  }

  // Process emojis with styling
  processEmojis(text) {
    if (!this.config.preserveEmojis) return text;

    const emojiRegex =
      /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu;
    return text.replace(emojiRegex, (emoji) => {
      return `<span class="${this.config.emojiStyle}">${emoji}</span>`;
    });
  }

  // Process mentions (if you want to add @username functionality)
  processMentions(text) {
    const mentionRegex = /@(\w+)/g;
    return text.replace(
      mentionRegex,
      '<span class="text-blue-600 font-semibold">@$1</span>'
    );
  }

  // Process hashtags (if you want to add #hashtag functionality)
  processHashtags(text) {
    const hashtagRegex = /#(\w+)/g;
    return text.replace(
      hashtagRegex,
      '<span class="text-purple-600 font-semibold">#$1</span>'
    );
  }

  // Main text processing pipeline
  processText(text, options = {}) {
    if (!text || typeof text !== "string") return "";

    const processingOptions = { ...this.config, ...options };

    // Step 1: Initial sanitization
    let processedText = DOMPurify.sanitize(text, this.domPurifyConfig);

    // Step 2: Normalize whitespace
    processedText = this.normalizeWhitespace(processedText);

    // Step 3: Process URLs
    if (processingOptions.preserveLinks) {
      processedText = this.processUrls(processedText);
    }

    // Step 4: Process mentions (optional)
    if (processingOptions.processMentions) {
      processedText = this.processMentions(processedText);
    }

    // Step 5: Process hashtags (optional)
    if (processingOptions.processHashtags) {
      processedText = this.processHashtags(processedText);
    }

    // Step 6: Process emojis
    if (processingOptions.preserveEmojis) {
      processedText = this.processEmojis(processedText);
    }

    // Step 7: Final sanitization
    processedText = DOMPurify.sanitize(processedText, this.domPurifyConfig);

    return processedText;
  }

  // Process text for display with specific styling
  processForDisplay(text, displayOptions = {}) {
    const options = {
      isSpecial: false,
      isOwn: false,
      maxLength: null,
      truncate: false,
      ...displayOptions,
    };

    let processedText = this.processText(text, options);

    // Apply truncation if needed
    if (options.maxLength && processedText.length > options.maxLength) {
      if (options.truncate) {
        processedText = processedText.substring(0, options.maxLength) + "...";
      }
    }

    return processedText;
  }

  // Generate CSS classes based on message type
  getMessageClasses(messageType = "normal", isSpecial = false, isOwn = false) {
    const baseClasses = "break-all leading-relaxed";
    const typeClasses = {
      normal: "text-black text-xs",
      special: "text-[#FF6699] font-semibold text-xs",
      system: "text-[var(--color-brand-primary)] font-medium text-xs",
      warning: "text-orange-500 font-medium text-xs",
      error: "text-red-500 font-medium text-xs",
    };

    let classes = baseClasses;

    if (isSpecial) {
      classes += " " + typeClasses.special;
    } else if (isOwn) {
      classes += " " + typeClasses.normal + " font-medium";
    } else {
      classes += " " + (typeClasses[messageType] || typeClasses.normal);
    }

    return classes;
  }

  // Get username classes
  getUsernameClasses(isSpecial = false) {
    const baseClasses = "text-sm font-medium mb-1 gap-0.5 flex";

    if (isSpecial) {
      return baseClasses + " text-[#FF6699] font-bold";
    }

    return baseClasses + " text-[#0655FF]";
  }
}
