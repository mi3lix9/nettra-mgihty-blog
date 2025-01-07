export default function makeRTLIfArabicLineByLine(text: string): string {
  // Split the text into lines
  const lines = text.split(/\r?\n/);

  // Helper regex for detecting Arabic characters (0600–06FF range)
  const arabicRegex = /[\u0600-\u06FF]/;

  // Process each line independently
  return lines
    .map((line) => {
      // Split into words and count Arabic words
      const words = line.trim().split(/\s+/);
      let arabicCount = 0;
      for (const word of words) {
        if (arabicRegex.test(word)) {
          arabicCount++;
        }
      }

      // If half or more words are Arabic, prepend RTL override
      if (arabicCount >= words.length / 2 && words.length > 0) {
        return `\u202E${line}`;
      }

      return line;
    })
    .join("\n");
}
